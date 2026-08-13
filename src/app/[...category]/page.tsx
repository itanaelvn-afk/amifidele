import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchCategories, type Category } from "@/lib/api";
import { SiteChrome } from "@/components/SiteChrome";
import { CategoryProductGrid } from "@/components/CategoryProductGrid";
import { Card, CardContent } from "@/components/ui/card";
import {
  RESERVED_PATH_ROOTS,
  categoryPath,
  slugFromSegments,
} from "@/lib/category-path";
import { DEFAULT_OG_IMAGE, SITE_NAME } from "@/lib/seo";

type RouteParams = { category: string[] };

function findCategory(categories: Category[], slug: string): Category | undefined {
  return categories.find((c) => (c.slug || c.id) === slug);
}

export async function generateStaticParams() {
  const categories = await fetchCategories();
  return categories
    .map((c) => c.slug || c.id || "")
    .filter((slug) => slug && !RESERVED_PATH_ROOTS.has(slug.split("/")[0]))
    .map((slug) => ({ category: slug.split("/") }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { category: segments } = await params;
  const slug = slugFromSegments(segments ?? []);
  const categories = await fetchCategories();
  const cat = findCategory(categories, slug);
  if (!cat) {
    return { title: "Catégorie introuvable | AmiFidele", robots: { index: false, follow: false } };
  }
  const title = `${cat.name} | AmiFidele`;
  const description = `Comparez les produits ${cat.name.toLowerCase()} pour animaux sur AmiFidele.`;
  return {
    title,
    description,
    alternates: { canonical: categoryPath(slug) },
    openGraph: {
      title,
      description,
      url: categoryPath(slug),
      type: "website",
      locale: "fr_FR",
      siteName: SITE_NAME,
      images: [{ url: DEFAULT_OG_IMAGE, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [DEFAULT_OG_IMAGE],
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { category: segments } = await params;
  const parts = segments ?? [];
  if (parts.length === 0 || parts.length > 2) {
    notFound();
  }
  if (RESERVED_PATH_ROOTS.has(parts[0])) {
    notFound();
  }

  const slug = slugFromSegments(parts);
  const categories = await fetchCategories();
  const cat = findCategory(categories, slug);
  if (!cat) {
    notFound();
  }

  const children = categories.filter((c) => c.parentId === (cat.slug || cat.id));
  const parent = cat.parentId ? findCategory(categories, cat.parentId) : undefined;

  return (
    <SiteChrome current="other">
      <main className="container mx-auto px-4 py-10">
        <nav className="text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-primary">
            Accueil
          </Link>
          {parent && (
            <>
              <span className="mx-2">/</span>
              <Link href={categoryPath(parent.slug || parent.id || "")} className="hover:text-primary">
                {parent.name}
              </Link>
            </>
          )}
          <span className="mx-2">/</span>
          <span className="text-foreground">{cat.name}</span>
        </nav>

        <h1 className="text-4xl font-bold mb-3">{cat.name}</h1>
        <p className="text-muted-foreground text-lg mb-10">
          Comparez les offres {cat.name.toLowerCase()} chez les marchands partenaires.
        </p>

        {children.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-semibold mb-4">Sous-catégories</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {children.map((child) => {
                const childSlug = child.slug || child.id || "";
                return (
                  <Link key={childSlug} href={categoryPath(childSlug)}>
                    <Card className="h-full hover:border-primary hover:shadow-md transition-all">
                      <CardContent className="p-5">
                        <p className="font-medium">{child.name}</p>
                        {child.label && child.label !== child.name && (
                          <p className="text-sm text-muted-foreground mt-1">{child.label}</p>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        <CategoryProductGrid categoryId={cat.slug || cat.id || slug} />
      </main>
    </SiteChrome>
  );
}
