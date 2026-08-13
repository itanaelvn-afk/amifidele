"use client";

import Link from "next/link";
import { Check, ShoppingCart } from "lucide-react";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DisplayProduct } from "@/lib/types";
import { productPath, formatDeliveryLabel } from "@/lib/product-path";

interface ProductCardProps {
  product: DisplayProduct;
  isSelected?: boolean;
  onToggleSelect?: (id: string) => void;
}

export function ProductCard({ product, isSelected, onToggleSelect }: ProductCardProps) {
  const href = productPath(product.id);

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg group">
      <div className="relative overflow-hidden">
        <Link href={href} className="block">
          <ImageWithFallback
            src={product.image}
            alt={product.name}
            className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </Link>
      </div>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <p className="text-muted-foreground mb-1">{product.brand}</p>
            <h3 className="mb-2">
              <Link href={href} className="hover:text-primary transition-colors">
                {product.name}
              </Link>
            </h3>
          </div>
          <div className="ml-4 text-right">
            {product.oldPrice != null && product.oldPrice > product.price && (
              <p className="text-muted-foreground text-sm line-through">
                {product.oldPrice.toFixed(2)}€
              </p>
            )}
            <p className="text-primary">{product.price.toFixed(2)}€</p>
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

        <p className="text-muted-foreground mb-4 line-clamp-2">
          {product.description}
        </p>

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
              onClick={() => window.open(product.bestAffiliateLink, '_blank', 'noopener,noreferrer')}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Acheter
            </Button>
          )}
        </div>
        
        {product.merchantName && (
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Disponible chez {product.merchantName}
          </p>
        )}
        <p className="text-xs text-muted-foreground mt-1 text-center">
          {formatDeliveryLabel(product.delivery, product.currency)}
        </p>
      </CardContent>
    </Card>
  );
}
