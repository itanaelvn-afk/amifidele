/** Google Analytics 4 — chargé uniquement en prod après consentement analytics. */

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export type AffiliateClickParams = {
  productId: string;
  merchantName?: string;
  pagePath?: string;
  /** Emplacement UI (ex. featured_partners, home, listing). */
  placement?: string;
};

export function getGaMeasurementId(): string | undefined {
  const raw = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();
  if (!raw) return undefined;
  // Tolère l'ID sans préfixe G- (erreur fréquente à la saisie Vercel / CLI)
  if (/^G-[A-Z0-9]+$/i.test(raw)) return raw.toUpperCase();
  if (/^[A-Z0-9]+$/i.test(raw)) return `G-${raw.toUpperCase()}`;
  return raw;
}

export function isGaEnabled(): boolean {
  return process.env.NODE_ENV === "production" && Boolean(getGaMeasurementId());
}

function gtag(...args: unknown[]) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag(...args);
}

export function trackPageView(path: string): void {
  const measurementId = getGaMeasurementId();
  if (!measurementId) return;
  gtag("config", measurementId, {
    page_path: path,
    anonymize_ip: true,
    send_page_view: true,
  });
}

/**
 * Met à jour Consent Mode si gtag est déjà chargé (ex. retrait du consentement).
 * Sans effet si les scripts n'ont jamais été injectés.
 */
export function updateGaConsent(analyticsGranted: boolean): void {
  gtag("consent", "update", {
    analytics_storage: analyticsGranted ? "granted" : "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
}

export function trackAffiliateClick({
  productId,
  merchantName,
  pagePath,
  placement,
}: AffiliateClickParams): void {
  gtag("event", "affiliate_click", {
    product_id: productId,
    merchant_name: merchantName ?? undefined,
    page_path: pagePath ?? undefined,
    placement: placement ?? undefined,
  });
}
