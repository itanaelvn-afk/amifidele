/**
 * Mapping API → affichage site.
 * Priorité : champs canoniques Phase 1, puis fallbacks legacy.
 */

import { DisplayOffer, DisplayProduct, Product } from '../types';
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

function mapApiOffer(apiProduct: ApiProduct | Product, isBestPrice = false): DisplayOffer {
  const price = asNumber(apiProduct.price?.amount, apiProduct.price?.buynow) ?? 0;
  const oldPrice = asNumber(apiProduct.price?.old, apiProduct.price?.productPriceOld);
  const delivery = asNumber(apiProduct.price?.delivery);
  const currency = firstNonEmpty(apiProduct.price?.currency, apiProduct.price?.curr) || 'EUR';
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

  return {
    id: apiProduct._id || apiProduct.id || '',
    source: apiProduct.source,
    merchantName: merchantName || undefined,
    price,
    currency,
    ...(delivery != null ? { delivery } : {}),
    ...(oldPrice != null && oldPrice > 0 ? { oldPrice } : {}),
    ...(typeof apiProduct.inStock === 'boolean' ? { inStock: apiProduct.inStock } : {}),
    affiliateLink: affiliateLink || undefined,
    ...(isBestPrice ? { isBestPrice: true } : {}),
  };
}

/**
 * Convertit un produit API (canonique ou legacy) au format d'affichage.
 */
export function mapApiProductToDisplayProduct(apiProduct: ApiProduct | Product): DisplayProduct {
  const price = asNumber(apiProduct.price?.amount, apiProduct.price?.buynow) ?? 0;
  const oldPrice = asNumber(apiProduct.price?.old, apiProduct.price?.productPriceOld);
  const delivery = asNumber(apiProduct.price?.delivery);
  const currency = firstNonEmpty(apiProduct.price?.currency, apiProduct.price?.curr) || 'EUR';
  const minPrice = asNumber(
    (apiProduct as ApiProduct & { minPrice?: number }).minPrice,
    price
  );
  const offerCount = asNumber(
    (apiProduct as ApiProduct & { offerCount?: number }).offerCount,
    1
  ) ?? 1;
  const priceFrom = offerCount > 1;
  const displayPrice = priceFrom && minPrice != null ? minPrice : price;

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

  const rawOffers = (apiProduct as ApiProduct & { offers?: ApiProduct[] }).offers;
  const offers: DisplayOffer[] | undefined = Array.isArray(rawOffers)
    ? rawOffers.map((offer, index) => mapApiOffer(offer, index === 0))
    : undefined;
  const bestOffer = offers?.[0];

  const affiliateLink =
    bestOffer?.affiliateLink ||
    firstNonEmpty(
      apiProduct.links?.affiliate,
      apiProduct.links?.merchant,
      apiProduct.uri?.awTrack,
      apiProduct.uri?.mLink
    );

  const merchantName =
    (priceFrom ? bestOffer?.merchantName : undefined) ||
    firstNonEmpty(
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

  const ean =
    apiProduct.ean != null && String(apiProduct.ean).trim() !== ''
      ? String(apiProduct.ean).replace(/\D/g, '')
      : undefined;

  const displayOldPrice =
    !priceFrom && oldPrice != null && oldPrice > 0 ? oldPrice : undefined;
  const displayDelivery =
    priceFrom && bestOffer?.delivery != null
      ? bestOffer.delivery
      : delivery;

  return {
    id: apiProduct._id || apiProduct.id || '',
    name,
    category,
    categoryId,
    ...(categoryTrail.length > 0 ? { categoryTrail } : {}),
    price: displayPrice,
    currency,
    ...(displayOldPrice != null ? { oldPrice: displayOldPrice } : {}),
    ...(displayDelivery != null ? { delivery: displayDelivery } : {}),
    ...(unitPriceLabel ? { unitPriceLabel } : {}),
    ...(apiProduct.packSize ? { packSize: apiProduct.packSize } : {}),
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
    ...(ean ? { ean } : {}),
    offerCount,
    ...(minPrice != null ? { minPrice } : {}),
    priceFrom,
    ...(((apiProduct as ApiProduct & { canonicalId?: string }).canonicalId)
      ? {
          canonicalId: String(
            (apiProduct as ApiProduct & { canonicalId?: string }).canonicalId
          ),
        }
      : {}),
    ...(offers && offers.length > 0 ? { offers } : {}),
  };
}

/**
 * Convertit un tableau de produits de l'API
 */
export function mapApiProductsToDisplayProducts(apiProducts: ApiProduct[]): DisplayProduct[] {
  return apiProducts.map(mapApiProductToDisplayProduct);
}
