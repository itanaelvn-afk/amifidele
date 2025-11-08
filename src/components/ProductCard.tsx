"use client";

import { Heart, Check } from "lucide-react";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  rating: number;
  image: string;
  description: string;
  features: string[];
  brand: string;
}

interface ProductCardProps {
  product: Product;
  isSelected: boolean;
  onToggleSelect: (id: number) => void;
}

export function ProductCard({ product, isSelected, onToggleSelect }: ProductCardProps) {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg group">
      <div className="relative overflow-hidden">
        <ImageWithFallback
          src={product.image}
          alt={product.name}
          className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <button 
          className="absolute top-4 right-4 p-2 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white transition-colors"
          aria-label="Ajouter aux favoris"
        >
          <Heart className="w-5 h-5 text-primary" />
        </button>
        {product.rating >= 4.5 && (
          <Badge className="absolute top-4 left-4 bg-primary">
            ⭐ Recommandé
          </Badge>
        )}
      </div>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <p className="text-muted-foreground mb-1">{product.brand}</p>
            <h3 className="mb-2">{product.name}</h3>
          </div>
          <div className="ml-4">
            <p className="text-primary">{product.price.toFixed(2)}€</p>
          </div>
        </div>
        
        <div className="flex items-center gap-1 mb-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className={i < Math.floor(product.rating) ? "text-primary" : "text-muted"}>
              ★
            </span>
          ))}
          <span className="ml-2 text-muted-foreground">
            ({product.rating})
          </span>
        </div>

        <p className="text-muted-foreground mb-4 line-clamp-2">
          {product.description}
        </p>

        <Button
          variant={isSelected ? "default" : "outline"}
          className="w-full"
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
      </CardContent>
    </Card>
  );
}
