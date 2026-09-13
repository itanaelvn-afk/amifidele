import type { Metadata } from "next";

export const SITE_NAME = "AmiFidele";

/** Budget approx. d’affichage Google (~60 car. avant troncature). */
const SERP_TITLE_MAX = 60;

export const DEFAULT_TITLE =
  "AmiFidele | Comparateur prix chiens & chats";

export const DEFAULT_DESCRIPTION =
  "Comparez les prix et les caractéristiques de milliers de produits pour chiens et chats chez les meilleurs marchands.";

/** Image OG générée par `src/app/opengraph-image.tsx` (1200×630). */
export const DEFAULT_OG_IMAGE = "/opengraph-image";

/** Titre complet avec marque (OG, Twitter, absolute). */
export function formatPageTitle(segment: string): string {
  return `${segment} | ${SITE_NAME}`;
}

/**
 * Segment de titre fiche produit (le layout ajoute `| AmiFidele`).
 * Tronque le nom pour rester proche du budget SERP.
 */
export function productTitleSegment(productName: string): string {
  const suffix = " : comparer les offres";
  const brandSuffix = ` | ${SITE_NAME}`;
  const nameBudget = SERP_TITLE_MAX - suffix.length - brandSuffix.length;
  const trimmed = productName.trim();
  const name =
    nameBudget < 12
      ? trimmed
      : trimmed.length <= nameBudget
        ? trimmed
        : `${trimmed.slice(0, nameBudget - 1).trimEnd()}…`;
  return `${name}${suffix}`;
}

/** Segment de titre page catégorie. */
export function categoryTitleSegment(categoryName: string): string {
  return `${categoryName} : comparer les prix`;
}

export function pageMetadata({
  title,
  description,
  path,
  index = true,
  absolute = false,
}: {
  /** Segment sans marque, sauf si `absolute` (titre final complet). */
  title: string;
  description: string;
  path: string;
  index?: boolean;
  /** Titre final (accueil) — n’applique pas le template `%s | AmiFidele`. */
  absolute?: boolean;
}): Metadata {
  const fullTitle = absolute ? title : formatPageTitle(title);
  return {
    title: absolute ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    robots: index
      ? { index: true, follow: true }
      : { index: false, follow: false },
    openGraph: {
      title: fullTitle,
      description,
      url: path,
      type: "website",
      locale: "fr_FR",
      siteName: SITE_NAME,
      images: [{ url: DEFAULT_OG_IMAGE, alt: SITE_NAME }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [DEFAULT_OG_IMAGE],
    },
  };
}
