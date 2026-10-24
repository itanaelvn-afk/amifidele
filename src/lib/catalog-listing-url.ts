import type { ProductFilters } from "@/lib/api";
import {
  DEFAULT_PRODUCT_SORT,
  parseProductSortValue,
  type ProductSortValue,
} from "@/lib/product-sort";

/** État catalogue dérivé de l’URL `/produits?...`. */
export type CatalogListingState = {
  search: string;
  page: number;
  sort: ProductSortValue;
  categoryId?: string;
  categoryName?: string;
  merchantId?: string;
  brandId?: string;
  brandName?: string;
  minPrice?: number;
  maxPrice?: number;
};

function parseOptionalNumber(raw: string | null): number | undefined {
  if (raw == null || raw.trim() === "") return undefined;
  const n = Number(raw);
  return Number.isFinite(n) ? n : undefined;
}

function parsePositiveInt(raw: string | null, fallback: number): number {
  if (raw == null || raw.trim() === "") return fallback;
  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) && n >= 1 ? n : fallback;
}

/** Lit les query params catalogue (valeurs absentes = défauts). */
export function parseCatalogListingParams(
  params: URLSearchParams
): CatalogListingState {
  const brandId = params.get("brandId")?.trim() || undefined;
  const categoryId = params.get("categoryId")?.trim() || undefined;
  const categoryName = categoryId
    ? undefined
    : params.get("categoryName")?.trim() || undefined;

  return {
    search: params.get("q")?.trim() || "",
    page: parsePositiveInt(params.get("page"), 1),
    sort: parseProductSortValue(params.get("sort")),
    categoryId,
    categoryName,
    merchantId: params.get("merchantId")?.trim() || undefined,
    brandId,
    brandName: brandId ? params.get("brandName")?.trim() || undefined : undefined,
    minPrice: parseOptionalNumber(params.get("minPrice")),
    maxPrice: parseOptionalNumber(params.get("maxPrice")),
  };
}

/** Sérialise l’état catalogue (omet les valeurs par défaut). */
export function catalogListingToSearchParams(
  state: CatalogListingState,
  options?: { omitCategory?: boolean }
): URLSearchParams {
  const params = new URLSearchParams();

  if (state.search) params.set("q", state.search);
  if (state.page > 1) params.set("page", String(state.page));
  if (state.sort !== DEFAULT_PRODUCT_SORT) params.set("sort", state.sort);

  if (!options?.omitCategory) {
    if (state.categoryId) params.set("categoryId", state.categoryId);
    else if (state.categoryName) params.set("categoryName", state.categoryName);
  }

  if (state.merchantId) params.set("merchantId", state.merchantId);

  if (state.brandId) {
    params.set("brandId", state.brandId);
    if (state.brandName) params.set("brandName", state.brandName);
  }

  if (state.minPrice !== undefined) params.set("minPrice", String(state.minPrice));
  if (state.maxPrice !== undefined) params.set("maxPrice", String(state.maxPrice));

  return params;
}

/** Convertit l’état URL en filtres API (+ search pour les chips UI). */
export function catalogListingToProductFilters(
  state: CatalogListingState
): ProductFilters {
  const filters: ProductFilters = {};
  if (state.categoryId) filters.categoryId = state.categoryId;
  if (state.categoryName) filters.categoryName = state.categoryName;
  if (state.merchantId) filters.merchantId = state.merchantId;
  if (state.brandId) filters.brandId = state.brandId;
  if (state.brandName) filters.brandName = state.brandName;
  if (state.minPrice !== undefined) filters.minPrice = state.minPrice;
  if (state.maxPrice !== undefined) filters.maxPrice = state.maxPrice;
  if (state.search) filters.search = state.search;
  return filters;
}

/** Applique un patch d’état sur l’URL courante (pour `router.replace`). */
export function mergeCatalogListingState(
  current: CatalogListingState,
  patch: Partial<CatalogListingState>
): CatalogListingState {
  return { ...current, ...patch };
}

export function catalogListingHref(
  pathname: string,
  state: CatalogListingState,
  options?: { omitCategory?: boolean }
): string {
  const qs = catalogListingToSearchParams(state, options).toString();
  return qs ? `${pathname}?${qs}` : pathname;
}

export const EMPTY_CATALOG_LISTING: CatalogListingState = {
  search: "",
  page: 1,
  sort: DEFAULT_PRODUCT_SORT,
};
