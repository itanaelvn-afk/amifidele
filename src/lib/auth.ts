/**
 * Authentification API — côté serveur uniquement.
 * Le navigateur n'envoie jamais la clé : il passe par `/api/bff/*`.
 */

/**
 * Token service pour appels serveur → api-amifidele (Route Handlers, RSC).
 * Ne jamais préfixer avec NEXT_PUBLIC_.
 */
export function getApiToken(): string | null {
  return (
    process.env.API_TOKEN ||
    process.env.API_KEY ||
    process.env.API_TOKEN_AUTH ||
    null
  );
}

export function hasApiToken(): boolean {
  return getApiToken() !== null;
}

/**
 * Headers pour les appels directs serveur → API upstream.
 * Ne pas utiliser depuis le code client.
 */
export function getAuthHeaders(): Record<string, string> {
  if (typeof window !== "undefined") {
    return { "Content-Type": "application/json" };
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  const token = getApiToken();
  if (token) {
    headers["x-api-key"] = token;
  }

  return headers;
}

export function isValidTokenFormat(token: string): boolean {
  return token.length > 0;
}
