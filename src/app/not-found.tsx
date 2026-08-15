import { SiteChrome } from "@/components/SiteChrome";
import { ErrorState } from "@/components/ErrorState";

/**
 * 404 globale (URL inconnue ou `notFound()` sans not-found segmentaire).
 * Les routes produit / catégorie ont leurs propres messages plus précis.
 */
export default function NotFound() {
  return (
    <SiteChrome current="other">
      <ErrorState
        code="404"
        title="Page introuvable"
        description="Cette adresse n’existe pas ou n’est plus disponible sur AmiFidele."
        actions={[
          { href: "/", label: "Retour à l’accueil" },
          { href: "/produits", label: "Voir le catalogue", variant: "outline" },
          { href: "/contact", label: "Contact", variant: "ghost" },
        ]}
      />
    </SiteChrome>
  );
}
