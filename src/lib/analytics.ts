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
};

export function getGaMeasurementId(): string | undefined {
  const id = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();
  return id || undefined;
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
  gtag("config", measurementId, { page_path: path });
}

export function trackAffiliateClick({
  productId,
  merchantName,
  pagePath,
}: AffiliateClickParams): void {
  gtag("event", "affiliate_click", {
    product_id: productId,
    merchant_name: merchantName ?? undefined,
    page_path: pagePath ?? undefined,
  });
}
