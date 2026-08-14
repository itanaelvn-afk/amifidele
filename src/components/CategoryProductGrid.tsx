"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, PawPrint } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useProducts } from "@/hooks/useProducts";

export function CategoryProductGrid({ categoryId }: { categoryId: string }) {
  const [page, setPage] = useState(1);
  const limit = 20;
  const { products, loading, error, pagination, loadProducts } = useProducts();

  useEffect(() => {
    setPage(1);
  }, [categoryId]);

  useEffect(() => {
    void loadProducts(page, limit, { categoryId });
  }, [page, limit, categoryId, loadProducts]);

  if (loading) {
    return (
      <div className="text-center py-16">
        <PawPrint className="w-10 h-10 text-primary animate-pulse mx-auto mb-4" />
        <p className="text-muted-foreground">Chargement des produits…</p>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-6 bg-destructive/10 border-destructive/20">
        <p className="text-destructive">{error}</p>
      </Card>
    );
  }

  if (products.length === 0) {
    return (
      <Card className="p-10 text-center">
        <p className="text-muted-foreground">
          Aucun produit dans cette catégorie pour le moment.
        </p>
      </Card>
    );
  }

  return (
    <div>
      <p className="text-muted-foreground mb-6">
        <span className="font-semibold text-foreground">{pagination.total}</span>{" "}
        produit{pagination.total > 1 ? "s" : ""}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        {products.map((product, index) => (
          <ProductCard key={product.id} product={product} priority={index < 4} />
        ))}
      </div>
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            <ChevronLeft className="w-4 h-4" />
            Précédent
          </Button>
          <span className="text-sm text-muted-foreground px-2">
            Page {pagination.page} / {pagination.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page === pagination.totalPages}
            onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
          >
            Suivant
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
