/**
 * Configuration API AmiFidele (site public).
 *
 * - Navigateur → `/api/bff/...` (pas de clé)
 * - Serveur (RSC / scripts) → URL upstream + `API_TOKEN`
 */

import { getAuthHeaders } from "./auth";

const DEFAULT_UPSTREAM = "http://localhost:4000/api";
const BFF_BASE = "/api/bff";

function getUpstreamBaseURL(): string {
  const raw =
    process.env.API_URL ||
    process.env.API_UPSTREAM_URL ||
    DEFAULT_UPSTREAM;
  return raw.replace(/\/$/, "");
}

/**
 * Base URL selon le runtime :
 * - client : BFF same-origin
 * - serveur : API réelle (évite une boucle HTTP vers soi-même)
 */
export function getApiBaseURL(): string {
  if (typeof window === "undefined") {
    return getUpstreamBaseURL();
  }
  return BFF_BASE;
}

export const API_CONFIG = {
  /** @deprecated Préférer getApiBaseURL() — conservé pour compat lecture. */
  get baseURL() {
    return getApiBaseURL();
  },
  timeout: 10000,
  retryAttempts: 3,
  retryDelay: 1000,
  cacheRevalidate: 3600,
  bffBase: BFF_BASE,
  upstreamBase: getUpstreamBaseURL(),
};

/**
 * Headers selon le runtime (clé uniquement côté serveur).
 */
export function getDefaultHeaders(): Record<string, string> {
  return getAuthHeaders();
}

export function getDefaultFetchOptions() {
  return {
    method: "GET" as const,
    headers: getDefaultHeaders(),
    next: { revalidate: API_CONFIG.cacheRevalidate },
  };
}
