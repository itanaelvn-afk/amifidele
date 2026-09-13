/**
 * Redimensionnement côté CDN marchand / Awin — sans optimisation Vercel Image.
 *
 * Domaines observés (catalogue visible ~8k produits) :
 * - media.os.fressnapf.com (majorité) — pas de param de resize connu
 * - webcdn.vivara.com — `?w=&q=&t=fit`
 * - images2.productserve.com (thumbs Awin) — `?w=&h=` (feed souvent en 70×70)
 */

export type ProductImageVariant = "listing" | "detail" | "thumb";

const VARIANT_SIZE: Record<ProductImageVariant, number> = {
  listing: 480,
  detail: 1200,
  thumb: 160,
};

function isHttpUrl(url: string): boolean {
  return url.startsWith("http://") || url.startsWith("https://");
}

/**
 * Adapte une URL image connue pour limiter le poids téléchargé.
 * Si le CDN n’est pas reconnu, renvoie l’URL inchangée.
 */
export function optimizeMerchantImageUrl(
  url: string,
  variant: ProductImageVariant = "listing"
): string {
  if (!url || !isHttpUrl(url)) return url;

  try {
    const parsed = new URL(url);
    const size = VARIANT_SIZE[variant];

    // Proxy Awin ProductServe (souvent w=70 h=70 dans le feed)
    if (
      parsed.hostname === "images2.productserve.com" ||
      parsed.hostname === "images.productserve.com"
    ) {
      parsed.searchParams.set("w", String(size));
      parsed.searchParams.set("h", String(size));
      return parsed.toString();
    }

    // Vivara — déjà paramétrable (?w=3000 dans le feed)
    if (parsed.hostname === "webcdn.vivara.com") {
      parsed.searchParams.set("w", String(size));
      if (!parsed.searchParams.has("q")) parsed.searchParams.set("q", "80");
      if (!parsed.searchParams.has("t")) parsed.searchParams.set("t", "fit");
      return parsed.toString();
    }

    return url;
  } catch {
    return url;
  }
}

/**
 * Image listing : privilégie le proxy Awin redimensionné (plus léger qu’un PNG Fressnapf full),
 * sinon la main optimisée si le CDN le permet.
 */
export function resolveListingImageUrl(
  main?: string | null,
  thumb?: string | null
): string | undefined {
  const mainUrl = main?.trim() || undefined;
  const thumbUrl = thumb?.trim() || undefined;

  if (
    thumbUrl &&
    (thumbUrl.includes("productserve.com") || thumbUrl.includes("webcdn.vivara.com"))
  ) {
    return optimizeMerchantImageUrl(thumbUrl, "listing");
  }
  if (mainUrl) return optimizeMerchantImageUrl(mainUrl, "listing");
  if (thumbUrl) return optimizeMerchantImageUrl(thumbUrl, "listing");
  return undefined;
}

export function resolveDetailImageUrl(url?: string | null): string | undefined {
  const value = url?.trim();
  if (!value) return undefined;
  return optimizeMerchantImageUrl(value, "detail");
}

export function resolveGalleryThumbUrl(url?: string | null): string | undefined {
  const value = url?.trim();
  if (!value) return undefined;
  return optimizeMerchantImageUrl(value, "thumb");
}

/** Hôtes images catalogue — pour une future config `images.remotePatterns`. */
export const KNOWN_PRODUCT_IMAGE_HOSTS = [
  "media.os.fressnapf.com",
  "webcdn.vivara.com",
  "images2.productserve.com",
  "images.productserve.com",
] as const;
