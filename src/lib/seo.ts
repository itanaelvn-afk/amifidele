import type { Metadata } from "next";

export const SITE_NAME = "AmiFidele";

export const DEFAULT_TITLE =
  "AmiFidele - Comparateur de produits pour animaux";

export const DEFAULT_DESCRIPTION =
  "Comparez les prix et les caractéristiques de milliers de produits pour chiens et chats chez les meilleurs marchands.";

/** Image OG générée par `src/app/opengraph-image.tsx` (1200×630). */
export const DEFAULT_OG_IMAGE = "/opengraph-image";

export function pageMetadata({
  title,
  description,
  path,
  index = true,
}: {
  title: string;
  description: string;
  path: string;
  index?: boolean;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    robots: index
      ? { index: true, follow: true }
      : { index: false, follow: false },
    openGraph: {
      title,
      description,
      url: path,
      type: "website",
      locale: "fr_FR",
      siteName: SITE_NAME,
      images: [{ url: DEFAULT_OG_IMAGE, alt: SITE_NAME }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [DEFAULT_OG_IMAGE],
    },
  };
}
