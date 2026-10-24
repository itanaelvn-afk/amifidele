import { cache } from "react";
import { loadCatalogFilterOptions } from "@/lib/catalog-filter-options";

/**
 * Options de filtres pour le catalogue (RSC).
 * `cache()` déduplique les appels dans une même requête.
 */
export const getCatalogFilterOptions = cache(loadCatalogFilterOptions);
