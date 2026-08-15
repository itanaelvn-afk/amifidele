/** Chemins publics des catégories (slugs taxo V1). */

export const RESERVED_PATH_ROOTS = new Set([
  "produits",
  "produit",
  "api",
  "a-propos",
  "contact",
  "cookies",
  "cgu",
  "confidentialite",
  "mentions-legales",
]);

export const NAV_ROOT_CATEGORIES = [
  { slug: "chat", label: "Chat" },
  { slug: "chien", label: "Chien" },
] as const;

/** Racines taxo présentes en API mais masquées en nav / accueil pour l’instant. */
export const HIDDEN_ROOT_CATEGORY_SLUGS = new Set([
  "autre",
  "accessoires-connectes",
]);

export function categoryPath(slug: string): string {
  const clean = slug.replace(/^\/+|\/+$/g, "");
  return `/${clean.split("/").map(encodeURIComponent).join("/")}`;
}

export function slugFromSegments(segments: string[]): string {
  return segments.map((s) => decodeURIComponent(s)).join("/");
}
