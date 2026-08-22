"use client";

import { useConsent } from "@/components/consent/ConsentProvider";

/**
 * Point d’extension pour scripts non essentiels.
 * Ne charge rien tant qu’aucun outil n’est configuré — prêt pour
 * Plausible / GA4 / widgets Awin derrière le consentement.
 */
export function ConsentScripts() {
  const { ready, preferences } = useConsent();

  if (!ready) return null;

  // Placeholders : brancher ici les scripts conditionnels.
  // Ex. if (preferences.analytics && process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN) …
  void preferences.analytics;
  void preferences.marketing;

  return null;
}
