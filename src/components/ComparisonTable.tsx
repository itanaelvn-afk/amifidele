"use client";

import { X } from "lucide-react";
import { Product } from "@/components/ProductCard";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ComparisonTableProps {
  products: Product[];
  isOpen: boolean;
  onClose: () => void;
  onRemoveProduct: (id: number) => void;
}

export function ComparisonTable({
  products,
  isOpen,
  onClose,
  onRemoveProduct,
}: ComparisonTableProps) {
  if (products.length === 0) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Comparaison de produits</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="border border-border rounded-lg p-4 relative bg-card"
            >
              <button
                onClick={() => onRemoveProduct(product.id)}
                className="absolute top-2 right-2 p-1 rounded-full bg-muted hover:bg-accent transition-colors"
                aria-label="Retirer de la comparaison"
              >
                <X className="w-4 h-4" />
              </button>

              <ImageWithFallback
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />

              <div className="space-y-3">
                <div>
                  <p className="text-muted-foreground">
                    {product.brand}
                  </p>
                  <h4 className="mb-1">{product.name}</h4>
                  <p className="text-primary">
                    {product.price.toFixed(2)}€
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-1 mb-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span
                        key={i}
                        className={
                          i < Math.floor(product.rating)
                            ? "text-primary"
                            : "text-muted"
                        }
                      >
                        ★
                      </span>
                    ))}
                    <span className="ml-2 text-muted-foreground">
                      ({product.rating})
                    </span>
                  </div>
                </div>

                <div>
                  <p className="mb-2">
                    Catégorie: {product.category}
                  </p>
                  <p className="text-muted-foreground mb-2">
                    {product.description}
                  </p>
                </div>

                <div>
                  <p className="mb-2">Caractéristiques:</p>
                  <ul className="space-y-1">
                    {product.features.map((feature, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2"
                      >
                        <span className="text-primary mt-1">
                          ✓
                        </span>
                        <span className="text-muted-foreground">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end mt-6">
          <Button onClick={onClose}>Fermer</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}