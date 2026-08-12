/**
 * Service API pour récupérer les produits depuis l'API api-amifidele
 */

import { getAuthHeaders } from './auth';
import { API_CONFIG } from './api-config';
import { Product, PaginatedProductsResponse } from './types';

// Configuration de l'API - à adapter selon votre environnement
// Par défaut, utilise localhost:4000 pour le développement local
const API_BASE_URL = API_CONFIG.baseURL;

// Utiliser directement le type Product du dashboard
export type ApiProduct = Product;

export interface ApiResponse<T> {
  data?: T;
  products?: T[];
  success?: boolean;
  message?: string;
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
  // Adaptez selon la structure de votre API
  [key: string]: unknown;
}

export interface ProductFilters {
  categoryName?: string;
  categoryId?: string;
  brandName?: string;
  brandId?: string;
  merchantId?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  inStock?: boolean;
  isForSale?: boolean;
  /** Toujours forcé à true sur le site public — ne pas exposer les produits masqués. */
  isVisible?: boolean;
}

/** Visibilité forcée pour toutes les lectures publiques du site. */
const PUBLIC_VISIBILITY = true as const;

function appendPublicVisibility(params: URLSearchParams): void {
  params.set('isVisible', String(PUBLIC_VISIBILITY));
}

/**
 * Récupère tous les produits depuis l'API avec pagination et filtres
 */
export async function fetchProducts(page: number = 1, limit: number = 20, filters?: ProductFilters): Promise<PaginatedProductsResponse> {
  try {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    
    if (filters) {
      if (filters.categoryName) params.append('categoryName', filters.categoryName);
      if (filters.categoryId) params.append('categoryId', filters.categoryId);
      if (filters.brandName) params.append('brandName', filters.brandName);
      if (filters.brandId) params.append('brandId', filters.brandId);
      if (filters.merchantId) params.append('merchantId', filters.merchantId);
      
      // Gestion des prix avec vérification stricte
      if (filters.minPrice !== undefined && filters.minPrice !== null) {
        const minPrice = typeof filters.minPrice === 'number' ? filters.minPrice : Number(filters.minPrice);
        if (!isNaN(minPrice) && minPrice >= 0) {
          params.append('minPrice', minPrice.toString());
        }
      }
      if (filters.maxPrice !== undefined && filters.maxPrice !== null) {
        const maxPrice = typeof filters.maxPrice === 'number' ? filters.maxPrice : Number(filters.maxPrice);
        if (!isNaN(maxPrice) && maxPrice > 0) {
          params.append('maxPrice', maxPrice.toString());
        }
      }
      
      if (filters.search) params.append('search', filters.search);
      
      // Debug: log des filtres envoyés
      if (process.env.NODE_ENV === 'development') {
        console.log('Filtres envoyés à l\'API:', {
          minPrice: filters.minPrice,
          maxPrice: filters.maxPrice,
          categoryName: filters.categoryName,
          categoryId: filters.categoryId,
          merchantId: filters.merchantId,
          search: filters.search
        });
      }
      if (filters.inStock !== undefined) params.append('inStock', filters.inStock.toString());
      if (filters.isForSale !== undefined) params.append('isForSale', filters.isForSale.toString());
    }

    // Toujours filtrer les produits masqués côté site public (indépendamment des filtres UI)
    appendPublicVisibility(params);

    const response = await fetch(`${API_BASE_URL}/products?${params.toString()}`, {
      method: 'GET',
      headers: getAuthHeaders(),
      // Ajoutez cache pour améliorer les performances
      next: { revalidate: API_CONFIG.cacheRevalidate },
    });

    if (!response.ok) {
      throw new Error(`Erreur API: ${response.status} ${response.statusText}`);
    }

    const data: PaginatedProductsResponse | ApiResponse<ApiProduct> | ApiProduct[] = await response.json();

    // Gérer différentes structures de réponse
    if ('products' in data && 'page' in data && 'total' in data) {
      // Réponse paginée complète
      return data as PaginatedProductsResponse;
    } else if (Array.isArray(data)) {
      // Tableau simple - créer une réponse paginée
      return {
        page: 1,
        limit: data.length,
        total: data.length,
        totalPages: 1,
        products: data,
      };
    } else if ('products' in data && Array.isArray(data.products)) {
      // Réponse avec produits mais sans metadata complète
      return {
        page: data.page || 1,
        limit: data.limit || data.products.length,
        total: data.total || data.products.length,
        totalPages: data.totalPages || 1,
        products: data.products,
      };
    } else if ('data' in data && data.data && Array.isArray(data.data)) {
      return {
        page: data.page || 1,
        limit: data.limit || data.data.length,
        total: data.total || data.data.length,
        totalPages: data.totalPages || 1,
        products: data.data,
      };
    } else {
      throw new Error('Format de réponse API inattendu');
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des produits:', error);
    throw error instanceof Error
      ? error
      : new Error('Erreur lors de la récupération des produits');
  }
}

/**
 * Récupère un produit spécifique par son ID
 */
export async function fetchProductById(id: number | string): Promise<ApiProduct | null> {
  try {
    const params = new URLSearchParams();
    appendPublicVisibility(params);

    const response = await fetch(`${API_BASE_URL}/products/${id}?${params.toString()}`, {
      method: 'GET',
      headers: getAuthHeaders(),
      next: { revalidate: API_CONFIG.cacheRevalidate },
    });

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error(`Erreur API: ${response.status} ${response.statusText}`);
    }

    const data: ApiResponse<ApiProduct> | ApiProduct = await response.json();

    if (Array.isArray(data)) {
      return data[0] || null;
    } else if ('data' in data && data.data) {
      return data.data as ApiProduct;
    } else if ('id' in data || '_id' in data) {
      const product = data as ApiProduct;
      // Filet de sécurité si l'API renvoie encore un produit masqué
      if (product.isVisible === false) {
        return null;
      }
      return product;
    }

    return null;
  } catch (error) {
    console.error(`Erreur lors de la récupération du produit ${id}:`, error);
    return null;
  }
}

/**
 * Récupère les produits par catégorie avec pagination
 */
export async function fetchProductsByCategory(category: string, page: number = 1, limit: number = 20): Promise<PaginatedProductsResponse> {
  try {
    const params = new URLSearchParams();
    params.set('categoryName', category);
    params.set('page', page.toString());
    params.set('limit', limit.toString());
    appendPublicVisibility(params);

    const response = await fetch(`${API_BASE_URL}/products?${params.toString()}`, {
      method: 'GET',
      headers: getAuthHeaders(),
      next: { revalidate: API_CONFIG.cacheRevalidate },
    });

    if (!response.ok) {
      throw new Error(`Erreur API: ${response.status} ${response.statusText}`);
    }

    const data: PaginatedProductsResponse | ApiResponse<ApiProduct> | ApiProduct[] = await response.json();

    if ('products' in data && 'page' in data && 'total' in data) {
      return data as PaginatedProductsResponse;
    } else if (Array.isArray(data)) {
      return {
        page: 1,
        limit: data.length,
        total: data.length,
        totalPages: 1,
        products: data,
      };
    } else if ('products' in data && Array.isArray(data.products)) {
      return {
        page: data.page || 1,
        limit: data.limit || data.products.length,
        total: data.total || data.products.length,
        totalPages: data.totalPages || 1,
        products: data.products,
      };
    } else if ('data' in data && data.data && Array.isArray(data.data)) {
      return {
        page: data.page || 1,
        limit: data.limit || data.data.length,
        total: data.total || data.data.length,
        totalPages: data.totalPages || 1,
        products: data.data,
      };
    }

    return {
      page: 1,
      limit: 20,
      total: 0,
      totalPages: 0,
      products: [],
    };
  } catch (error) {
    console.error(`Erreur lors de la récupération des produits pour la catégorie ${category}:`, error);
    return {
      page: 1,
      limit: 20,
      total: 0,
      totalPages: 0,
      products: [],
    };
  }
}

/**
 * Recherche des produits par terme de recherche avec pagination
 */
export async function searchProducts(query: string, page: number = 1, limit: number = 20): Promise<PaginatedProductsResponse> {
  try {
    const params = new URLSearchParams();
    params.set('q', query);
    params.set('page', page.toString());
    params.set('limit', limit.toString());
    appendPublicVisibility(params);

    const response = await fetch(`${API_BASE_URL}/products/search?${params.toString()}`, {
      method: 'GET',
      headers: getAuthHeaders(),
      next: { revalidate: API_CONFIG.cacheRevalidate },
    });

    if (!response.ok) {
      throw new Error(`Erreur API: ${response.status} ${response.statusText}`);
    }

    const data: PaginatedProductsResponse | ApiResponse<ApiProduct> | ApiProduct[] = await response.json();

    if ('products' in data && 'page' in data && 'total' in data) {
      return data as PaginatedProductsResponse;
    } else if (Array.isArray(data)) {
      return {
        page: 1,
        limit: data.length,
        total: data.length,
        totalPages: 1,
        products: data,
      };
    } else if ('products' in data && Array.isArray(data.products)) {
      return {
        page: data.page || 1,
        limit: data.limit || data.products.length,
        total: data.total || data.products.length,
        totalPages: data.totalPages || 1,
        products: data.products,
      };
    } else if ('data' in data && data.data && Array.isArray(data.data)) {
      return {
        page: data.page || 1,
        limit: data.limit || data.data.length,
        total: data.total || data.data.length,
        totalPages: data.totalPages || 1,
        products: data.data,
      };
    }

    return {
      page: 1,
      limit: 20,
      total: 0,
      totalPages: 0,
      products: [],
    };
  } catch (error) {
    console.error(`Erreur lors de la recherche de produits:`, error);
    return {
      page: 1,
      limit: 20,
      total: 0,
      totalPages: 0,
      products: [],
    };
  }
}

export interface Advertiser {
  merchantId: number;
  merchantName: string;
}

export interface Category {
  id?: string;
  slug?: string;
  name: string;
  /** Libellé affichage : "Chien › Nourriture" pour les enfants */
  label?: string;
  parentId?: string | null;
  parentName?: string | null;
  path?: string[];
  level?: number;
}

export interface Brand {
  /** ObjectId Mongo (products.brandId) */
  _id?: string;
  /** Préférer `_id` pour filtrer ; peut être awBrandId en legacy */
  id?: number | string;
  awBrandId?: number;
  name: string;
  brandName?: string;
}

type ApiCategoryRecord = Category & {
  _id?: string | number;
  categoryName?: string;
  mCat?: string;
  label?: string;
  parentName?: string | null;
};

function mapApiCategory(cat: ApiCategoryRecord): Category {
  const slug = String(cat.slug || cat._id || cat.id || "");
  const name = cat.name || cat.categoryName || cat.mCat || slug;
  return {
    id: slug || undefined,
    slug: slug || undefined,
    name,
    label: cat.label || name,
    parentId: cat.parentId ?? null,
    parentName: cat.parentName ?? null,
    path: cat.path,
    level: cat.level
  };
}

type ApiBrandRecord = Brand & {
  brandId?: number | string;
  awBrandId?: number;
};

function mapApiBrand(brand: ApiBrandRecord): Brand {
  const brandName = brand.brandName || brand.name || "";
  return {
    _id: brand._id ? String(brand._id) : undefined,
    id: brand._id || brand.awBrandId || brand.id || brand.brandId,
    awBrandId: brand.awBrandId,
    name: brandName,
    brandName,
  };
}

/**
 * Récupère la liste des annonceurs/marchands
 */
export async function fetchAdvertisers(): Promise<Advertiser[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/advertisers`, {
      method: 'GET',
      headers: getAuthHeaders(),
      next: { revalidate: API_CONFIG.cacheRevalidate },
    });

    if (!response.ok) {
      throw new Error(`Erreur API: ${response.status} ${response.statusText}`);
    }

    const data: Advertiser[] | ApiResponse<Advertiser> = await response.json();
    
    if (Array.isArray(data)) {
      return data;
    } else if ('data' in data && Array.isArray(data.data)) {
      return data.data;
    }
    
    return [];
  } catch (error) {
    console.error('Erreur lors de la récupération des annonceurs:', error);
    return [];
  }
}

/**
 * Récupère la liste des catégories
 */
export async function fetchCategories(): Promise<Category[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      method: 'GET',
      headers: getAuthHeaders(),
      next: { revalidate: API_CONFIG.cacheRevalidate },
    });

    if (!response.ok) {
      // Si l'endpoint n'existe pas, extraire depuis les produits
      return await loadCategoriesFromProducts();
    }

    const data: Category[] | ApiResponse<Category> | { categories: Category[] } = await response.json();
    
    const byLabel = (a: Category, b: Category) =>
      (a.label || a.name).localeCompare(b.label || b.name, "fr");

    if (Array.isArray(data)) {
      return data
        .map(mapApiCategory)
        .filter((c) => c.name)
        .sort(byLabel);
    } else if ('categories' in data && Array.isArray(data.categories)) {
      return (data.categories as ApiCategoryRecord[])
        .map(mapApiCategory)
        .filter((c) => c.name)
        .sort(byLabel);
    } else if ('data' in data && Array.isArray(data.data)) {
      return (data.data as ApiCategoryRecord[])
        .map(mapApiCategory)
        .filter((c) => c.name)
        .sort(byLabel);
    }
    
    return [];
  } catch (error) {
    console.error('Erreur lors de la récupération des catégories:', error);
    return await loadCategoriesFromProducts();
  }
}

/**
 * Récupère la liste des marques (GET /api/brands).
 * Pas de fallback sur un dump products limit=1000.
 */
export async function fetchBrands(): Promise<Brand[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/brands`, {
      method: 'GET',
      headers: getAuthHeaders(),
      next: { revalidate: API_CONFIG.cacheRevalidate },
    });

    if (!response.ok) {
      throw new Error(`Erreur API marques: ${response.status} ${response.statusText}`);
    }

    const data: Brand[] | ApiResponse<Brand> | { brands: Brand[] } = await response.json();
    let list: ApiBrandRecord[] = [];

    if (Array.isArray(data)) {
      list = data;
    } else if ('brands' in data && Array.isArray(data.brands)) {
      list = data.brands as ApiBrandRecord[];
    } else if ('data' in data && Array.isArray(data.data)) {
      list = data.data as ApiBrandRecord[];
    }

    return list
      .map(mapApiBrand)
      .filter((brand) => brand.name)
      .sort((a, b) => a.name.localeCompare(b.name, 'fr'));
  } catch (error) {
    console.error('Erreur lors de la récupération des marques:', error);
    return [];
  }
}

/**
 * Charge les catégories depuis les produits (fallback)
 */
async function loadCategoriesFromProducts(): Promise<Category[]> {
  try {
    const response = await fetchProducts(1, 1000);
    const categoryMap = new Map<string, Category>();
    
    response.products.forEach((product: ApiProduct) => {
      const slug = product.categoryId || product.category?.slug || product.category?._id;
      const name = product.category?.name || slug;
      if (slug && name) {
        const key = String(slug);
        if (!categoryMap.has(key)) {
          categoryMap.set(key, {
            id: key,
            slug: key,
            name: String(name),
          });
        }
      }
    });
    
    return Array.from(categoryMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    console.error('Erreur lors du chargement des catégories depuis les produits:', error);
    return [];
  }
}

