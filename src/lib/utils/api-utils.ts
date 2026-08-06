/**
 * Utilitaires pour convertir les données de l'API au format utilisé par l'application
 */

import { DisplayProduct } from '../types';
import { ApiProduct } from '../api';

/**
 * Convertit un produit de l'API (structure dashboard) au format d'affichage simplifié
 */
export function mapApiProductToDisplayProduct(apiProduct: ApiProduct): DisplayProduct {
  // Extraire le prix
  const price = apiProduct.price?.buynow || 0;
  
  // Extraire l'image (priorité: mImage > awImage > awThumb)
  const image = apiProduct.uri?.mImage || apiProduct.uri?.awImage || apiProduct.uri?.awThumb || '/images/placeholder.jpg';

  // Extraire le nom et la description
  const name = apiProduct.text?.name || '';
  const description = apiProduct.text?.desc || '';
  
  // Extraire la catégorie
  const category = apiProduct.cat?.mCat || apiProduct.mainCategory?.mCat || apiProduct.mainCategory?.name || 'Autre';
  
  // Extraire la marque
  const brand = apiProduct.brand?.brandName || 'Marque inconnue';
  
  // Extraire le lien affilié
  const affiliateLink = apiProduct.uri?.awTrack || apiProduct.uri?.mLink || '';
  
  // Extraire le nom du marchand
  const merchantName = apiProduct.merchant?.merchantName || '';

  return {
    id: apiProduct._id || apiProduct.id || '',
    name,
    category,
    price,
    rating: 4.0, // Par défaut, peut être calculé ou ajouté plus tard
    image,
    description,
    features: [], // Peut être extrait d'autres champs si nécessaire
    brand,
    affiliateLink,
    merchantName,
    bestAffiliateLink: affiliateLink,
  };
}

/**
 * Convertit un tableau de produits de l'API
 */
export function mapApiProductsToDisplayProducts(apiProducts: ApiProduct[]): DisplayProduct[] {
  return apiProducts.map(mapApiProductToDisplayProduct);
}

