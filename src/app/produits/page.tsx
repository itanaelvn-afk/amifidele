import { Suspense } from "react";
import { CatalogHero } from "@/components/CatalogHero";
import { JsonLd } from "@/components/JsonLd";
import { ProductGridSkeleton } from "@/components/ProductGridSkeleton";
import { SiteChrome } from "@/components/SiteChrome";
import { ComparisonPage } from "@/components/ComparisonPage";
import { fetchProducts } from "@/lib/api";
import { getCatalogFilterOptions } from "@/lib/get-catalog-filter-options";
import { itemListJsonLd } from "@/lib/json-ld";
import { pageMetadata } from "@/lib/seo";
import { mapApiProductsToDisplayProducts } from "@/lib/utils/api-utils";

export const metadata = pageMetadata({
  title: "Comparer les produits animaux",
  description:
    "Parcourez le catalogue AmiFidele : comparez les prix, les frais de port et les offres des marchands pour vos animaux.",
  path: "/produits",
});

function ProductCatalogFallback() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="h-40 rounded-xl bg-muted animate-pulse mb-6" aria-hidden="true" />
      <ProductGridSkeleton count={8} />
      <p className="sr-only">Chargement du catalogue…</p>
    </div>
  );
}

export default async function ProduitsPage() {
  let catalogJsonLd: ReturnType<typeof itemListJsonLd> | null = null;

  const [productsResult, filterOptions] = await Promise.all([
    fetchProducts(1, 12).catch(() => null),
    getCatalogFilterOptions().catch(() => null),
  ]);

  if (productsResult) {
    const products = mapApiProductsToDisplayProducts(productsResult.products);
    if (products.length > 0) {
      catalogJsonLd = itemListJsonLd(products, "/produits");
    }
  }

  return (
    <SiteChrome current="produits">
      {catalogJsonLd ? <JsonLd data={catalogJsonLd} /> : null}
      <CatalogHero />
      <Suspense fallback={<ProductCatalogFallback />}>
        <ComparisonPage filterOptions={filterOptions} />
      </Suspense>
    </SiteChrome>
  );
}
