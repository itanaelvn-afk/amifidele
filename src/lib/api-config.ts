/**
 * Configuration centralisée pour l'API
 * Cette configuration peut être étendue selon vos besoins
 */

import { getAuthHeaders } from './auth';

export const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api',
  timeout: 10000, // 10 secondes
  retryAttempts: 3,
  retryDelay: 1000, // 1 seconde
  cacheRevalidate: 3600, // 1 heure en secondes
};

/**
 * Headers par défaut pour les requêtes API
 * Inclut automatiquement le token d'authentification si disponible
 */
export const getDefaultHeaders = () => {
  return getAuthHeaders();
};

/**
 * Options de fetch par défaut
 */
export const getDefaultFetchOptions = () => ({
  method: 'GET',
  headers: getDefaultHeaders(),
  next: { revalidate: API_CONFIG.cacheRevalidate },
});

