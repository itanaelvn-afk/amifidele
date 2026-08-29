"use client";

import { useMemo } from "react";
import { useConsent } from "@/components/consent/ConsentProvider";
import { CookieSettingsButton } from "@/components/consent/CookieSettingsButton";
import {
  type AwinAdSlotId,
  getAwinAdSlot,
  isAwinAdsGloballyEnabled,
  resolveAwinAdCreative,
} from "@/lib/awin-ads-config";
import { cn } from "@/components/utils";

type AwinAdSlotProps = {
  slotId: AwinAdSlotId;
  className?: string;
};

/**
 * Emplacement bannière Awin semi-auto.
 * Affiche uniquement si : kill switch OK + créa configurée + consentement marketing.
 */
export function AwinAdSlot({ slotId, className }: AwinAdSlotProps) {
  const { ready, preferences } = useConsent();
  const slot = getAwinAdSlot(slotId);
  const creative = useMemo(() => resolveAwinAdCreative(slotId), [slotId]);

  if (!isAwinAdsGloballyEnabled() || !slot?.enabled || !creative) {
    return null;
  }

  if (!ready) {
    return (
      <div
        className={cn("flex justify-center py-4", className)}
        aria-hidden="true"
      >
        <div
          className="bg-muted/40 rounded-md"
          style={{
            width: Math.min(creative.width, 728),
            height: Math.min(creative.height, 90),
            maxWidth: "100%",
          }}
        />
      </div>
    );
  }

  if (!preferences.marketing) {
    return (
      <aside
        className={cn(
          "mx-auto max-w-3xl rounded-lg border border-dashed border-border bg-muted/20 px-4 py-3 text-center",
          className
        )}
        aria-label="Publicité partenaire désactivée"
      >
        <p className="text-sm text-muted-foreground mb-2">
          Offre partenaire masquée — acceptez la catégorie{" "}
          <strong className="text-foreground">Marketing</strong> pour
          l&apos;afficher.
        </p>
        <CookieSettingsButton className="text-sm text-primary underline hover:text-primary/80" />
      </aside>
    );
  }

  const label = slot.label ?? "Offre partenaire";

  return (
    <aside
      className={cn("flex flex-col items-center gap-2 py-4", className)}
      aria-label={label}
      data-awin-slot={slotId}
      data-awin-creative={creative.id}
    >
      <p className="text-xs uppercase tracking-wide text-muted-foreground">
        {label}
        {creative.advertiser ? ` · ${creative.advertiser}` : ""}
      </p>
      <a
        href={creative.clickUrl}
        target="_blank"
        rel="nofollow sponsored noopener noreferrer"
        className="inline-block max-w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
      >
        {/* img natif : cshow.php compte les impressions ; next/image casserait le tracking */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={creative.imageUrl}
          alt={creative.alt}
          width={creative.width}
          height={creative.height}
          className="h-auto max-w-full"
          loading="lazy"
          decoding="async"
        />
      </a>
    </aside>
  );
}
