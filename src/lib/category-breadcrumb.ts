import { categoryPath } from "@/lib/category-path";

export type CategoryBreadcrumbSegment = {
  /** Slug taxo V1 (ex. chat, chat/litieres, autre) */
  slug: string;
  label: string;
  /** false seulement si on n’a pas de slug navigable */
  linkable: boolean;
};

function titleCaseSlugSegment(segment: string): string {
  if (!segment) return segment;
  if (segment === "autre") return "Autre";
  return segment.charAt(0).toUpperCase() + segment.slice(1);
}

/** Tous les slugs taxo sont cliquables dans le fil d’Ariane (y compris « autre »). */
function isLinkableCategory(slug: string): boolean {
  return Boolean(slug.trim());
}

/**
 * Construit les segments de fil d’Ariane catégorie pour la PDP.
 * Préfère parentId/parentName/name enrichis API ; sinon découpe categoryId.
 */
export function buildCategoryBreadcrumb(input: {
  categoryId?: string | null;
  name?: string | null;
  parentId?: string | null;
  parentName?: string | null;
  slug?: string | null;
}): CategoryBreadcrumbSegment[] {
  const categoryId = (input.categoryId || input.slug || "").trim();
  if (!categoryId) return [];

  const leafLabel =
    (input.name && input.name.trim()) ||
    titleCaseSlugSegment(categoryId.split("/").pop() || categoryId);

  const segments: CategoryBreadcrumbSegment[] = [];

  if (input.parentId) {
    segments.push({
      slug: input.parentId,
      label: (input.parentName && input.parentName.trim()) || titleCaseSlugSegment(input.parentId),
      linkable: isLinkableCategory(input.parentId),
    });
  } else if (categoryId.includes("/")) {
    const root = categoryId.split("/")[0];
    segments.push({
      slug: root,
      label: titleCaseSlugSegment(root),
      linkable: isLinkableCategory(root),
    });
  }

  // Feuille (éviter doublon si catégorie racine seule)
  if (segments.length === 0 || segments[segments.length - 1]?.slug !== categoryId) {
    segments.push({
      slug: categoryId,
      label: leafLabel,
      linkable: isLinkableCategory(categoryId),
    });
  }

  return segments;
}

export function categorySegmentHref(segment: CategoryBreadcrumbSegment): string | null {
  return segment.linkable ? categoryPath(segment.slug) : null;
}
