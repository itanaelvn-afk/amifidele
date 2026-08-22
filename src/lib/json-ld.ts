import type { CategoryBreadcrumbSegment } from "@/lib/category-breadcrumb";
import { categorySegmentHref } from "@/lib/category-breadcrumb";
import { LEGAL_PUBLISHER } from "@/lib/legal-publisher";
import { productPath, stripHtml } from "@/lib/product-path";
import { DEFAULT_DESCRIPTION, SITE_NAME } from "@/lib/seo";
import { getSiteUrl } from "@/lib/site-url";
import type { DisplayProduct } from "@/lib/types";

function absoluteUrl(path: string): string {
  const base = getSiteUrl().replace(/\/+$/, "");
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalized}`;
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: absoluteUrl("/"),
    description: DEFAULT_DESCRIPTION,
    inLanguage: "fr-FR",
    publisher: {
      "@type": "Person",
      name: LEGAL_PUBLISHER.fullName,
    },
  };
}

export function itemListJsonLd(products: DisplayProduct[], listPath: string) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    url: absoluteUrl(listPath),
    name: "Catalogue produits AmiFidele",
    numberOfItems: products.length,
    itemListElement: products.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: absoluteUrl(productPath(product.id)),
      name: product.name,
    })),
  };
}

export function productJsonLd(product: DisplayProduct) {
  const pageUrl = absoluteUrl(productPath(product.id));
  const description = stripHtml(product.description).slice(0, 500) || undefined;
  const image =
    product.image.startsWith("http://") || product.image.startsWith("https://")
      ? product.image
      : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description,
    image,
    url: pageUrl,
    sku: product.id,
    ...(product.brand
      ? { brand: { "@type": "Brand", name: product.brand } }
      : {}),
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: product.currency || "EUR",
      availability: "https://schema.org/InStock",
      url: product.bestAffiliateLink || pageUrl,
      ...(product.merchantName
        ? { seller: { "@type": "Organization", name: product.merchantName } }
        : {}),
    },
  };
}

export function breadcrumbJsonLd(
  segments: CategoryBreadcrumbSegment[],
  productName: string
) {
  const items: { name: string; url?: string }[] = [
    { name: "Accueil", url: "/" },
    ...segments.map((segment) => ({
      name: segment.label,
      url: categorySegmentHref(segment) ?? undefined,
    })),
    { name: productName },
  ];

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      ...(item.url ? { item: absoluteUrl(item.url) } : {}),
    })),
  };
}
