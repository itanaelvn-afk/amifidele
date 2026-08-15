import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchProductById } from "@/lib/api";
import { mapApiProductToDisplayProduct } from "@/lib/utils/api-utils";
import { fetchSimilarProducts } from "@/lib/similar-products";
import { SiteChrome } from "@/components/SiteChrome";
import { ProductDetailView } from "@/components/ProductDetailView";
import { parseProductDescription } from "@/lib/format-description";
import { sanitizeDescriptionHtml } from "@/lib/sanitize-description-html";
import { productPath, stripHtml, truncate } from "@/lib/product-path";
import { DEFAULT_OG_IMAGE, SITE_NAME } from "@/lib/seo";

function collectExtraImages(product: {
  images?: { main?: string; thumb?: string };
  uri?: {
    alternateImage?: string;
    alternateImageTwo?: string;
    alternateImageThree?: string;
    mImage?: string;
    awImage?: string;
  };
}): string[] {
  return [
    product.images?.thumb,
    product.uri?.alternateImage,
    product.uri?.alternateImageTwo,
    product.uri?.alternateImageThree,
    product.uri?.mImage,
    product.uri?.awImage,
  ].filter((url): url is string => Boolean(url && url.trim()));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const raw = await fetchProductById(decodeURIComponent(id));
  if (!raw) {
    return {
      title: "Produit introuvable | AmiFidele",
      robots: { index: false, follow: false },
    };
  }

  const display = mapApiProductToDisplayProduct(raw);
  const description = truncate(
    stripHtml(display.description) ||
      `Comparez ${display.name} sur AmiFidele, comparateur de produits pour animaux.`,
    160
  );
  const title = `${display.name} | AmiFidele`;
  const image =
    display.image.startsWith("http://") || display.image.startsWith("https://")
      ? display.image
      : DEFAULT_OG_IMAGE;

  return {
    title,
    description,
    alternates: { canonical: productPath(display.id) },
    openGraph: {
      title,
      description,
      type: "website",
      locale: "fr_FR",
      siteName: SITE_NAME,
      images: [{ url: image, alt: display.name }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default async function ProduitPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const raw = await fetchProductById(decodeURIComponent(id));
  if (!raw) {
    notFound();
  }

  const display = mapApiProductToDisplayProduct(raw);
  const extraImages = collectExtraImages(raw).filter((url) => url !== display.image);
  const isHtmlDescription = display.descriptionFormat === "html";
  const descriptionHtml = isHtmlDescription
    ? sanitizeDescriptionHtml(display.description)
    : undefined;
  const descriptionBlocks =
    !isHtmlDescription && display.description
      ? parseProductDescription(display.description)
      : [];

  const similarProducts = await fetchSimilarProducts(display);

  return (
    <SiteChrome current="other">
      <ProductDetailView
        product={display}
        extraImages={extraImages}
        inStock={raw.inStock}
        descriptionBlocks={descriptionBlocks}
        descriptionHtml={descriptionHtml}
        similarProducts={similarProducts}
      />
    </SiteChrome>
  );
}
