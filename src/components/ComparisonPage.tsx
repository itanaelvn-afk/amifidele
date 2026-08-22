"use client";

import { useState, useEffect, useCallback, useId } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { PawPrint, Search, ChevronLeft, ChevronRight, X } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { ComparisonTable } from "@/components/ComparisonTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ProductFiltersComponent } from "@/components/ProductFilters";
import { ProductFilters } from "@/lib/api";
import { useProducts } from "@/hooks/useProducts";
import {
  DEFAULT_PRODUCT_SORT,
  PRODUCT_SORT_OPTIONS,
  parseProductSortValue,
  sortValueToApiParams,
  type ProductSortValue,
} from "@/lib/product-sort";
import type { DisplayProduct } from "@/lib/types";
import { fetchSimilarProducts } from "@/lib/similar-products";
import { SimilarProductsSection } from "@/components/SimilarProductsSection";
import { ProductGridSkeleton } from "@/components/ProductGridSkeleton";
import { cn } from "@/components/utils";

const SEARCH_DEBOUNCE_MS = 350;
const MAX_COMPARISON_PRODUCTS = 3;

export function ComparisonPage() {
  const sortSelectId = useId();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<ProductFilters>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  /** Produits choisis (objets complets) — survivent au changement de page / filtre. */
  const [selectedProducts, setSelectedProducts] = useState<DisplayProduct[]>([]);
  const [suggestions, setSuggestions] = useState<DisplayProduct[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const sortValue = parseProductSortValue(searchParams.get("sort"));
  const urlBrandId = searchParams.get("brandId")?.trim() || undefined;
  const urlBrandName = searchParams.get("brandName")?.trim() || undefined;
  const filtersWithUrl: ProductFilters = {
    ...filters,
    brandId: urlBrandId,
    brandName: urlBrandId ? urlBrandName : undefined,
  };
  const limit = 20;

  const { products, loading, error, pagination, loadProducts } = useProducts();

  const syncSortToUrl = useCallback(
    (next: ProductSortValue) => {
      const params = new URLSearchParams(searchParams.toString());
      if (next === DEFAULT_PRODUCT_SORT) {
        params.delete("sort");
      } else {
        params.set("sort", next);
      }
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  const syncBrandToUrl = useCallback(
    (brandId?: string, brandName?: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (brandId) {
        params.set("brandId", brandId);
        if (brandName) params.set("brandName", brandName);
        else params.delete("brandName");
      } else {
        params.delete("brandId");
        params.delete("brandName");
      }
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  // Debounce la recherche pour éviter une requête à chaque frappe
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery.trim());
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Charger les produits selon les filtres + recherche stabilisée + tri
  useEffect(() => {
    const filtersToApply: ProductFilters = {
      ...filters,
      brandId: urlBrandId,
      brandName: urlBrandId ? urlBrandName : undefined,
    };
    if (debouncedSearch) {
      filtersToApply.search = debouncedSearch;
    }
    const { sort, order } = sortValueToApiParams(sortValue);
    filtersToApply.sort = sort;
    filtersToApply.order = order;
    void loadProducts(currentPage, limit, filtersToApply);
  }, [
    currentPage,
    filters,
    urlBrandId,
    urlBrandName,
    debouncedSearch,
    sortValue,
    loadProducts,
  ]);

  // Suggestions pour compléter la comparaison (1 ou 2 produits déjà choisis)
  useEffect(() => {
    if (selectedProducts.length === 0 || selectedProducts.length >= MAX_COMPARISON_PRODUCTS) {
      return;
    }

    let cancelled = false;
    const seed = selectedProducts[0];
    void fetchSimilarProducts(seed, {
      limit: 4,
      excludeIds: selectedProducts.map((p) => p.id),
    }).then((list) => {
      if (!cancelled) setSuggestions(list);
    });

    return () => {
      cancelled = true;
    };
  }, [selectedProducts]);

  const handleSortChange = (next: ProductSortValue) => {
    setCurrentPage(1);
    syncSortToUrl(next);
  };

  const toggleProductSelection = (id: string) => {
    setSelectedProducts((prev) => {
      if (prev.some((p) => p.id === id)) {
        return prev.filter((p) => p.id !== id);
      }
      if (prev.length >= MAX_COMPARISON_PRODUCTS) {
        return prev;
      }
      const fromListing = products.find((p) => p.id === id);
      const fromSuggestions = suggestions.find((p) => p.id === id);
      const product = fromListing ?? fromSuggestions;
      if (!product) {
        return prev;
      }
      return [...prev, product];
    });
  };

  const removeFromComparison = (id: string) => {
    setSelectedProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const isProductSelected = (id: string) =>
    selectedProducts.some((p) => p.id === id);

  const selectedIds = selectedProducts.map((p) => p.id);
  const isInitialLoad = loading && products.length === 0;
  const totalLabel =
    loading && pagination.total === 0 ? "…" : pagination.total.toLocaleString("fr-FR");

  return (
    <div className="min-h-screen bg-background">
      {/* Search and Filters */}
      <div className="sticky top-0 z-40 bg-card/95 backdrop-blur-md border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-6">
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Rechercher un produit, une marque, une catégorie..."
              value={searchQuery}
              onChange={(e) => {
                setCurrentPage(1);
                setSearchQuery(e.target.value);
              }}
              className="pl-12 pr-10 h-12 text-base bg-background border-2 focus:border-primary transition-colors"
              aria-label="Rechercher un produit, une marque ou une catégorie"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setCurrentPage(1);
                  setSearchQuery("");
                }}
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
          filters={filtersWithUrl}
          onFiltersChange={(nextFilters) => {
            setCurrentPage(1);
            setFilters(nextFilters);
            syncBrandToUrl(nextFilters.brandId, nextFilters.brandName);
          }}
        />
        {/* Results Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold mb-2">Nos produits</h2>
            <div className="flex items-center gap-2 text-muted-foreground">
              <span className="font-semibold text-foreground tabular-nums">{totalLabel}</span>
              {!isInitialLoad && (
                <>
                  <span>
                    produit{pagination.total > 1 ? "s" : ""} disponible
                    {pagination.total > 1 ? "s" : ""}
                  </span>
                  {pagination.totalPages > 1 && (
                    <>
                      <span>•</span>
                      <span>
                        Page {pagination.page} sur {pagination.totalPages}
                      </span>
                    </>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <label htmlFor={sortSelectId} className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="whitespace-nowrap">Trier par</span>
              <select
                id={sortSelectId}
                value={sortValue}
                onChange={(e) =>
                  handleSortChange(parseProductSortValue(e.target.value))
                }
                className="h-10 min-w-[11rem] rounded-md border border-border bg-background px-3 text-sm text-foreground"
              >
                {PRODUCT_SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          
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
        </div>

        {isInitialLoad && <ProductGridSkeleton count={8} />}

        {error && (
          <Card className="bg-destructive/10 border-destructive/20 p-6 mb-8">
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-full bg-destructive/20">
                <X className="w-5 h-5 text-destructive" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-destructive mb-1">Erreur de chargement</p>
                <p className="text-destructive/80 text-sm mb-2">{error}</p>
                <p className="text-muted-foreground text-sm">
                  Impossible de charger les produits depuis l&apos;API. Veuillez vérifier votre connexion et réessayer.
                </p>
              </div>
            </div>
          </Card>
        )}

        {!isInitialLoad && !error && (
          <div
            className={cn(
              "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8 min-h-[32rem] transition-opacity",
              loading && "opacity-60 pointer-events-none"
            )}
            aria-busy={loading}
          >
            {products.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                isSelected={isProductSelected(product.id)}
                onToggleSelect={toggleProductSelection}
                priority={index < 4}
              />
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {!isInitialLoad && !error && pagination.totalPages > 1 && (
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

        {!isInitialLoad && !error && products.length === 0 && (
          <Card className="p-12 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-6">
              <PawPrint className="w-10 h-10 text-muted-foreground" />
            </div>
            <p className="text-xl font-semibold mb-2">Aucun produit trouvé</p>
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

        {selectedProducts.length > 0 &&
          selectedProducts.length < MAX_COMPARISON_PRODUCTS && (
            <SimilarProductsSection
              products={suggestions}
              title="Compléter la comparaison"
              subtitle="Suggestions proches du premier produit sélectionné (même catégorie, prix voisin)."
              onToggleSelect={toggleProductSelection}
              selectedIds={selectedIds}
              className="mt-4 mb-8"
            />
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
        products={selectedProducts}
        isOpen={showComparison}
        onClose={() => setShowComparison(false)}
        onRemoveProduct={removeFromComparison}
      />
    </div>
  );
}
