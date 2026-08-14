"use client";

import Link from "next/link";
import { ExternalLink, ShoppingCart } from "lucide-react";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { DisplayProduct } from "@/lib/types";
import type { DescriptionBlock } from "@/lib/format-description";
import { formatDeliveryLabel, truncate } from "@/lib/product-path";
import { categorySegmentHref } from "@/lib/category-breadcrumb";
import { ProductDescription } from "@/components/ProductDescription";

function formatPrice(amount: number, currency?: string): string {
  const suffix = currency && currency !== "EUR" ? ` ${currency}` : "€";
  return `${amount.toFixed(2)}${suffix}`;
}

export function ProductDetailView({
  product,
  extraImages = [],
  inStock,
  descriptionBlocks,
  descriptionHtml,
}: {
  product: DisplayProduct;
  extraImages?: string[];
  inStock?: boolean;
  descriptionBlocks?: DescriptionBlock[];
  descriptionHtml?: string;
}) {
  const gallery = [product.image, ...extraImages].filter(
    (url, index, all) => url && url !== "/images/placeholder.jpg" && all.indexOf(url) === index
  );
  const mainImage = gallery[0] || product.image;
  const thumbs = gallery.slice(1);

  return (
    <main className="container mx-auto px-4 py-8 max-w-6xl">
      <nav className="text-sm text-muted-foreground mb-6" aria-label="Fil d'Ariane">
        <Link href="/" className="hover:text-primary">
          Accueil
        </Link>
        {(product.categoryTrail ?? []).map((segment) => {
          const href = categorySegmentHref(segment);
          return (
            <span key={segment.slug}>
              <span className="mx-2">/</span>
              {href ? (
                <Link href={href} className="hover:text-primary">
                  {segment.label}
                </Link>
              ) : (
                <span>{segment.label}</span>
              )}
            </span>
          );
        })}
        <span className="mx-2">/</span>
        <span className="text-foreground">{truncate(product.name, 48)}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <div className="rounded-2xl overflow-hidden bg-muted/40 border border-border">
            <ImageWithFallback
              src={mainImage}
              alt={product.name}
              className="w-full h-[420px] bg-white"
              imageClassName="object-contain"
              sizes="(min-width: 1024px) 50vw, 100vw"
              priority
            />
          </div>
          {thumbs.length > 0 && (
            <div className="mt-4 grid grid-cols-4 gap-3">
              {thumbs.slice(0, 4).map((src) => (
                <div
                  key={src}
                  className="rounded-lg overflow-hidden border border-border bg-white"
                >
                  <ImageWithFallback
                    src={src}
                    alt=""
                    className="w-full h-24"
                    imageClassName="object-contain"
                    sizes="120px"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-5">
          <div>
            <p className="text-muted-foreground mb-1">{product.brand}</p>
            <h1 className="text-3xl font-bold mb-3">{product.name}</h1>
            {product.category && (
              <Badge variant="secondary">{product.category}</Badge>
            )}
          </div>

          <div>
            {product.oldPrice != null && product.oldPrice > product.price && (
              <p className="text-muted-foreground line-through text-sm">
                {formatPrice(product.oldPrice, product.currency)}
              </p>
            )}
            <p className="text-primary text-3xl font-bold">
              {formatPrice(product.price, product.currency)}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {formatDeliveryLabel(product.delivery, product.currency)}
            </p>
            {product.unitPriceLabel && (
              <p className="text-sm text-muted-foreground">
                Prix unitaire : {product.unitPriceLabel}
              </p>
            )}
            {product.packSize && (
              <p className="text-sm text-muted-foreground">
                Conditionnement : {product.packSize}
              </p>
            )}
          </div>

          {inStock === false && (
            <p className="text-amber-700 text-sm font-medium">
              Indiqué comme indisponible chez le marchand.
            </p>
          )}

          {product.merchantName && (
            <p className="text-muted-foreground">
              Proposé par{" "}
              <span className="font-medium text-foreground">{product.merchantName}</span>
            </p>
          )}

          {product.bestAffiliateLink ? (
            <Button asChild size="lg" className="w-full sm:w-auto">
              <a
                href={product.bestAffiliateLink}
                target="_blank"
                rel="nofollow sponsored noopener noreferrer"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Voir chez le marchand
                <ExternalLink className="w-4 h-4 ml-2" />
              </a>
            </Button>
          ) : (
            <p className="text-sm text-muted-foreground">
              Lien d&apos;achat indisponible pour ce produit.
            </p>
          )}

          <p className="text-xs text-muted-foreground">
            AmiFidele est un comparateur. Le bouton ci-dessus ouvre le site du
            partenaire (lien affilié).
          </p>
        </div>
      </div>

      {product.description && (
        <section className="mt-12 max-w-3xl">
          <h2 className="text-xl font-semibold mb-3">Description</h2>
          <ProductDescription
            text={product.description}
            blocks={descriptionBlocks}
            html={descriptionHtml}
          />
        </section>
      )}
    </main>
  );
}
