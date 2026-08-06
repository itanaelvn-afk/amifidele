"use client";

import { useState, useEffect } from "react";
import { PawPrint, Search, SlidersHorizontal, ChevronLeft, ChevronRight, X } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { DisplayProduct } from "@/lib/types";
import { ComparisonTable } from "@/components/ComparisonTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Footer } from "@/components/Footer";
import { useProducts } from "@/hooks/useProducts";
import { Card } from "@/components/ui/card";
import { ProductFiltersComponent } from "@/components/ProductFilters";
import { ProductFilters } from "@/lib/api";

export function ComparisonPage() {
  const [filters, setFilters] = useState<ProductFilters>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 20;

  const { products, loading, error, pagination, loadProducts } = useProducts();

  // Charger les produits selon les filtres
  useEffect(() => {
    const loadData = async () => {
      const filtersToApply: ProductFilters = { ...filters };
      if (searchQuery.trim()) {
        filtersToApply.search = searchQuery.trim();
      }
      await loadProducts(currentPage, limit, filtersToApply);
    };
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, filters, searchQuery]);

  const toggleProductSelection = (id: string) => {
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

  const removeFromComparison = (id: string) => {
    setSelectedProducts((prev) => prev.filter((productId) => productId !== id));
  };

  const selectedProductsData = products.filter((p) => selectedProducts.includes(p.id));

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-accent/20 to-secondary/10 border-b border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl">
            <Badge className="bg-primary/20 text-primary border-primary/30 mb-4">
              🔍 Catalogue Complet
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Trouvez le produit parfait
            </h1>
            <p className="text-muted-foreground text-lg mb-8">
              Explorez notre catalogue complet et comparez les meilleurs produits pour vos animaux de compagnie
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <div className="sticky top-0 z-40 bg-card/95 backdrop-blur-md border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-6">
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Rechercher un produit, une marque, une catégorie..."
              value={searchQuery}
              onChange={(e) => {
                setCurrentPage(1);
                setSearchQuery(e.target.value);
              }}
              className="pl-12 pr-10 h-12 text-base bg-background border-2 focus:border-primary transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-muted transition-colors"
                aria-label="Effacer la recherche"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            )}
          </div>

        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Filtres */}
        <ProductFiltersComponent
          filters={filters}
          onFiltersChange={(nextFilters) => {
            setCurrentPage(1);
            setFilters(nextFilters);
          }}
        />
        {/* Results Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold mb-2">Nos produits</h2>
            <div className="flex items-center gap-2 text-muted-foreground">
              <span className="font-semibold text-foreground">{pagination.total}</span>
              <span>produit{pagination.total > 1 ? 's' : ''} disponible{pagination.total > 1 ? 's' : ''}</span>
              {pagination.totalPages > 1 && (
                <>
                  <span>•</span>
                  <span>Page {pagination.page} sur {pagination.totalPages}</span>
                </>
              )}
            </div>
          </div>
          
          {selectedProducts.length > 0 && (
            <Card className="p-4 bg-primary/10 border-primary/20">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-primary/20">
                  <PawPrint className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Produits sélectionnés</p>
                  <p className="font-semibold text-foreground">{selectedProducts.length} / 3</p>
                </div>
                <Button
                  size="sm"
                  onClick={() => setShowComparison(true)}
                  className="ml-auto"
                >
                  Comparer
                </Button>
              </div>
            </Card>
          )}
        </div>

        {loading && (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
              <PawPrint className="w-10 h-10 text-primary animate-pulse" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Chargement des produits...</h3>
            <p className="text-muted-foreground">Veuillez patienter</p>
          </div>
        )}

        {error && (
          <Card className="bg-destructive/10 border-destructive/20 p-6 mb-8">
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-full bg-destructive/20">
                <X className="w-5 h-5 text-destructive" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-destructive mb-1">Erreur de chargement</h3>
                <p className="text-destructive/80 text-sm mb-2">{error}</p>
                <p className="text-muted-foreground text-sm">
                  Impossible de charger les produits depuis l&apos;API. Veuillez vérifier votre connexion et réessayer.
                </p>
              </div>
            </div>
          </Card>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isSelected={selectedProducts.includes(product.id)}
                onToggleSelect={toggleProductSelection}
              />
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {!loading && !error && pagination.totalPages > 1 && (
          <Card className="p-6 mt-12 mb-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-muted-foreground">
                Affichage de <span className="font-semibold text-foreground">{(currentPage - 1) * limit + 1}</span> à{" "}
                <span className="font-semibold text-foreground">
                  {Math.min(currentPage * limit, pagination.total)}
                </span>{" "}
                sur <span className="font-semibold text-foreground">{pagination.total}</span> produits
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Précédent
                </Button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    let pageNum: number;
                    if (pagination.totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= pagination.totalPages - 2) {
                      pageNum = pagination.totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(pageNum)}
                        className={`min-w-[40px] ${
                          currentPage === pageNum
                            ? "bg-primary text-primary-foreground shadow-md"
                            : "hover:bg-accent"
                        }`}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
                  disabled={currentPage === pagination.totalPages}
                  className="gap-2"
                >
                  Suivant
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        )}

        {!loading && !error && products.length === 0 && (
          <Card className="p-12 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-6">
              <PawPrint className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Aucun produit trouvé</h3>
            <p className="text-muted-foreground mb-6">
              Essayez de modifier vos critères de recherche ou de changer de catégorie
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setFilters({});
                }}
              >
                Réinitialiser les filtres
              </Button>
            </div>
          </Card>
        )}
      </main>

      {/* Floating Comparison Button */}
      {selectedProducts.length > 0 && (
        <div className="fixed bottom-6 right-6 z-20 animate-in slide-in-from-bottom-5">
          <Button
            size="lg"
            className="shadow-2xl rounded-full px-6 py-6 bg-primary hover:bg-primary/90 text-primary-foreground hover:scale-105 transition-transform"
            onClick={() => setShowComparison(true)}
          >
            <PawPrint className="w-5 h-5 mr-2" />
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
