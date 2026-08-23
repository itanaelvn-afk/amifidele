import { NAV_ROOT_CATEGORIES } from "@/lib/category-path";

/**
 * Décision US « Emplacements produits mis en avant » :
 * carrousel maison alimenté par l'API produits (Mongo / feed Awin déjà en base),
 * pas de widget iframe Awin — cohérent avec isVisible et le modèle canonique.
 *
 * Configurable via NEXT_PUBLIC_FEATURED_MERCHANT_ID (optionnel) pour cibler un marchand.
 */
export const FEATURED_PARTNER_CONFIG = {
  /** Nombre cible de produits affichés (4–8 selon la US). */
  limit: 6,
  /** Slugs racines taxo (Chat + Chien). */
  categoryId: NAV_ROOT_CATEGORIES.map((c) => c.slug).join(","),
  sort: "updatedAt" as const,
  order: "desc" as const,
  merchantId: process.env.NEXT_PUBLIC_FEATURED_MERCHANT_ID?.trim() || undefined,
};

export const FEATURED_PARTNER_LABEL = "Offres partenaires";

export const FEATURED_PARTNER_DISCLAIMER =
  "Sélection d'offres affiliées Awin — liens vers les marchands partenaires. " +
  "AmiFidele peut percevoir une commission sans surcoût pour vous. " +
  "Ce n'est pas un classement éditorial.";
