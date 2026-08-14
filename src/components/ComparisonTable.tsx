"use client";

import Link from "next/link";
import { X, ShoppingCart } from "lucide-react";
import { DisplayProduct } from "@/lib/types";
import { productPath, formatDeliveryLabel } from "@/lib/product-path";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ComparisonTableProps {
  products: DisplayProduct[];
  isOpen: boolean;
  onClose: () => void;
  onRemoveProduct: (id: string) => void;
}

export function ComparisonTable({
  products,
  isOpen,
  onClose,
  onRemoveProduct,
}: ComparisonTableProps) {
  if (products.length === 0) return null;

  // Trouver le meilleur prix pour chaque produit
  const getBestPrice = (product: DisplayProduct) => {
    return product.price;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="!max-w-[98vw] !w-[98vw] !sm:max-w-[98vw] max-h-[95vh] overflow-y-auto comparison-scrollbar p-8">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-2xl font-bold">Comparaison de produits</DialogTitle>
          <p className="text-muted-foreground mt-1">
            Comparez {products.length} produit{products.length > 1 ? 's' : ''} côte à côte
          </p>
        </DialogHeader>

        <div className={`grid gap-8 mt-6 ${
          products.length === 1 
            ? 'grid-cols-1 max-w-md mx-auto' 
            : products.length === 2 
            ? 'grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto' 
            : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
        }`}>
          {products.map((product) => {
            const bestPrice = getBestPrice(product);
            return (
              <div
                key={product.id}
                className="border-2 border-border rounded-xl p-6 relative bg-card hover:shadow-lg transition-all min-w-0"
              >
                <button
                  onClick={() => onRemoveProduct(product.id)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-muted hover:bg-destructive hover:text-destructive-foreground transition-colors z-10 shadow-md"
                  aria-label="Retirer de la comparaison"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="mb-6">
                  <ImageWithFallback
                    src={product.image}
                    alt={product.name}
                    className="w-full h-56 rounded-xl bg-white"
                    imageClassName="object-contain"
                    sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 100vw"
                  />
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">
                      {product.brand}
                    </p>
                    <h4 className="text-lg font-bold mb-3 line-clamp-3 min-h-[4.5rem]">
                      <Link
                        href={productPath(product.id)}
                        className="hover:text-primary transition-colors"
                      >
                        {product.name}
                      </Link>
                    </h4>
                    <div className="mb-3">
                      <p className="text-primary text-2xl font-bold">
                        {bestPrice.toFixed(2)}€
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {formatDeliveryLabel(product.delivery, product.currency)}
                      </p>
                    </div>
                    {product.merchantName && (
                      <p className="text-sm text-muted-foreground">
                        Disponible chez <span className="font-semibold text-foreground">{product.merchantName}</span>
                      </p>
                    )}
                  </div>

                  {product.rating && (
                    <div className="pb-4 border-b border-border">
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span
                            key={i}
                            className={`text-lg ${
                              i < Math.floor(product.rating!)
                                ? "text-primary"
                                : "text-muted"
                            }`}
                          >
                            ★
                          </span>
                        ))}
                        <span className="ml-3 text-muted-foreground font-medium">
                          {product.rating.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="space-y-3 pb-4 border-b border-border">
                    <div>
                      <p className="text-sm font-semibold text-muted-foreground mb-1">Catégorie</p>
                      <p className="text-foreground">{product.category}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-muted-foreground mb-2">Description</p>
                      <p className="text-muted-foreground text-sm leading-relaxed line-clamp-4">
                        {product.description}
                      </p>
                    </div>
                  </div>

                  {product.features && product.features.length > 0 && (
                    <div className="pb-4 border-b border-border">
                      <p className="text-sm font-semibold text-muted-foreground mb-3">Caractéristiques</p>
                      <ul className="space-y-2">
                        {product.features.map((feature, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-3"
                          >
                            <span className="text-primary mt-0.5 text-lg font-bold flex-shrink-0">
                              ✓
                            </span>
                            <span className="text-foreground text-sm">
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <Button asChild size="lg" variant="outline" className="w-full mt-2">
                    <Link href={productPath(product.id)}>Voir la fiche</Link>
                  </Button>
                  {product.bestAffiliateLink && (
                    <Button
                      size="lg"
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold mt-4"
                      onClick={() => window.open(product.bestAffiliateLink, '_blank', 'noopener,noreferrer')}
                    >
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      Acheter maintenant
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-end mt-8 pt-6 border-t border-border">
          <Button size="lg" variant="outline" onClick={onClose}>
            Fermer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
