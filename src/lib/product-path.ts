/** Chemin public d’une fiche produit. */
export function productPath(id: string): string {
  return `/produit/${encodeURIComponent(id)}`;
}

export function stripHtml(value: string): string {
  return value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

export function truncate(value: string, max: number): string {
  if (value.length <= max) return value;
  return `${value.slice(0, max - 1).trimEnd()}…`;
}

const FALLBACK_DELIVERY = "Frais de port selon le marchand";

function formatMoney(amount: number, currency?: string): string {
  const suffix = currency && currency !== "EUR" ? ` ${currency}` : "€";
  return `${amount.toFixed(2)}${suffix}`;
}

/**
 * Affiche un montant de port uniquement s’il est réellement renseigné (> 0).
 * 0 / vide / absent → pas d’invention de « 0 € », mention générique.
 */
export function formatDeliveryLabel(
  delivery?: number | null,
  currency?: string
): string {
  if (typeof delivery === "number" && !Number.isNaN(delivery) && delivery > 0) {
    return `Livraison : ${formatMoney(delivery, currency)}`;
  }
  return FALLBACK_DELIVERY;
}
