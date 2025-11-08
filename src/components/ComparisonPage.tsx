"use client";

import { useState } from "react";
import { PawPrint, Search, SlidersHorizontal } from "lucide-react";
import { ProductCard, Product } from "@/components/ProductCard";
import { ComparisonTable } from "@/components/ComparisonTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Footer } from "@/components/Footer";

interface ComparisonPageProps {
  products: Product[];
}

const categories = ["Tous", "Alimentation", "Jouets", "Accessoires", "Repos"];

export function ComparisonPage({ products }: ComparisonPageProps) {
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [showComparison, setShowComparison] = useState(false);

  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === "Tous" || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleProductSelection = (id: number) => {
    setSelectedProducts((prev) => {
      if (prev.includes(id)) {
        return prev.filter((productId) => productId !== id);
      } else {
        if (prev.length >= 3) {
          return prev;
        }
        return [...prev, id];
      }
    });
  };

  const removeFromComparison = (id: number) => {
    setSelectedProducts((prev) => prev.filter((productId) => productId !== id));
  };

  const selectedProductsData = products.filter((p) => selectedProducts.includes(p.id));

  return (
    <div className="min-h-screen">
      {/* Search and Filters */}
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-6">
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Rechercher un produit..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 bg-input-background"
            />
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2 items-center">
            <SlidersHorizontal className="w-5 h-5 text-muted-foreground mr-2" />
            {categories.map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className="cursor-pointer px-4 py-2 transition-colors hover:bg-accent"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="mb-2">Catalogue des produits</h2>
          <p className="text-muted-foreground">
            {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''} disponible{filteredProducts.length > 1 ? 's' : ''}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isSelected={selectedProducts.includes(product.id)}
              onToggleSelect={toggleProductSelection}
            />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <PawPrint className="w-16 h-16 text-muted mx-auto mb-4" />
            <h3 className="mb-2">Aucun produit trouvé</h3>
            <p className="text-muted-foreground">
              Essayez de modifier vos critères de recherche
            </p>
          </div>
        )}
      </main>

      {/* Floating Comparison Button */}
      {selectedProducts.length > 0 && (
        <div className="fixed bottom-6 right-6 z-20">
          <Button
            size="lg"
            className="shadow-lg rounded-full px-6 py-6"
            onClick={() => setShowComparison(true)}
          >
            Comparer ({selectedProducts.length}/3)
          </Button>
        </div>
      )}

      {/* Comparison Modal */}
      <ComparisonTable
        products={selectedProductsData}
        isOpen={showComparison}
        onClose={() => setShowComparison(false)}
        onRemoveProduct={removeFromComparison}
      />

      <Footer />
    </div>
  );
}
