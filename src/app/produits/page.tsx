import { SiteChrome } from "@/components/SiteChrome";
import { ComparisonPage } from "@/components/ComparisonPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Catalogue produits | AmiFidele",
  description:
    "Parcourez le catalogue AmiFidele : comparez les prix, les frais de port et les offres des marchands pour vos animaux.",
  path: "/produits",
});

export default function ProduitsPage() {
  return (
    <SiteChrome current="produits">
      <ComparisonPage />
    </SiteChrome>
  );
}
