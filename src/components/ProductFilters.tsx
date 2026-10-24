"use client";

import { useState, useEffect, useId, type ReactNode } from "react";
import { X, Filter, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ProductFilters,
  Advertiser,
  Category,
} from "@/lib/api";
import {
  type CatalogFilterOptions,
  hasUsableFilterOptions,
  loadCatalogFilterOptions,
  readClientFilterOptionsCache,
  writeClientFilterOptionsCache,
} from "@/lib/catalog-filter-options";

interface ProductFiltersProps {
  filters: ProductFilters;
  onFiltersChange: (filters: ProductFilters) => void;
  /** Options préchargées (RSC) — évite 3 fetch client au montage. */
  initialOptions?: CatalogFilterOptions | null;
  /**
   * Catégorie imposée par la route (ex. `/chien/nourriture`).
   * Masque le select catégorie ; le parent doit forcément renvoyer ce `categoryId`.
   */
  lockedCategoryId?: string;
}

function resolveInitialOptions(
  initialOptions?: CatalogFilterOptions | null
): CatalogFilterOptions | null {
  if (hasUsableFilterOptions(initialOptions)) return initialOptions!;
  return readClientFilterOptionsCache();
}

function countActiveFilters(
  filters: ProductFilters,
  lockedCategoryId?: string
): number {
  let n = 0;
  if (!lockedCategoryId && (filters.categoryName || filters.categoryId)) n += 1;
  if (filters.brandId || filters.brandName) n += 1;
  if (filters.merchantId) n += 1;
  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) n += 1;
  if (filters.search) n += 1;
  return n;
}

export function ProductFiltersComponent({
  filters,
  onFiltersChange,
  initialOptions = null,
  lockedCategoryId,
}: ProductFiltersProps) {
  const ids = useId();
  const [mobileOpen, setMobileOpen] = useState(false);

  const seeded = resolveInitialOptions(initialOptions);
  const hasSeed = hasUsableFilterOptions(seeded);
  const [merchants, setMerchants] = useState<Advertiser[]>(seeded?.merchants ?? []);
  const [brands, setBrands] = useState<CatalogFilterOptions["brands"]>(
    seeded?.brands ?? []
  );
  const [categories, setCategories] = useState<Category[]>(seeded?.categories ?? []);
  const [loading, setLoading] = useState(!hasSeed);

  useEffect(() => {
    if (hasUsableFilterOptions(initialOptions)) {
      writeClientFilterOptionsCache(initialOptions!);
    }
  }, [initialOptions]);

  useEffect(() => {
    if (hasSeed) return;

    let cancelled = false;
    async function loadFilterOptionsFallback() {
      try {
        const next = await loadCatalogFilterOptions();
        if (cancelled) return;
        writeClientFilterOptionsCache(next);
        setMerchants(next.merchants);
        setCategories(next.categories);
        setBrands(next.brands);
      } catch (err) {
        console.error("Erreur lors du chargement des options de filtres:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void loadFilterOptionsFallback();
    return () => {
      cancelled = true;
    };
  }, [hasSeed]);

  const emitFilters = (next: ProductFilters) => {
    if (lockedCategoryId) {
      onFiltersChange({
        ...next,
        categoryId: lockedCategoryId,
        categoryName: undefined,
      });
      return;
    }
    onFiltersChange(next);
  };

  const handleFilterChange = (key: keyof ProductFilters, value: string | number | boolean | undefined) => {
    let normalizedValue: string | number | boolean | undefined = value;
    if (value === "" || value === null) {
      normalizedValue = undefined;
    }

    const newFilters = { ...filters, [key]: normalizedValue };

    if (key === "categoryName" && normalizedValue) {
      newFilters.categoryId = undefined;
    } else if (key === "categoryId" && normalizedValue) {
      newFilters.categoryName = undefined;
    }

    emitFilters(newFilters);
  };

  const applyPriceRange = (minPrice?: number, maxPrice?: number) => {
    const next = { ...filters };
    if (minPrice === undefined) delete next.minPrice;
    else next.minPrice = minPrice;
    if (maxPrice === undefined) delete next.maxPrice;
    else next.maxPrice = maxPrice;
    emitFilters(next);
  };

  const applyBrand = (brandId?: string, brandName?: string) => {
    const next = { ...filters };
    if (!brandId) {
      delete next.brandId;
      delete next.brandName;
    } else {
      next.brandId = brandId;
      if (brandName) next.brandName = brandName;
      else delete next.brandName;
    }
    emitFilters(next);
  };

  const handleReset = () => {
    emitFilters(lockedCategoryId ? { categoryId: lockedCategoryId } : {});
  };

  const activeFilterCount = countActiveFilters(filters, lockedCategoryId);
  const hasActiveFilters = activeFilterCount > 0;
  const showCategoryField = !lockedCategoryId;

  const rootCategories = categories
    .filter((c) => !c.parentId)
    .sort((a, b) => a.name.localeCompare(b.name, "fr"));
  const childrenByParent = new Map<string, Category[]>();
  for (const cat of categories) {
    if (!cat.parentId) continue;
    const key = String(cat.parentId);
    const list = childrenByParent.get(key) || [];
    list.push(cat);
    childrenByParent.set(key, list);
  }
  for (const list of childrenByParent.values()) {
    list.sort((a, b) => a.name.localeCompare(b.name, "fr"));
  }

  const categoryDisplayLabel = (cat: Category | undefined, fallback: string) =>
    cat?.label || cat?.name || fallback;

  const brandOptions = brands;
  const selectedBrandLabel =
    filters.brandName ||
    brandOptions.find((b) => b.id === filters.brandId)?.name ||
    filters.brandId;

  const selectClassName =
    "w-full border rounded-md p-2 text-sm bg-white disabled:opacity-60 min-h-11";

  const renderActiveChips = (): ReactNode => {
    if (!hasActiveFilters) return null;

    let priceLabel = "";
    const minPrice = filters.minPrice !== undefined ? Number(filters.minPrice) : undefined;
    const maxPrice = filters.maxPrice !== undefined ? Number(filters.maxPrice) : undefined;
    if (minPrice === 0 && maxPrice === 10) priceLabel = "0€ - 10€";
    else if (minPrice === 10 && maxPrice === 25) priceLabel = "10€ - 25€";
    else if (minPrice === 25 && maxPrice === 50) priceLabel = "25€ - 50€";
    else if (minPrice === 50 && maxPrice === 100) priceLabel = "50€ - 100€";
    else if (minPrice === 100 && maxPrice === 200) priceLabel = "100€ - 200€";
    else if (minPrice === 200 && maxPrice === undefined) priceLabel = "200€ et plus";
    else if (minPrice !== undefined && maxPrice !== undefined) {
      priceLabel = `${minPrice}€ - ${maxPrice}€`;
    } else if (minPrice !== undefined) {
      priceLabel = `${minPrice}€ et plus`;
    }

    return (
      <div className="flex flex-wrap gap-2">
        {showCategoryField && filters.categoryName && (
          <Badge variant="default" className="gap-2">
            Catégorie: {filters.categoryName}
            <button
              type="button"
              onClick={() => handleFilterChange("categoryName", undefined)}
              className="ml-1 hover:bg-primary/20 rounded-full p-0.5"
              aria-label="Retirer le filtre catégorie"
            >
              <X className="w-3 h-3" />
            </button>
          </Badge>
        )}
        {showCategoryField && filters.categoryId && (
          <Badge variant="default" className="gap-2">
            Catégorie:{" "}
            {categoryDisplayLabel(
              categories.find((c) => c.id?.toString() === filters.categoryId),
              filters.categoryId
            )}
            <button
              type="button"
              onClick={() => handleFilterChange("categoryId", undefined)}
              className="ml-1 hover:bg-primary/20 rounded-full p-0.5"
              aria-label="Retirer le filtre catégorie"
            >
              <X className="w-3 h-3" />
            </button>
          </Badge>
        )}
        {filters.merchantId && (
          <Badge variant="default" className="gap-2">
            Marchand:{" "}
            {merchants.find((m) => m.merchantId.toString() === filters.merchantId)
              ?.merchantName || filters.merchantId}
            <button
              type="button"
              onClick={() => handleFilterChange("merchantId", undefined)}
              className="ml-1 hover:bg-primary/20 rounded-full p-0.5"
              aria-label="Retirer le filtre marchand"
            >
              <X className="w-3 h-3" />
            </button>
          </Badge>
        )}
        {(filters.brandId || filters.brandName) && (
          <Badge variant="default" className="gap-2">
            Marque: {selectedBrandLabel}
            <button
              type="button"
              onClick={() => applyBrand(undefined)}
              className="ml-1 hover:bg-primary/20 rounded-full p-0.5"
              aria-label="Retirer le filtre marque"
            >
              <X className="w-3 h-3" />
            </button>
          </Badge>
        )}
        {priceLabel ? (
          <Badge variant="default" className="gap-2">
            Prix: {priceLabel}
            <button
              type="button"
              onClick={() => applyPriceRange(undefined, undefined)}
              className="ml-1 hover:bg-primary/20 rounded-full p-0.5"
              aria-label="Retirer le filtre prix"
            >
              <X className="w-3 h-3" />
            </button>
          </Badge>
        ) : null}
        {filters.search && (
          <Badge variant="default" className="gap-2">
            Recherche: {filters.search}
            <button
              type="button"
              onClick={() => handleFilterChange("search", undefined)}
              className="ml-1 hover:bg-primary/20 rounded-full p-0.5"
              aria-label="Retirer la recherche"
            >
              <X className="w-3 h-3" />
            </button>
          </Badge>
        )}
      </div>
    );
  };

  const renderFilterFields = (prefix: string): ReactNode => {
    const categoryFieldId = `${ids}-${prefix}-category`;
    const brandFieldId = `${ids}-${prefix}-brand`;
    const merchantFieldId = `${ids}-${prefix}-merchant`;
    const priceFieldId = `${ids}-${prefix}-price`;

    return (
      <div
        className={
          showCategoryField
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
            : "grid grid-cols-1 sm:grid-cols-3 gap-4"
        }
      >
        {showCategoryField && (
        <div>
          <label htmlFor={categoryFieldId} className="block text-sm font-medium mb-2">
            Catégorie
          </label>
          <select
            id={categoryFieldId}
            disabled={loading}
            value={filters.categoryId ? `id:${filters.categoryId}` : filters.categoryName || ""}
            onChange={(e) => {
              const value = e.target.value;
              if (value.startsWith("id:")) {
                handleFilterChange("categoryId", value.replace("id:", ""));
              } else {
                handleFilterChange("categoryName", value);
              }
            }}
            className={selectClassName}
          >
            <option value="">{loading ? "Chargement…" : "Toutes les catégories"}</option>
            {!loading &&
              rootCategories.map((root) => {
                const children = childrenByParent.get(String(root.id)) || [];
                if (children.length === 0) {
                  return (
                    <option
                      key={root.id ? `id:${root.id}` : root.name}
                      value={root.id ? `id:${root.id}` : root.name}
                    >
                      {root.name}
                    </option>
                  );
                }
                return (
                  <optgroup key={root.id} label={root.name}>
                    <option value={root.id ? `id:${root.id}` : root.name}>
                      Tout {root.name.toLowerCase()}
                    </option>
                    {children.map((cat) => (
                      <option
                        key={cat.id ? `id:${cat.id}` : cat.name}
                        value={cat.id ? `id:${cat.id}` : cat.name}
                      >
                        {cat.name}
                      </option>
                    ))}
                  </optgroup>
                );
              })}
            {!loading &&
              categories
                .filter(
                  (c) =>
                    c.parentId &&
                    !rootCategories.some((r) => r.id === c.parentId)
                )
                .map((cat) => (
                  <option
                    key={cat.id ? `id:${cat.id}` : cat.name}
                    value={cat.id ? `id:${cat.id}` : cat.name}
                  >
                    {cat.label || cat.name}
                  </option>
                ))}
          </select>
        </div>
        )}

        <div>
          <label htmlFor={brandFieldId} className="block text-sm font-medium mb-2">
            Marque
          </label>
          <select
            id={brandFieldId}
            disabled={loading}
            value={filters.brandId || ""}
            onChange={(e) => {
              const id = e.target.value;
              if (!id) {
                applyBrand(undefined);
                return;
              }
              const match = brandOptions.find((b) => b.id === id);
              applyBrand(id, match?.name);
            }}
            className={selectClassName}
          >
            <option value="">
              {loading
                ? "Chargement…"
                : brandOptions.length === 0
                  ? "Aucune marque"
                  : "Toutes les marques"}
            </option>
            {filters.brandId &&
              !brandOptions.some((b) => b.id === filters.brandId) && (
                <option value={filters.brandId}>{selectedBrandLabel}</option>
              )}
            {!loading &&
              brandOptions.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
          </select>
        </div>

        <div>
          <label htmlFor={merchantFieldId} className="block text-sm font-medium mb-2">
            Marchand
          </label>
          <select
            id={merchantFieldId}
            disabled={loading}
            value={filters.merchantId || ""}
            onChange={(e) => handleFilterChange("merchantId", e.target.value)}
            className={selectClassName}
          >
            <option value="">{loading ? "Chargement…" : "Tous les marchands"}</option>
            {!loading &&
              merchants.map((merchant) => (
                <option key={merchant.merchantId} value={merchant.merchantId.toString()}>
                  {merchant.merchantName}
                </option>
              ))}
          </select>
        </div>

        <div>
          <label htmlFor={priceFieldId} className="block text-sm font-medium mb-2">
            Prix
          </label>
          <select
            id={priceFieldId}
            value={
              filters.minPrice !== undefined && filters.maxPrice !== undefined
                ? `${filters.minPrice}-${filters.maxPrice}`
                : filters.minPrice !== undefined && filters.maxPrice === undefined
                  ? `${filters.minPrice}+`
                  : ""
            }
            onChange={(e) => {
              const value = e.target.value;
              if (value === "") {
                applyPriceRange(undefined, undefined);
                return;
              }
              if (value.endsWith("+")) {
                const min = parseFloat(value.replace("+", ""));
                if (!Number.isNaN(min)) applyPriceRange(min, undefined);
                return;
              }
              const parts = value.split("-");
              if (parts.length === 2) {
                const min = parseFloat(parts[0]);
                const max = parseFloat(parts[1]);
                if (!Number.isNaN(min) && !Number.isNaN(max) && min >= 0 && max > min) {
                  applyPriceRange(min, max);
                }
              }
            }}
            className={selectClassName}
          >
            <option value="">Tous les prix</option>
            <option value="0-10">0€ - 10€</option>
            <option value="10-25">10€ - 25€</option>
            <option value="25-50">25€ - 50€</option>
            <option value="50-100">50€ - 100€</option>
            <option value="100-200">100€ - 200€</option>
            <option value="200+">200€ et plus</option>
          </select>
        </div>
      </div>
    );
  };

  const filtersButtonLabel =
    activeFilterCount > 0 ? `Filtres (${activeFilterCount})` : "Filtres";

  return (
    <>
      {/* Mobile : bouton + chips, panneau en tiroir */}
      <div className="md:hidden mb-6 space-y-3">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            className="gap-2 min-h-11 flex-1 justify-center bg-white"
            onClick={() => setMobileOpen(true)}
            aria-haspopup="dialog"
            aria-expanded={mobileOpen}
          >
            <Filter className="w-4 h-4" />
            {filtersButtonLabel}
          </Button>
          {hasActiveFilters && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="gap-2 min-h-11 shrink-0"
              aria-label="Réinitialiser les filtres"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="sr-only sm:not-sr-only">Réinit.</span>
            </Button>
          )}
        </div>
        {hasActiveFilters && (
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">Filtres actifs</p>
            {renderActiveChips()}
          </div>
        )}
      </div>

      <Dialog open={mobileOpen} onOpenChange={setMobileOpen}>
        <DialogContent
          className="fixed inset-x-0 bottom-0 top-auto left-0 right-0 z-50 flex max-h-[85vh] w-full max-w-none translate-x-0 translate-y-0 flex-col gap-0 rounded-t-2xl rounded-b-none border p-0 shadow-lg duration-200 data-[state=open]:slide-in-from-bottom-4 data-[state=closed]:slide-out-to-bottom-4 data-[state=open]:zoom-in-100 data-[state=closed]:zoom-out-100 sm:max-w-none"
        >
          <DialogHeader className="border-b border-border px-4 py-4 pr-12 text-left">
            <DialogTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-muted-foreground" />
              Filtres
              {hasActiveFilters && (
                <Badge variant="default">{activeFilterCount}</Badge>
              )}
            </DialogTitle>
            <DialogDescription className="sr-only">
              Affiner le catalogue par catégorie, marque, marchand et prix.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
            {hasActiveFilters && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  Filtres actifs
                </p>
                {renderActiveChips()}
              </div>
            )}
            {renderFilterFields("mobile")}
          </div>

          <DialogFooter className="border-t border-border px-4 py-3 gap-2 sm:flex-row">
            {hasActiveFilters && (
              <Button
                type="button"
                variant="ghost"
                onClick={handleReset}
                className="gap-2 min-h-11"
              >
                <RotateCcw className="w-4 h-4" />
                Réinitialiser
              </Button>
            )}
            <Button
              type="button"
              className="min-h-11 flex-1"
              onClick={() => setMobileOpen(false)}
            >
              Voir les résultats
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Desktop : panneau inline */}
      <Card className="hidden md:block p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-muted-foreground" />
            <span className="text-lg font-semibold">Filtres</span>
            {hasActiveFilters && (
              <Badge variant="default" className="ml-2">
                {activeFilterCount}
              </Badge>
            )}
          </div>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={handleReset} className="gap-2">
              <RotateCcw className="w-4 h-4" />
              Réinitialiser
            </Button>
          )}
        </div>

        {hasActiveFilters && (
          <div className="mb-4 pb-4 border-b border-border">
            <p className="text-sm font-medium text-muted-foreground mb-2">
              Filtres actifs :
            </p>
            {renderActiveChips()}
          </div>
        )}

        {renderFilterFields("desktop")}
      </Card>
    </>
  );
}
