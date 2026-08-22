import { Suspense } from "react";
import { CatalogHero } from "@/components/CatalogHero";
import { JsonLd } from "@/components/JsonLd";
import { ProductGridSkeleton } from "@/components/ProductGridSkeleton";
import { SiteChrome } from "@/components/SiteChrome";
import { ComparisonPage } from "@/components/ComparisonPage";
import { fetchProducts } from "@/lib/api";
import { itemListJsonLd } from "@/lib/json-ld";
import { pageMetadata } from "@/lib/seo";
import { mapApiProductsToDisplayProducts } from "@/lib/utils/api-utils";

export const metadata = pageMetadata({
  title: "Catalogue produits | AmiFidele",
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

  try {
    const response = await fetchProducts(1, 12);
    const products = mapApiProductsToDisplayProducts(response.products);
    if (products.length > 0) {
      catalogJsonLd = itemListJsonLd(products, "/produits");
    }
  } catch {
    // Données structurées optionnelles — la page reste utilisable sans API.
  }

  return (
    <SiteChrome current="produits">
      {catalogJsonLd ? <JsonLd data={catalogJsonLd} /> : null}
      <CatalogHero />
      <Suspense fallback={<ProductCatalogFallback />}>
        <ComparisonPage />
      </Suspense>
    </SiteChrome>
  );
}
