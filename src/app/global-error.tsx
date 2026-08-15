"use client";

import { useEffect } from "react";
import { ErrorState } from "@/components/ErrorState";
import "./globals.css";

/**
 * Erreur au niveau du root layout (remplace tout le document).
 * Doit fournir `<html>` / `<body>` et recharger les styles.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[AmiFidele] erreur globale:", error);
  }, [error]);

  return (
    <html lang="fr">
      <body className="antialiased min-h-screen bg-background text-foreground">
        <ErrorState
          code="Erreur"
          title="Une erreur est survenue"
          description="L’application n’a pas pu s’afficher correctement. Réessayez ou rechargez la page."
          actions={[
            { label: "Réessayer", onClick: () => reset() },
            { href: "/", label: "Retour à l’accueil", variant: "outline" },
          ]}
        />
      </body>
    </html>
  );
}
