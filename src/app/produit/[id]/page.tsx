import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchProductById } from "@/lib/api";
import { mapApiProductToDisplayProduct } from "@/lib/utils/api-utils";
import { SiteChrome } from "@/components/SiteChrome";
import { ProductDetailView } from "@/components/ProductDetailView";
import { productPath, stripHtml, truncate } from "@/lib/product-path";

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
      : undefined;

  return {
    title,
    description,
    alternates: { canonical: productPath(display.id) },
    openGraph: {
      title,
      description,
      type: "website",
      locale: "fr_FR",
      siteName: "AmiFidele",
      ...(image ? { images: [{ url: image, alt: display.name }] } : {}),
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title,
      description,
      ...(image ? { images: [image] } : {}),
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

  return (
    <SiteChrome current="other">
      <ProductDetailView
        product={display}
        extraImages={extraImages}
        inStock={raw.inStock}
      />
    </SiteChrome>
  );
}
