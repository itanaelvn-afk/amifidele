/**
 * Types produit AmiFidele — contrat Phase 1 (MODELE_PRODUIT_CANONIQUE.md).
 * Les champs legacy restent optionnels le temps du reimport / transition.
 */

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
  features?: string[];
  brand: string;
  affiliateLink?: string;
  merchantName?: string;
  bestAffiliateLink?: string;
  source?: string;
}
