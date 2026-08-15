/**
 * Liens listing produits filtrés par marque (`products.brandId` = ObjectId Mongo).
 */
export function productsByBrandHref(brandId: string, brandName?: string): string {
  const params = new URLSearchParams();
  params.set("brandId", brandId);
  if (brandName?.trim()) {
    params.set("brandName", brandName.trim());
  }
  return `/produits?${params.toString()}`;
}
