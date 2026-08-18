/**
 * Produits similaires v1
 *
 * Règle :
 * 1. Même `categoryId` + bande de prix ±30 %
 * 2. Si trop peu de résultats : élargir à la catégorie racine du fil d’Ariane (sans bande de prix)
 * 3. Exclusion du produit courant / déjà sélectionnés côté client (pas de param `exclude` API)
 * 4. Uniquement `isVisible=true` (forcé par fetchProducts)
 */

import { fetchProducts } from "@/lib/api";
import type { DisplayProduct } from "@/lib/types";
import { mapApiProductsToDisplayProducts } from "@/lib/utils/api-utils";

export const SIMILAR_PRODUCTS_LIMIT = 8;
const PRICE_BAND_RATIO = 0.3;
const FETCH_BUFFER = 4;

export type SimilarProductSeed = Pick<
  DisplayProduct,
  "id" | "categoryId" | "price" | "categoryTrail"
>;

function priceBand(price: number): { minPrice: number; maxPrice: number } | null {
  if (!Number.isFinite(price) || price <= 0) return null;
  return {
    minPrice: Math.max(0, Number((price * (1 - PRICE_BAND_RATIO)).toFixed(2))),
    maxPrice: Number((price * (1 + PRICE_BAND_RATIO)).toFixed(2)),
  };
}

function rootCategoryId(seed: SimilarProductSeed): string | undefined {
  const root = seed.categoryTrail?.[0]?.slug;
  if (root && root !== seed.categoryId) return root;
  return undefined;
}

function dedupeExclude(
  products: DisplayProduct[],
  excludeIds: Set<string>,
  limit: number
): DisplayProduct[] {
  const out: DisplayProduct[] = [];
  for (const p of products) {
    if (excludeIds.has(p.id)) continue;
    out.push(p);
    if (out.length >= limit) break;
  }
  return out;
}

async function loadByCategory(
  categoryId: string,
  limit: number,
  band: { minPrice: number; maxPrice: number } | null
): Promise<DisplayProduct[]> {
  const response = await fetchProducts(1, Math.min(100, limit + FETCH_BUFFER), {
    categoryId,
    ...(band ? { minPrice: band.minPrice, maxPrice: band.maxPrice } : {}),
    sort: "updatedAt",
    order: "desc",
  });
  return mapApiProductsToDisplayProducts(response.products);
}

/**
 * Retourne jusqu’à `limit` produits similaires, ou [] si aucun.
 */
export async function fetchSimilarProducts(
  seed: SimilarProductSeed,
  options?: { limit?: number; excludeIds?: string[] }
): Promise<DisplayProduct[]> {
  const limit = options?.limit ?? SIMILAR_PRODUCTS_LIMIT;
  const excludeIds = new Set<string>([
    seed.id,
    ...(options?.excludeIds ?? []),
  ]);

  if (!seed.categoryId) {
    return [];
  }

  try {
    const band = priceBand(seed.price);
    let candidates = await loadByCategory(seed.categoryId, limit, band);
    const similar = dedupeExclude(candidates, excludeIds, limit);

    if (similar.length < Math.min(4, limit)) {
      const root = rootCategoryId(seed);
      if (root) {
        candidates = await loadByCategory(root, limit, null);
        const seen = new Set(similar.map((p) => p.id));
        for (const p of dedupeExclude(candidates, excludeIds, limit)) {
          if (seen.has(p.id)) continue;
          similar.push(p);
          seen.add(p.id);
          if (similar.length >= limit) break;
        }
      }
    }

    return similar.slice(0, limit);
  } catch (error) {
    console.error("Erreur chargement produits similaires:", error);
    return [];
  }
}
