/**
 * Gestion de l'authentification et des tokens pour l'API
 */

/**
 * Récupère le token API depuis les variables d'environnement
 * Le token est stocké dans NEXT_PUBLIC_API_KEY pour être accessible côté client
 */
export function getApiToken(): string | null {
  // Pour Next.js, les variables d'environnement préfixées par NEXT_PUBLIC_ sont accessibles côté client
  // Pour la sécurité, vous pouvez aussi utiliser une variable serveur uniquement
  return process.env.NEXT_PUBLIC_API_KEY || process.env.API_KEY || null;
}

/**
 * Vérifie si un token API est configuré
 */
export function hasApiToken(): boolean {
  return getApiToken() !== null;
}

/**
 * Récupère les headers d'authentification pour les requêtes API
 * L'API attend le token dans le header 'x-api-key'
 */
export function getAuthHeaders(): Record<string, string> {
  const token = getApiToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['x-api-key'] = token;
  }

  return headers;
}

/**
 * Valide le format du token (optionnel, pour vérification)
 */
export function isValidTokenFormat(token: string): boolean {
  // Ajoutez votre logique de validation si nécessaire
  // Par exemple, vérifier la longueur, le format, etc.
  return token.length > 0;
}


