/** Valeurs de tri listing (UI ↔ query API). */

export type ProductSortValue =
  | "updatedAt-desc"
  | "price-asc"
  | "price-desc"
  | "name-asc"
  | "name-desc";

export const PRODUCT_SORT_OPTIONS: { value: ProductSortValue; label: string }[] = [
  { value: "updatedAt-desc", label: "Plus récents" },
  { value: "price-asc", label: "Prix croissant" },
  { value: "price-desc", label: "Prix décroissant" },
  { value: "name-asc", label: "Nom A → Z" },
  { value: "name-desc", label: "Nom Z → A" },
];

export const DEFAULT_PRODUCT_SORT: ProductSortValue = "updatedAt-desc";

export function parseProductSortValue(
  raw: string | null | undefined
): ProductSortValue {
  const value = (raw || "").trim() as ProductSortValue;
  if (PRODUCT_SORT_OPTIONS.some((o) => o.value === value)) {
    return value;
  }
  return DEFAULT_PRODUCT_SORT;
}

export function sortValueToApiParams(value: ProductSortValue): {
  sort: "price" | "name" | "updatedAt";
  order: "asc" | "desc";
} {
  const [sort, order] = value.split("-") as [
    "price" | "name" | "updatedAt",
    "asc" | "desc",
  ];
  return { sort, order };
}
