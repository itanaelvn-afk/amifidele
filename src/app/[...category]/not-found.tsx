import { SiteChrome } from "@/components/SiteChrome";
import { ErrorState } from "@/components/ErrorState";

export default function CategoryNotFound() {
  return (
    <SiteChrome current="other">
      <ErrorState
        code="404"
        title="Catégorie introuvable"
        description="Cette page ne correspond pas à une catégorie AmiFidele."
        actions={[
          { href: "/produits", label: "Voir le catalogue" },
          { href: "/", label: "Retour à l’accueil", variant: "outline" },
        ]}
      />
    </SiteChrome>
  );
}
