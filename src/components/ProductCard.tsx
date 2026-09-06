"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Check, ShoppingCart } from "lucide-react";
import {
  ImageWithFallback,
  PRODUCT_CARD_IMAGE_SIZES,
} from "@/components/figma/ImageWithFallback";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DisplayProduct } from "@/lib/types";
import { productPath, formatDeliveryLabel, stripHtml } from "@/lib/product-path";
import { trackAffiliateClick } from "@/lib/analytics";

interface ProductCardProps {
  product: DisplayProduct;
  isSelected?: boolean;
  onToggleSelect?: (id: string) => void;
  priority?: boolean;
  /** Emplacement analytics pour affiliate_click (ex. featured_partners). */
  analyticsPlacement?: string;
}

export function ProductCard({ product, isSelected, onToggleSelect, priority = false, analyticsPlacement }: ProductCardProps) {
  const href = productPath(product.id);
  const pathname = usePathname();

  const handleAffiliateClick = () => {
    trackAffiliateClick({
      productId: product.id,
      merchantName: product.merchantName,
      pagePath: pathname,
      placement: analyticsPlacement,
    });
    window.open(product.bestAffiliateLink, "_blank", "noopener,noreferrer");
  };

  const plainDescription = product.description
    ? stripHtml(product.description)
    : "";

  return (
    <Card className="h-full overflow-hidden gap-0 transition-all duration-300 hover:shadow-lg group">
      <div className="relative shrink-0 overflow-hidden bg-white aspect-[4/3] min-h-64">
        <Link href={href} className="block h-full">
          <ImageWithFallback
            src={product.image}
            alt={product.name}
            className="w-full h-full min-h-64 bg-white"
            imageClassName="object-contain transition-transform duration-300 group-hover:scale-105"
            sizes={PRODUCT_CARD_IMAGE_SIZES}
            priority={priority}
          />
        </Link>
      </div>
      <CardContent className="p-6 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1 min-w-0">
            <p className="text-muted-foreground mb-1">{product.brand}</p>
            <h3 className="mb-2 line-clamp-2 min-h-[2.5em]">
              <Link href={href} className="hover:text-primary transition-colors">
                {product.name}
              </Link>
            </h3>
          </div>
          <div className="ml-4 text-right shrink-0">
            {product.oldPrice != null && product.oldPrice > product.price && (
              <p className="text-muted-foreground text-sm line-through">
                {product.oldPrice.toFixed(2)}€
              </p>
            )}
            {product.priceFrom ? (
              <p className="text-primary">
                <span className="block text-xs font-normal text-muted-foreground">
                  À partir de
                </span>
                {product.price.toFixed(2)}€
              </p>
            ) : (
              <p className="text-primary">{product.price.toFixed(2)}€</p>
            )}
          </div>
        </div>

        {product.rating && (
          <div className="flex items-center gap-1 mb-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className={i < Math.floor(product.rating!) ? "text-primary" : "text-muted"}>
                ★
              </span>
            ))}
            <span className="ml-2 text-muted-foreground">
              ({product.rating})
            </span>
          </div>
        )}

        {plainDescription ? (
          <p className="text-muted-foreground mb-4 line-clamp-2 min-h-[2.5em]">
            {plainDescription}
          </p>
        ) : (
          <div className="mb-4 min-h-[2.5em]" aria-hidden />
        )}

        <div className="mt-auto">
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline" className={onToggleSelect ? "flex-1" : "w-full"}>
              <Link href={href}>Voir la fiche</Link>
            </Button>
            {onToggleSelect && (
            <Button
              variant={isSelected ? "default" : "outline"}
              className="flex-1"
              onClick={() => onToggleSelect(product.id)}
            >
              {isSelected ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Sélectionné
                </>
              ) : (
                "Comparer"
              )}
            </Button>
            )}
            {product.bestAffiliateLink && (
              <Button
                variant="default"
                className="bg-primary hover:bg-primary/90"
                onClick={handleAffiliateClick}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Acheter
              </Button>
            )}
          </div>

          {product.priceFrom && (product.offerCount ?? 0) > 1 ? (
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Comparé chez {product.offerCount} marchands
            </p>
          ) : product.merchantName ? (
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Disponible chez {product.merchantName}
            </p>
          ) : null}
          <p className="text-xs text-muted-foreground mt-1 text-center">
            {formatDeliveryLabel(product.delivery, product.currency)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
