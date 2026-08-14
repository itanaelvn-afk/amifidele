/**
 * Mapping API → affichage site.
 * Priorité : champs canoniques Phase 1, puis fallbacks legacy.
 */

import { DisplayProduct, Product } from '../types';
import { ApiProduct } from '../api';
import { buildCategoryBreadcrumb } from '../category-breadcrumb';

function firstNonEmpty(...values: Array<string | undefined | null>): string {
  for (const value of values) {
    if (typeof value === 'string' && value.trim() !== '') {
      return value.trim();
    }
  }
  return '';
}

function asNumber(...values: Array<number | undefined | null>): number | undefined {
  for (const value of values) {
    if (typeof value === 'number' && !Number.isNaN(value)) {
      return value;
    }
  }
  return undefined;
}

/**
 * Convertit un produit API (canonique ou legacy) au format d'affichage.
 */
export function mapApiProductToDisplayProduct(apiProduct: ApiProduct | Product): DisplayProduct {
  const price = asNumber(apiProduct.price?.amount, apiProduct.price?.buynow) ?? 0;
  const oldPrice = asNumber(apiProduct.price?.old, apiProduct.price?.productPriceOld);
  const delivery = asNumber(apiProduct.price?.delivery);
  const currency = firstNonEmpty(apiProduct.price?.currency, apiProduct.price?.curr) || 'EUR';

  const image = firstNonEmpty(
    apiProduct.images?.main,
    apiProduct.images?.thumb,
    apiProduct.uri?.mImage,
    apiProduct.uri?.awImage,
    apiProduct.uri?.awThumb
  ) || '/images/placeholder.jpg';

  const name = firstNonEmpty(apiProduct.name, apiProduct.text?.name);
  const description = firstNonEmpty(apiProduct.description, apiProduct.text?.desc);

  const categoryId =
    firstNonEmpty(
      apiProduct.categoryId,
      apiProduct.category?._id,
      apiProduct.category?.slug
    ) || undefined;

  const category =
    firstNonEmpty(apiProduct.category?.name, apiProduct.category?.label, categoryId) ||
    'Autre';

  const categoryTrail = buildCategoryBreadcrumb({
    categoryId,
    name: apiProduct.category?.name,
    parentId: apiProduct.category?.parentId,
    parentName: apiProduct.category?.parentName,
    slug: apiProduct.category?.slug,
  });

  const brand = firstNonEmpty(
    apiProduct.brand?.brandName,
    apiProduct.brand?.name
  ) || 'Marque inconnue';

  const affiliateLink = firstNonEmpty(
    apiProduct.links?.affiliate,
    apiProduct.links?.merchant,
    apiProduct.uri?.awTrack,
    apiProduct.uri?.mLink
  );

  const merchantName = firstNonEmpty(
    apiProduct.merchant?.name,
    apiProduct.merchant?.merchantName
  );

  const unitAmount = apiProduct.unitPrice?.amount;
  const unitLabel = firstNonEmpty(apiProduct.unitPrice?.unit);
  const unitPriceLabel =
    unitAmount != null && unitLabel
      ? `${unitAmount.toFixed(2)} ${unitLabel}`
      : unitAmount != null
        ? String(unitAmount)
        : undefined;

  return {
    id: apiProduct._id || apiProduct.id || '',
    name,
    category,
    categoryId,
    ...(categoryTrail.length > 0 ? { categoryTrail } : {}),
    price,
    currency,
    ...(oldPrice != null && oldPrice > 0 ? { oldPrice } : {}),
    ...(delivery != null ? { delivery } : {}),
    ...(unitPriceLabel ? { unitPriceLabel } : {}),
    ...(apiProduct.packSize ? { packSize: apiProduct.packSize } : {}),
    // Pas de note factice — n’afficher le rating que s’il existe réellement
    image,
    description,
    ...(apiProduct.descriptionFormat === "html" || apiProduct.descriptionFormat === "plain"
      ? { descriptionFormat: apiProduct.descriptionFormat }
      : {}),
    features: [],
    brand,
    affiliateLink: affiliateLink || undefined,
    merchantName: merchantName || undefined,
    bestAffiliateLink: affiliateLink || undefined,
    source: apiProduct.source,
  };
}

/**
 * Convertit un tableau de produits de l'API
 */
export function mapApiProductsToDisplayProducts(apiProducts: ApiProduct[]): DisplayProduct[] {
  return apiProducts.map(mapApiProductToDisplayProduct);
}
