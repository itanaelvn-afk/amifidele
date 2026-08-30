"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  CONSENT_STORAGE_KEY,
  DEFAULT_CONSENT,
  OPEN_CONSENT_EVENT,
  readStoredConsent,
  writeStoredConsent,
  type ConsentPreferences,
} from "@/lib/consent";
import { updateGaConsent } from "@/lib/analytics";

const CONSENT_CHANGE_EVENT = "amifidele:consent-changed";

function subscribeConsent(onChange: () => void) {
  const handler = () => onChange();
  window.addEventListener("storage", handler);
  window.addEventListener(CONSENT_CHANGE_EVENT, handler);
  return () => {
    window.removeEventListener("storage", handler);
    window.removeEventListener(CONSENT_CHANGE_EVENT, handler);
  };
}

function getConsentSnapshot(): ConsentPreferences | null {
  return readStoredConsentCached();
}

/** Snapshot stable pour useSyncExternalStore (React exige la même référence si les données n'ont pas changé). */
let consentSnapshotCache: { raw: string | null; value: ConsentPreferences | null } | null =
  null;

function readStoredConsentCached(): ConsentPreferences | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
  if (consentSnapshotCache && consentSnapshotCache.raw === raw) {
    return consentSnapshotCache.value;
  }
  const value = readStoredConsent();
  consentSnapshotCache = { raw, value };
  return value;
}

function getServerConsentSnapshot(): ConsentPreferences | null {
  return null;
}

function notifyConsentChanged() {
  window.dispatchEvent(new Event(CONSENT_CHANGE_EVENT));
}

type ConsentContextValue = {
  ready: boolean;
  hasDecision: boolean;
  preferences: ConsentPreferences;
  panelOpen: boolean;
  openPanel: () => void;
  closePanel: () => void;
  acceptAll: () => void;
  refuseAll: () => void;
  saveCustom: (prefs: { analytics: boolean; marketing: boolean }) => void;
};

const ConsentContext = createContext<ConsentContextValue | null>(null);

export function ConsentProvider({ children }: { children: ReactNode }) {
  const stored = useSyncExternalStore(
    subscribeConsent,
    getConsentSnapshot,
    getServerConsentSnapshot
  );
  const hydrated = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const [panelOpen, setPanelOpen] = useState(false);

  useEffect(() => {
    const onOpen = () => setPanelOpen(true);
    window.addEventListener(OPEN_CONSENT_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_CONSENT_EVENT, onOpen);
  }, []);

  const preferences = stored ?? DEFAULT_CONSENT;
  const hasDecision = stored != null;

  const persist = useCallback((analytics: boolean, marketing: boolean) => {
    writeStoredConsent({ analytics, marketing });
    // Si gtag était déjà chargé, coupe la mesure côté Consent Mode (cookies _ga peuvent rester).
    updateGaConsent(analytics);
    notifyConsentChanged();
    setPanelOpen(false);
  }, []);

  const value = useMemo<ConsentContextValue>(
    () => ({
      ready: hydrated,
      hasDecision,
      preferences,
      panelOpen,
      openPanel: () => setPanelOpen(true),
      closePanel: () => setPanelOpen(false),
      acceptAll: () => persist(true, true),
      refuseAll: () => persist(false, false),
      saveCustom: ({ analytics, marketing }) => persist(analytics, marketing),
    }),
    [hydrated, hasDecision, preferences, panelOpen, persist]
  );

  return (
    <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>
  );
}

export function useConsent(): ConsentContextValue {
  const ctx = useContext(ConsentContext);
  if (!ctx) {
    throw new Error("useConsent doit être utilisé dans ConsentProvider");
  }
  return ctx;
}

/** Export pour tests / debug éventuel */
export { CONSENT_STORAGE_KEY };
