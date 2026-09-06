/**
 * Types produit AmiFidele — contrat Phase 1 (MODELE_PRODUIT_CANONIQUE.md).
 * Les champs legacy restent optionnels le temps du reimport / transition.
 */

import type { CategoryBreadcrumbSegment } from "@/lib/category-breadcrumb";

/** Prix canonique (+ fallbacks legacy optionnels) */
export interface ProductPrice {
  amount?: number;
  currency?: string;
  delivery?: number;
  old?: number;
  /** @deprecated legacy dashboard / site */
  buynow?: number;
  curr?: string;
  productPriceOld?: number;
  rrp?: number;
  saving?: number;
  savingsPercent?: number;
  store?: number;
}

export interface ProductImages {
  main?: string;
  thumb?: string;
}

export interface ProductLinks {
  affiliate?: string;
  merchant?: string;
}

export interface ProductMerchant {
  id?: string;
  name?: string;
  /** @deprecated */
  merchantId?: number;
  /** @deprecated */
  merchantName?: string;
}

export interface ProductBrand {
  awBrandId?: number;
  brandName?: string;
  /** Alias éventuel si l’API unifie plus tard */
  name?: string;
}

export interface ProductCategory {
  _id?: string;
  slug?: string;
  name?: string;
  label?: string;
  parentId?: string | null;
  parentName?: string | null;
  path?: string[];
  [key: string]: unknown;
}

/**
 * Produit API (canonique + legacy optionnel).
 */
export interface Product {
  _id: string;
  id?: string;

  source?: "awin" | "amazon" | "manual" | string;
  sourceProductId?: string;
  feedId?: string | number;
  advertiserId?: string;

  isVisible?: boolean;
  inStock?: boolean;
  ean?: string | number;
  packSize?: string;
  lastSeenAt?: string;

  brandId?: string;
  categoryId?: string;

  name?: string;
  description?: string;
  /** html = édition Dashboard (whitelist) ; plain = texte feed */
  descriptionFormat?: "html" | "plain";

  merchant?: ProductMerchant;
  brand?: ProductBrand;
  category?: ProductCategory;

  price?: ProductPrice;
  images?: ProductImages;
  links?: ProductLinks;
  unitPrice?: {
    amount?: number;
    unit?: string;
  };

  /** Stats multi-offres (agrégation API par EAN) */
  offerCount?: number;
  minPrice?: number;
  /** ID de fiche publique préférée (évite les URLs amazon_…) */
  canonicalId?: string;
  /** Offres sœurs (détail produit uniquement) */
  offers?: Product[];

  /** @deprecated dump Awin / dashboard */
  text?: {
    desc?: string;
    name?: string;
  };
  /** @deprecated */
  uri?: {
    alternateImage?: string;
    alternateImageThree?: string;
    alternateImageTwo?: string;
    awImage?: string;
    awThumb?: string;
    awTrack?: string;
    mImage?: string;
    mLink?: string;
  };
  /** @deprecated */
  in_stock?: string;
  is_for_sale?: string;
  colour?: string;
  cond?: string;
  lang?: string;
  modelNumber?: number;
  parentId?: number;
  pId?: number;
  pre_order?: string;
  stock_quantity?: string;
  vertical?: {
    id?: string;
    name?: string;
  };
  web_offer?: string;

  createdAt?: string;
  updatedAt?: string;
}

/**
 * Réponse paginée de la liste des produits
 */
export interface PaginatedProductsResponse {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  products: Product[];
}

/**
 * Format d'affichage UI (cartes, comparaison, accueil).
 */
export interface DisplayProduct {
  id: string;
  name: string;
  category: string;
  categoryId?: string;
  /** Segments fil d’Ariane (parent → feuille), sans Accueil ni produit */
  categoryTrail?: CategoryBreadcrumbSegment[];
  price: number;
  currency?: string;
  /** Prix barré / ancien prix (canonique price.old) */
  oldPrice?: number;
  /** Frais de livraison (canonique price.delivery) */
  delivery?: number;
  unitPriceLabel?: string;
  packSize?: string;
  /** Absent tant qu’il n’y a pas de vraies notes */
  rating?: number;
  image: string;
  description: string;
  descriptionFormat?: "html" | "plain";
  features?: string[];
  brand: string;
  affiliateLink?: string;
  merchantName?: string;
  bestAffiliateLink?: string;
  source?: string;
  /** EAN / GTIN (regroupement multi-offres) */
  ean?: string;
  /** Nombre d’offres visibles pour le même EAN */
  offerCount?: number;
  /** Prix minimum parmi les offres du même EAN */
  minPrice?: number;
  /** true si offerCount > 1 (affichage « À partir de ») */
  priceFrom?: boolean;
  /** ID canonique pour les liens / SEO (préfère l’offre Awin) */
  canonicalId?: string;
  /** Offres sœurs (PDP), triées par prix */
  offers?: DisplayOffer[];
}

/** Offre marchand sur une fiche multi-sources. */
export interface DisplayOffer {
  id: string;
  source?: string;
  merchantName?: string;
  price: number;
  currency?: string;
  delivery?: number;
  oldPrice?: number;
  inStock?: boolean;
  affiliateLink?: string;
  isBestPrice?: boolean;
}
