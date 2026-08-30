"use client";

import Script from "next/script";
import { useConsent } from "@/components/consent/ConsentProvider";
import { getGaMeasurementId, isGaEnabled } from "@/lib/analytics";

/**
 * Scripts non essentiels (GA4, bannières Awin via AwinAdSlot…) derrière le consentement.
 */
export function ConsentScripts() {
  const { ready, preferences } = useConsent();
  const measurementId = getGaMeasurementId();
  const loadGa = ready && isGaEnabled() && preferences.analytics && measurementId;

  if (!loadGa) {
    return null;
  }

  const inlineInit = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('consent', 'default', {
      analytics_storage: 'granted',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied'
    });
    gtag('config', '${measurementId}', {
      anonymize_ip: true,
      send_page_view: false
    });
  `;

  return (
    <>
      <Script id="ga4-init" strategy="afterInteractive">
        {inlineInit}
      </Script>
      <Script
        id="ga4-gtag"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
      />
    </>
  );
}
