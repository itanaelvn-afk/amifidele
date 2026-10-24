"use client";

import { useCallback, useEffect, useId, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, PawPrint, Search, X } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { ProductFiltersComponent } from "@/components/ProductFilters";
import { ProductGridSkeleton } from "@/components/ProductGridSkeleton";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { ProductFilters } from "@/lib/api";
import type { CatalogFilterOptions } from "@/lib/catalog-filter-options";
import {
  EMPTY_CATALOG_LISTING,
  catalogListingHref,
  catalogListingToProductFilters,
  mergeCatalogListingState,
  parseCatalogListingParams,
  type CatalogListingState,
} from "@/lib/catalog-listing-url";
import { useProducts } from "@/hooks/useProducts";
import {
  PRODUCT_SORT_OPTIONS,
  parseProductSortValue,
  sortValueToApiParams,
  type ProductSortValue,
} from "@/lib/product-sort";
import { cn } from "@/components/utils";

const SEARCH_DEBOUNCE_MS = 350;
const LIMIT = 20;

function filtersToListingPatch(filters: ProductFilters): Partial<CatalogListingState> {
  return {
    merchantId: filters.merchantId,
    brandId: filters.brandId,
    brandName: filters.brandId ? filters.brandName : undefined,
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
    search: filters.search?.trim() || "",
    page: 1,
  };
}

export function CategoryProductGrid({
  categoryId,
  filterOptions = null,
}: {
  categoryId: string;
  filterOptions?: CatalogFilterOptions | null;
}) {
  const sortSelectId = useId();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const listing = useMemo(() => {
    const parsed = parseCatalogListingParams(searchParams);
    return {
      ...parsed,
      categoryId,
      categoryName: undefined,
    };
  }, [searchParams, categoryId]);

  const filtersFromUrl = useMemo(() => {
    const filters = catalogListingToProductFilters(listing);
    filters.categoryId = categoryId;
    delete filters.categoryName;
    return filters;
  }, [listing, categoryId]);

  const [searchInput, setSearchInput] = useState(listing.search);
  const [prevUrlSearch, setPrevUrlSearch] = useState(listing.search);
  if (listing.search !== prevUrlSearch) {
    setPrevUrlSearch(listing.search);
    setSearchInput(listing.search);
  }

  const { products, loading, error, pagination, loadProducts } = useProducts();

  const replaceListing = useCallback(
    (patch: Partial<CatalogListingState>) => {
      const next = mergeCatalogListingState(listing, {
        ...patch,
        categoryId,
        categoryName: undefined,
      });
      router.replace(
        catalogListingHref(pathname, next, { omitCategory: true }),
        { scroll: false }
      );
    },
    [categoryId, listing, pathname, router]
  );

  const resetListing = useCallback(() => {
    setSearchInput("");
    router.replace(pathname, { scroll: false });
  }, [pathname, router]);

  useEffect(() => {
    const trimmed = searchInput.trim();
    if (trimmed === listing.search) return;
    const timer = setTimeout(() => {
      replaceListing({ search: trimmed, page: 1 });
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [searchInput, listing.search, replaceListing]);

  useEffect(() => {
    const filtersToApply: ProductFilters = {
      ...catalogListingToProductFilters(listing),
      categoryId,
    };
    delete filtersToApply.categoryName;
    delete filtersToApply.search;
    if (listing.search) {
      filtersToApply.search = listing.search;
    }
    const { sort, order } = sortValueToApiParams(listing.sort);
    filtersToApply.sort = sort;
    filtersToApply.order = order;
    void loadProducts(listing.page, LIMIT, filtersToApply);
  }, [listing, categoryId, loadProducts]);

  const handleSortChange = (next: ProductSortValue) => {
    replaceListing({ sort: next, page: 1 });
  };

  const handleFiltersChange = (nextFilters: ProductFilters) => {
    const patch = filtersToListingPatch(nextFilters);
    if (typeof patch.search === "string") {
      setSearchInput(patch.search);
    }
    replaceListing({
      ...EMPTY_CATALOG_LISTING,
      sort: listing.sort,
      ...patch,
      categoryId,
      categoryName: undefined,
    });
  };

  const currentPage = listing.page;
  const isInitialLoad = loading && products.length === 0;
  const totalLabel =
    loading && pagination.total === 0
      ? "…"
      : pagination.total.toLocaleString("fr-FR");

  return (
    <div>
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Rechercher dans cette catégorie…"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="pl-12 pr-10 h-12 text-base bg-white border-2 focus:border-primary transition-colors"
          aria-label="Rechercher dans cette catégorie"
        />
        {searchInput && (
          <button
            type="button"
            onClick={() => {
              setSearchInput("");
              replaceListing({ search: "", page: 1 });
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-muted transition-colors"
            aria-label="Effacer la recherche"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        )}
      </div>

      <ProductFiltersComponent
        filters={filtersFromUrl}
        initialOptions={filterOptions}
        lockedCategoryId={categoryId}
        onFiltersChange={handleFiltersChange}
      />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <p className="text-muted-foreground">
          <span className="font-semibold text-foreground tabular-nums">{totalLabel}</span>{" "}
          produit{pagination.total > 1 ? "s" : ""}
          {pagination.totalPages > 1 && !isInitialLoad && (
            <>
              {" "}
              • Page {pagination.page} sur {pagination.totalPages}
            </>
          )}
        </p>
        <label
          htmlFor={sortSelectId}
          className="flex items-center gap-2 text-sm text-muted-foreground"
        >
          <span className="whitespace-nowrap">Trier par</span>
          <select
            id={sortSelectId}
            value={listing.sort}
            onChange={(e) =>
              handleSortChange(parseProductSortValue(e.target.value))
            }
            className="h-10 min-w-[11rem] rounded-md border border-border bg-white px-3 text-sm text-foreground"
          >
            {PRODUCT_SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {isInitialLoad && <ProductGridSkeleton count={8} />}

      {error && (
        <Card className="p-6 bg-destructive/10 border-destructive/20 mb-8">
          <p className="text-destructive">{error}</p>
        </Card>
      )}

      {!isInitialLoad && !error && products.length > 0 && (
        <div
          className={cn(
            "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8 transition-opacity",
            loading && "opacity-60 pointer-events-none"
          )}
          aria-busy={loading}
        >
          {products.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              priority={index < 4}
            />
          ))}
        </div>
      )}

      {!isInitialLoad && !error && products.length === 0 && (
        <Card className="p-10 text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
            <PawPrint className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground mb-4">
            Aucun produit ne correspond à ces critères dans cette catégorie.
          </p>
          <Button variant="outline" onClick={resetListing}>
            Réinitialiser les filtres
          </Button>
        </Card>
      )}

      {!isInitialLoad && !error && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => replaceListing({ page: Math.max(1, currentPage - 1) })}
            className="bg-white"
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
            disabled={currentPage === pagination.totalPages}
            onClick={() =>
              replaceListing({
                page: Math.min(pagination.totalPages, currentPage + 1),
              })
            }
            className="bg-white"
          >
            Suivant
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
