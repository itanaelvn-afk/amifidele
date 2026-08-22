/** Consentement cookies AmiFidele (localStorage, pas de cookie tiers). */

export const CONSENT_STORAGE_KEY = "amifidele-consent-v1";
export const CONSENT_VERSION = 1;
export const OPEN_CONSENT_EVENT = "amifidele:open-consent";

export type ConsentPreferences = {
  version: number;
  /** Toujours true — stockage du choix / fonctionnement du site */
  necessary: true;
  /** Mesure d’audience (Plausible / GA4…) — inactif tant qu’aucun script n’est branché */
  analytics: boolean;
  /** Marketing / pubs display — inactif tant qu’aucun script n’est branché */
  marketing: boolean;
  updatedAt: string;
};

export const DEFAULT_CONSENT: ConsentPreferences = {
  version: CONSENT_VERSION,
  necessary: true,
  analytics: false,
  marketing: false,
  updatedAt: "",
};

export function openConsentPreferences(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(OPEN_CONSENT_EVENT));
}

export function readStoredConsent(): ConsentPreferences | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<ConsentPreferences>;
    if (parsed.version !== CONSENT_VERSION) return null;
    return {
      version: CONSENT_VERSION,
      necessary: true,
      analytics: Boolean(parsed.analytics),
      marketing: Boolean(parsed.marketing),
      updatedAt: typeof parsed.updatedAt === "string" ? parsed.updatedAt : "",
    };
  } catch {
    return null;
  }
}

export function writeStoredConsent(
  prefs: Omit<ConsentPreferences, "version" | "necessary" | "updatedAt"> & {
    analytics: boolean;
    marketing: boolean;
  }
): ConsentPreferences {
  const next: ConsentPreferences = {
    version: CONSENT_VERSION,
    necessary: true,
    analytics: prefs.analytics,
    marketing: prefs.marketing,
    updatedAt: new Date().toISOString(),
  };
  window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(next));
  return next;
}
