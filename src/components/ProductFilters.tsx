"use client";

import { useState, useEffect } from "react";
import { X, Filter, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { fetchAdvertisers, fetchCategories, ProductFilters, Advertiser, Category } from "@/lib/api";

interface ProductFiltersProps {
  filters: ProductFilters;
  onFiltersChange: (filters: ProductFilters) => void;
}

export function ProductFiltersComponent({ filters, onFiltersChange }: ProductFiltersProps) {
  const [merchants, setMerchants] = useState<Advertiser[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFilterOptions() {
      try {
        setLoading(true);
        const [merchantsData, categoriesData] = await Promise.all([
          fetchAdvertisers(),
          fetchCategories(),
        ]);
        setMerchants(merchantsData);
        setCategories(categoriesData);
      } catch (err) {
        console.error("Erreur lors du chargement des options de filtres:", err);
      } finally {
        setLoading(false);
      }
    }
    loadFilterOptions();
  }, []);

  const handleFilterChange = (key: keyof ProductFilters, value: string | number | boolean | undefined) => {
    // Normaliser les valeurs vides
    let normalizedValue: string | number | boolean | undefined = value;
    if (value === "" || value === null) {
      normalizedValue = undefined;
    }
    
    const newFilters = { ...filters, [key]: normalizedValue };
    
    // Réinitialiser les filtres liés
    if (key === "categoryName" && normalizedValue) {
      newFilters.categoryId = undefined;
    } else if (key === "categoryId" && normalizedValue) {
      newFilters.categoryName = undefined;
    }
    
    onFiltersChange(newFilters);
  };

  const handleReset = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = (() => {
    // Vérifier chaque type de filtre individuellement
    if (filters.categoryName || filters.categoryId) return true;
    if (filters.merchantId) return true;
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) return true;
    if (filters.search) return true;
    return false;
  })();

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

  return (
    <Card className="p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-muted-foreground" />
          <h3 className="text-lg font-semibold">Filtres</h3>
          {hasActiveFilters && (
            <Badge variant="default" className="ml-2">
              {Object.values(filters).filter(v => v !== undefined && v !== "" && v !== false).length}
            </Badge>
          )}
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Réinitialiser
          </Button>
        )}
      </div>

      {/* Filtres actifs */}
      {hasActiveFilters && (
        <div className="mb-4 pb-4 border-b border-border">
          <p className="text-sm font-medium text-muted-foreground mb-2">Filtres actifs :</p>
          <div className="flex flex-wrap gap-2">
            {filters.categoryName && (
              <Badge variant="default" className="gap-2">
                Catégorie: {filters.categoryName}
                <button
                  onClick={() => handleFilterChange("categoryName", undefined)}
                  className="ml-1 hover:bg-primary/20 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            {filters.categoryId && (
              <Badge variant="default" className="gap-2">
                Catégorie:{" "}
                {categoryDisplayLabel(
                  categories.find((c) => c.id?.toString() === filters.categoryId),
                  filters.categoryId
                )}
                <button
                  onClick={() => handleFilterChange("categoryId", undefined)}
                  className="ml-1 hover:bg-primary/20 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            {filters.merchantId && (
              <Badge variant="default" className="gap-2">
                Marchand: {merchants.find(m => m.merchantId.toString() === filters.merchantId)?.merchantName || filters.merchantId}
                <button
                  onClick={() => handleFilterChange("merchantId", undefined)}
                  className="ml-1 hover:bg-primary/20 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            {(() => {
              // Vérifier si un filtre de prix est actif
              const hasPriceFilter = filters.minPrice !== undefined || filters.maxPrice !== undefined;
              if (!hasPriceFilter) return null;
              
              // Déterminer le libellé de la plage de prix
              let priceLabel = "";
              const minPrice = filters.minPrice !== undefined ? Number(filters.minPrice) : undefined;
              const maxPrice = filters.maxPrice !== undefined ? Number(filters.maxPrice) : undefined;
              
              // Vérifier les plages prédéfinies (comparaison stricte)
              if (minPrice === 0 && maxPrice === 10) {
                priceLabel = "0€ - 10€";
              } else if (minPrice === 10 && maxPrice === 25) {
                priceLabel = "10€ - 25€";
              } else if (minPrice === 25 && maxPrice === 50) {
                priceLabel = "25€ - 50€";
              } else if (minPrice === 50 && maxPrice === 100) {
                priceLabel = "50€ - 100€";
              } else if (minPrice === 100 && maxPrice === 200) {
                priceLabel = "100€ - 200€";
              } else if (minPrice === 200 && maxPrice === undefined) {
                priceLabel = "200€ et plus";
              } else if (minPrice !== undefined && maxPrice !== undefined) {
                // Afficher la plage si les deux valeurs sont définies
                priceLabel = `${minPrice}€ - ${maxPrice}€`;
              } else if (minPrice !== undefined) {
                // Seulement minPrice défini (cas "et plus")
                priceLabel = `${minPrice}€ et plus`;
              }
              
              return priceLabel ? (
                <Badge variant="default" className="gap-2">
                  Prix: {priceLabel}
                  <button
                    onClick={() => {
                      const newFilters = { ...filters };
                      newFilters.minPrice = undefined;
                      newFilters.maxPrice = undefined;
                      onFiltersChange(newFilters);
                    }}
                    className="ml-1 hover:bg-primary/20 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ) : null;
            })()}
            {filters.search && (
              <Badge variant="default" className="gap-2">
                Recherche: {filters.search}
                <button
                  onClick={() => handleFilterChange("search", undefined)}
                  className="ml-1 hover:bg-primary/20 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Filtres principaux */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium mb-2">Catégorie</label>
          {loading ? (
            <div className="w-full border rounded-md p-2 text-sm text-muted-foreground">
              Chargement...
            </div>
          ) : (
            <select
              value={filters.categoryId ? `id:${filters.categoryId}` : filters.categoryName || ""}
              onChange={(e) => {
                const value = e.target.value;
                if (value.startsWith("id:")) {
                  handleFilterChange("categoryId", value.replace("id:", ""));
                } else {
                  handleFilterChange("categoryName", value);
                }
              }}
              className="w-full border rounded-md p-2 text-sm bg-background"
            >
              <option value="">Toutes les catégories</option>
              {rootCategories.map((root) => {
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
              {/* Orphelins éventuels (sans parent connu) */}
              {categories
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
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Marchand</label>
          {loading ? (
            <div className="w-full border rounded-md p-2 text-sm text-muted-foreground">
              Chargement...
            </div>
          ) : (
            <select
              value={filters.merchantId || ""}
              onChange={(e) => handleFilterChange("merchantId", e.target.value)}
              className="w-full border rounded-md p-2 text-sm bg-background"
            >
              <option value="">Tous les marchands</option>
              {merchants.map((merchant) => (
                <option key={merchant.merchantId} value={merchant.merchantId.toString()}>
                  {merchant.merchantName}
                </option>
              ))}
            </select>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Prix</label>
          <select
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
                handleFilterChange("minPrice", undefined);
                handleFilterChange("maxPrice", undefined);
              } else if (value.endsWith("+")) {
                const min = parseFloat(value.replace("+", ""));
                handleFilterChange("minPrice", min);
                handleFilterChange("maxPrice", undefined);
              } else {
                const parts = value.split("-");
                if (parts.length === 2) {
                  const min = parseFloat(parts[0]);
                  const max = parseFloat(parts[1]);
                  if (!isNaN(min) && !isNaN(max) && min >= 0 && max > 0) {
                    // Appeler handleFilterChange deux fois pour mettre à jour les deux valeurs
                    const currentFilters = { ...filters };
                    currentFilters.minPrice = min;
                    currentFilters.maxPrice = max;
                    onFiltersChange(currentFilters);
                  }
                }
              }
            }}
            className="w-full border rounded-md p-2 text-sm bg-background"
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
    </Card>
  );
}

