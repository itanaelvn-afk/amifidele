"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useConsent } from "@/components/consent/ConsentProvider";
import { isGaEnabled, trackPageView } from "@/lib/analytics";

/** Envoie un page_view GA4 à chaque changement de route (App Router). */
export function AnalyticsPageView() {
  const pathname = usePathname();
  const { ready, preferences } = useConsent();

  useEffect(() => {
    if (!ready || !isGaEnabled() || !preferences.analytics) return;
    trackPageView(pathname);
  }, [ready, preferences.analytics, pathname]);

  return null;
}
