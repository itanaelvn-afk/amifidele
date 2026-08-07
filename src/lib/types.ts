/**
 * Interface représentant un produit dans le système
 * Basée sur la structure du dashboard
 */
export interface Product {
  _id: string;

  /** Visibilité publique — false = masqué (ex. feed Awin obsolète). */
  isVisible?: boolean;

  /** ObjectId vers la collection brands */
  brandId?: string;

  merchant: {
    merchantId: number;
    merchantName: string;
  };

  brand?: {
    awBrandId?: number;
    brandName?: string;
  };

  cat: {
    awCat: string;
    awCatId: number;
    mCat: string;
    merchantProductCategoryPath: string;
    merchantProductSecondCategory: string;
    merchantProductThirdCategory: string;
  };

  // Références aux catégories (IDs numériques/String)
  mainCategoryId?: string;
  subCategoryId?: string;

  // Catégories enrichies (ajoutées par l'API via enrichProductsWithCategories)
  mainCategory?: {
    _id?: string;
    id?: number;
    mCat?: string;
    name?: string;
    [key: string]: unknown;
  };
  subCategory?: {
    _id?: string;
    id?: number;
    mCat?: string;
    name?: string;
    [key: string]: unknown;
  };

  colour?: string;

  cond: string;
  ean: number;
  feedId: string;
  id: string;
  in_stock: string;
  is_for_sale: string;
  lang: string;
  modelNumber: number;
  parentId?: number;
  pId: number;
  pre_order: string;

  price: {
    buynow: number;
    curr: string;
    delivery: number;
    productPriceOld: number;
    rrp: number;
    saving?: number;
    savingsPercent?: number;
    store: number;
  };

  stock_quantity: string;

  text: {
    desc: string;
    name: string;
  };

  uri: {
    alternateImage?: string;
    alternateImageThree?: string;
    alternateImageTwo?: string;
    awImage: string;
    awThumb: string;
    awTrack: string;
    mImage: string;
    mLink: string;
  };

  vertical: {
    id: string;
    name: string;
  };

  web_offer: string;

  createdAt: string;
  updatedAt: string;
}

/**
 * Interface pour la réponse paginée de la liste des produits
 */
export interface PaginatedProductsResponse {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  products: Product[];
}

/**
 * Interface simplifiée pour l'affichage dans les cartes produits
 */
export interface DisplayProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  rating?: number;
  image: string;
  description: string;
  features?: string[];
  brand: string;
  affiliateLink?: string;
  merchantName?: string;
  bestAffiliateLink?: string;
}


