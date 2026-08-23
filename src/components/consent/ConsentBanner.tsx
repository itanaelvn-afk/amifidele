"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useConsent } from "@/components/consent/ConsentProvider";
import type { ConsentPreferences } from "@/lib/consent";

function PreferencesPanel({
  titleId,
  preferences,
  hasDecision,
  onClose,
  onRefuseAll,
  onSave,
}: {
  titleId: string;
  preferences: ConsentPreferences;
  hasDecision: boolean;
  onClose: () => void;
  onRefuseAll: () => void;
  onSave: (prefs: { analytics: boolean; marketing: boolean }) => void;
}) {
  const [draftAnalytics, setDraftAnalytics] = useState(preferences.analytics);
  const [draftMarketing, setDraftMarketing] = useState(preferences.marketing);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-4 bg-foreground/40"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      onClick={(e) => {
        if (e.target === e.currentTarget && hasDecision) onClose();
      }}
    >
      <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-xl max-h-[90vh] overflow-y-auto">
        <h2 id={titleId} className="text-xl font-bold mb-2">
          Préférences cookies
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          Choisissez les catégories autorisées. Les cookies strictement
          nécessaires restent actifs. Détail :{" "}
          <Link href="/cookies" className="underline hover:text-primary">
            page Cookies
          </Link>
          .
        </p>

        <ul className="space-y-4 mb-6">
          <li className="rounded-xl border border-border p-4">
            <div className="flex items-center justify-between gap-3 mb-1">
              <span className="font-semibold">Nécessaires</span>
              <span className="text-xs text-muted-foreground">Toujours actifs</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Mémorisation de vos choix de consentement et fonctionnement
              technique du site.
            </p>
          </li>
          <li className="rounded-xl border border-border p-4">
            <label className="flex items-start justify-between gap-3 cursor-pointer">
              <span>
                <span className="font-semibold block mb-1">Mesure d&apos;audience</span>
                <span className="text-sm text-muted-foreground">
                  Statistiques de visite (ex. Plausible / GA4). Aucun script
                  n&apos;est branché pour l&apos;instant.
                </span>
              </span>
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 accent-[var(--primary)]"
                checked={draftAnalytics}
                onChange={(e) => setDraftAnalytics(e.target.checked)}
              />
            </label>
          </li>
          <li className="rounded-xl border border-border p-4">
            <label className="flex items-start justify-between gap-3 cursor-pointer">
              <span>
                <span className="font-semibold block mb-1">Marketing</span>
                <span className="text-sm text-muted-foreground">
                  Publicité / widgets display. Aucun script n&apos;est branché
                  pour l&apos;instant.
                </span>
              </span>
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 accent-[var(--primary)]"
                checked={draftMarketing}
                onChange={(e) => setDraftMarketing(e.target.checked)}
              />
            </label>
          </li>
        </ul>

        <div className="flex flex-col sm:flex-row gap-2 sm:justify-end">
          {hasDecision && (
            <Button variant="ghost" onClick={onClose}>
              Annuler
            </Button>
          )}
          <Button variant="outline" onClick={onRefuseAll}>
            Tout refuser
          </Button>
          <Button
            onClick={() =>
              onSave({
                analytics: draftAnalytics,
                marketing: draftMarketing,
              })
            }
          >
            Enregistrer
          </Button>
        </div>
      </div>
    </div>
  );
}

/**
 * Bannière + panneau de préférences cookies.
 * N’affiche la barre que si aucun choix n’est encore enregistré.
 */
export function ConsentBanner() {
  const {
    ready,
    hasDecision,
    preferences,
    panelOpen,
    openPanel,
    closePanel,
    acceptAll,
    refuseAll,
    saveCustom,
  } = useConsent();

  const titleId = useId();

  if (!ready) return null;

  const showBar = !hasDecision && !panelOpen;

  return (
    <>
      {showBar && (
        <div
          className="fixed bottom-0 inset-x-0 z-50 border-t border-border bg-card/95 backdrop-blur-md shadow-[0_-8px_30px_rgba(62,39,35,0.12)]"
          role="region"
          aria-labelledby={titleId}
        >
          <div className="container mx-auto px-4 py-4 md:py-5 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p id={titleId} className="font-semibold text-foreground mb-1">
                Cookies et confidentialité
              </p>
              <p className="text-sm text-muted-foreground">
                Nous utilisons uniquement un stockage local pour mémoriser vos
                choix. Aucun cookie analytics ou publicitaire n&apos;est chargé
                sans votre accord.{" "}
                <Link href="/cookies" className="underline hover:text-primary">
                  En savoir plus
                </Link>
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 shrink-0">
              <Button variant="outline" onClick={refuseAll}>
                Tout refuser
              </Button>
              <Button variant="outline" onClick={openPanel}>
                Personnaliser
              </Button>
              <Button onClick={acceptAll}>Tout accepter</Button>
            </div>
          </div>
        </div>
      )}

      {panelOpen && (
        <PreferencesPanel
          key={preferences.updatedAt || "new"}
          titleId={`${titleId}-panel`}
          preferences={preferences}
          hasDecision={hasDecision}
          onClose={closePanel}
          onRefuseAll={refuseAll}
          onSave={saveCustom}
        />
      )}
    </>
  );
}
