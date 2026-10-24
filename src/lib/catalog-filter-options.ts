import {
  fetchAdvertisers,
  fetchBrands,
  fetchCategories,
  type Advertiser,
  type Brand,
  type Category,
} from "@/lib/api";

/** Options de filtres catalogue — payload volontairement minimal. */
export interface CatalogFilterOptions {
  merchants: Advertiser[];
  categories: Category[];
  /** Marques réduites à id + nom pour le select. */
  brands: Array<{ id: string; name: string }>;
}

const CLIENT_TTL_MS = 30 * 60 * 1000;

type ClientCacheEntry = {
  data: CatalogFilterOptions;
  expiresAt: number;
};

let clientCache: ClientCacheEntry | null = null;

function brandOptionId(brand: Brand): string | undefined {
  const id = brand._id || (brand.id != null ? String(brand.id) : undefined);
  return id?.trim() || undefined;
}

function brandOptionName(brand: Brand): string {
  return (brand.name || brand.brandName || "").trim();
}

/** Réduit la liste marques au strict nécessaire pour le select. */
export function slimBrandsForFilters(brands: Brand[]): CatalogFilterOptions["brands"] {
  return brands
    .map((brand) => {
      const id = brandOptionId(brand);
      const name = brandOptionName(brand);
      if (!id || !name) return null;
      return { id, name };
    })
    .filter((b): b is { id: string; name: string } => b != null);
}

/** Charge marchands + catégories + marques (slim) en parallèle. */
export async function loadCatalogFilterOptions(): Promise<CatalogFilterOptions> {
  const [merchants, categories, brands] = await Promise.all([
    fetchAdvertisers(),
    fetchCategories(),
    fetchBrands(),
  ]);
  return {
    merchants,
    categories,
    brands: slimBrandsForFilters(brands),
  };
}

export function readClientFilterOptionsCache(): CatalogFilterOptions | null {
  if (typeof window === "undefined") return null;
  if (!clientCache) return null;
  if (Date.now() > clientCache.expiresAt) {
    clientCache = null;
    return null;
  }
  return clientCache.data;
}

export function writeClientFilterOptionsCache(data: CatalogFilterOptions): void {
  if (typeof window === "undefined") return;
  clientCache = { data, expiresAt: Date.now() + CLIENT_TTL_MS };
}

export function hasUsableFilterOptions(data: CatalogFilterOptions | null | undefined): boolean {
  if (!data) return false;
  return (
    data.merchants.length > 0 ||
    data.categories.length > 0 ||
    data.brands.length > 0
  );
}
