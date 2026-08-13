import type { Metadata } from "next";
import { SiteChrome } from "@/components/SiteChrome";
import { ComparisonPage } from "@/components/ComparisonPage";

export const metadata: Metadata = {
  title: "Catalogue produits | AmiFidele",
  description:
    "Parcourez le catalogue AmiFidele : comparez les prix, les frais de port et les offres des marchands pour vos animaux.",
};

export default function ProduitsPage() {
  return (
    <SiteChrome current="produits">
      <ComparisonPage />
    </SiteChrome>
  );
}
