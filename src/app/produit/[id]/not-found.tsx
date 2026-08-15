import Link from "next/link";
import { SiteChrome } from "@/components/SiteChrome";
import { ErrorState } from "@/components/ErrorState";

export default function ProduitNotFound() {
  return (
    <SiteChrome current="other">
      <ErrorState
        code="404"
        title="Produit introuvable"
        description="Cette fiche n’existe pas ou n’est plus visible sur AmiFidele."
        actions={[
          { href: "/produits", label: "Voir le catalogue" },
          { href: "/", label: "Retour à l’accueil", variant: "outline" },
        ]}
      />
    </SiteChrome>
  );
}
