"use client";

import type { ReactNode } from "react";
import { AnalyticsPageView } from "@/components/consent/AnalyticsPageView";
import { ConsentProvider } from "@/components/consent/ConsentProvider";
import { ConsentBanner } from "@/components/consent/ConsentBanner";
import { ConsentScripts } from "@/components/consent/ConsentScripts";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ConsentProvider>
      {children}
      <ConsentBanner />
      <ConsentScripts />
      <AnalyticsPageView />
    </ConsentProvider>
  );
}
