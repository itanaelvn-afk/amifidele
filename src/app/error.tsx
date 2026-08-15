"use client";

import { useEffect } from "react";
import { SiteChrome } from "@/components/SiteChrome";
import { ErrorState } from "@/components/ErrorState";

/**
 * Erreur runtime dans un segment sous le layout racine.
 * Évite l’écran blanc ; `reset` relance le rendu du segment.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[AmiFidele] erreur de page:", error);
  }, [error]);

  return (
    <SiteChrome current="other">
      <ErrorState
        code="Erreur"
        title="Une erreur est survenue"
        description="Le chargement de cette page a échoué. Vous pouvez réessayer ou revenir à l’accueil."
        actions={[
          { label: "Réessayer", onClick: () => reset() },
          { href: "/", label: "Retour à l’accueil", variant: "outline" },
          { href: "/contact", label: "Contact", variant: "ghost" },
        ]}
      />
    </SiteChrome>
  );
}
