"use client";

import { usePathname } from "next/navigation";
import { ExternalLink, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { DisplayOffer } from "@/lib/types";
import { formatDeliveryLabel } from "@/lib/product-path";
import { trackAffiliateClick } from "@/lib/analytics";

function formatPrice(amount: number, currency?: string): string {
  const suffix = currency && currency !== "EUR" ? ` ${currency}` : "€";
  return `${amount.toFixed(2)}${suffix}`;
}

function sourceLabel(source?: string): string | undefined {
  if (!source) return undefined;
  const normalized = source.toLowerCase();
  if (normalized === "amazon") return "Amazon";
  if (normalized === "awin") return "Partenaire";
  if (normalized === "manual") return "Manuel";
  return source;
}

export function OfferComparisonList({
  offers,
  productId,
  productName,
}: {
  offers: DisplayOffer[];
  productId: string;
  productName?: string;
}) {
  const pathname = usePathname();

  if (!offers.length) return null;

  return (
    <section className="mt-10" aria-labelledby="offers-heading">
      <div className="mb-4">
        <h2 id="offers-heading" className="text-xl font-semibold">
          Comparer les offres
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          {offers.length} offre{offers.length > 1 ? "s" : ""}
          {productName ? ` pour ${productName}` : ""} — triées du moins cher au plus cher.
        </p>
      </div>

      <ul className="divide-y divide-border border border-border rounded-xl overflow-hidden bg-background">
        {offers.map((offer) => {
          const merchant =
            offer.merchantName || sourceLabel(offer.source) || "Marchand";
          const channel = sourceLabel(offer.source);

          return (
            <li
              key={offer.id}
              className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-4 py-4 sm:px-5"
            >
              <div className="min-w-0 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium text-foreground truncate">{merchant}</p>
                  {offer.isBestPrice && (
                    <span className="text-xs font-medium text-primary">
                      Meilleur prix
                    </span>
                  )}
                  {channel && channel !== merchant && (
                    <span className="text-xs text-muted-foreground">{channel}</span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {formatDeliveryLabel(offer.delivery, offer.currency)}
                </p>
                {offer.inStock === false && (
                  <p className="text-xs text-amber-700 font-medium">
                    Indisponible chez ce marchand
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between gap-4 sm:justify-end shrink-0">
                <div className="text-right">
                  {offer.oldPrice != null && offer.oldPrice > offer.price && (
                    <p className="text-xs text-muted-foreground line-through">
                      {formatPrice(offer.oldPrice, offer.currency)}
                    </p>
                  )}
                  <p className="text-lg font-semibold text-primary tabular-nums">
                    {formatPrice(offer.price, offer.currency)}
                  </p>
                </div>

                {offer.affiliateLink ? (
                  <Button asChild size="sm" className="shrink-0">
                    <a
                      href={offer.affiliateLink}
                      target="_blank"
                      rel="nofollow sponsored noopener noreferrer"
                      className="inline-flex items-center gap-1.5"
                      onClick={() =>
                        trackAffiliateClick({
                          productId: offer.id || productId,
                          merchantName: offer.merchantName,
                          pagePath: pathname,
                          placement: "offer_comparison",
                        })
                      }
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Voir
                      <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                    </a>
                  </Button>
                ) : (
                  <span className="text-xs text-muted-foreground">Lien indisponible</span>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
