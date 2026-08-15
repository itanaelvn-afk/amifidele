import type { MetadataRoute } from "next";
import { fetchCategories, fetchProducts } from "@/lib/api";
import {
  RESERVED_PATH_ROOTS,
  categoryPath,
} from "@/lib/category-path";
import { productPath } from "@/lib/product-path";
import { getSiteUrl } from "@/lib/site-url";

export const revalidate = 3600;

const STATIC_PAGES: Array<{
  path: string;
  changeFrequency: NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;
  priority: number;
}> = [
  { path: "/", changeFrequency: "daily", priority: 1 },
  { path: "/produits", changeFrequency: "daily", priority: 0.9 },
  { path: "/contact", changeFrequency: "yearly", priority: 0.4 },
  { path: "/cgu", changeFrequency: "yearly", priority: 0.2 },
  { path: "/confidentialite", changeFrequency: "yearly", priority: 0.2 },
  { path: "/cookies", changeFrequency: "yearly", priority: 0.2 },
  { path: "/mentions-legales", changeFrequency: "yearly", priority: 0.2 },
];

const PRODUCT_PAGE_SIZE = 100;
const MAX_PRODUCT_PAGES = 100;

function absoluteUrl(base: string, path: string): string {
  if (path === "/") return base;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

function parseDate(value?: string): Date | undefined {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

async function categoryEntries(base: string): Promise<MetadataRoute.Sitemap> {
  try {
    const categories = await fetchCategories();
    return categories.flatMap((cat) => {
      const slug = cat.slug || cat.id || "";
      if (!slug || slug === "autre") return [];
      if (RESERVED_PATH_ROOTS.has(slug.split("/")[0])) return [];
      return [
        {
          url: absoluteUrl(base, categoryPath(slug)),
          changeFrequency: "weekly" as const,
          priority: cat.parentId ? 0.8 : 0.85,
        },
      ];
    });
  } catch (error) {
    console.error("Sitemap : impossible de lister les catégories", error);
    return [];
  }
}

async function productEntries(base: string): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];
  try {
    let page = 1;
    let totalPages = 1;
    while (page <= totalPages && page <= MAX_PRODUCT_PAGES) {
      const response = await fetchProducts(page, PRODUCT_PAGE_SIZE);
      totalPages = Math.max(1, response.totalPages || 1);
      for (const product of response.products) {
        const id = product._id || product.id;
        if (!id) continue;
        const lastModified =
          parseDate(product.updatedAt) || parseDate(product.lastSeenAt);
        entries.push({
          url: absoluteUrl(base, productPath(id)),
          ...(lastModified ? { lastModified } : {}),
          changeFrequency: "daily",
          priority: 0.6,
        });
      }
      if (response.products.length === 0) break;
      page += 1;
    }
  } catch (error) {
    console.error("Sitemap : impossible de lister les produits", error);
  }
  return entries;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_PAGES.map((page) => ({
    url: absoluteUrl(base, page.path),
    lastModified: now,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));

  const [categories, products] = await Promise.all([
    categoryEntries(base),
    productEntries(base),
  ]);

  return [...staticEntries, ...categories, ...products];
}
