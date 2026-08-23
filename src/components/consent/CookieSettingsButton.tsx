"use client";

import type { ReactNode } from "react";
import { openConsentPreferences } from "@/lib/consent";

/** Bouton / lien pour rouvrir le panneau CMP. */
export function CookieSettingsButton({
  className,
  children = "Gérer mes cookies",
}: {
  className?: string;
  children?: ReactNode;
}) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => openConsentPreferences()}
    >
      {children}
    </button>
  );
}
