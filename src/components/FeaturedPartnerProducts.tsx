"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { fetchProducts } from "@/lib/api";
import {
  FEATURED_PARTNER_CONFIG,
  FEATURED_PARTNER_DISCLAIMER,
  FEATURED_PARTNER_LABEL,
} from "@/lib/featured-config";
import type { DisplayProduct } from "@/lib/types";
import { mapApiProductsToDisplayProducts } from "@/lib/utils/api-utils";

type FeaturedPartnerProductsProps = {
  /** Identifiant analytics pour les clics affiliés (ex. home, listing). */
  placement?: string;
  className?: string;
};

/**
 * Carrousel « Offres partenaires » — produits Mongo avec lien affilié Awin, isVisible=true.
 */
export function FeaturedPartnerProducts({
  placement = "featured_partners",
  className = "",
}: FeaturedPartnerProductsProps) {
  const [products, setProducts] = useState<DisplayProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    slidesToScroll: 1,
  });
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetchProducts(1, FEATURED_PARTNER_CONFIG.limit * 2, {
          categoryId: FEATURED_PARTNER_CONFIG.categoryId,
          sort: FEATURED_PARTNER_CONFIG.sort,
          order: FEATURED_PARTNER_CONFIG.order,
          merchantId: FEATURED_PARTNER_CONFIG.merchantId,
          isVisible: true,
        });
        if (cancelled) return;
        const withAffiliate = mapApiProductsToDisplayProducts(response.products)
          .filter((p) => Boolean(p.bestAffiliateLink))
          .slice(0, FEATURED_PARTNER_CONFIG.limit);
        setProducts(withAffiliate);
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Erreur de chargement");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.reInit();
  }, [emblaApi, products]);

  useEffect(() => {
    if (!emblaApi) return;
    const update = () => {
      setCanPrev(emblaApi.canScrollPrev());
      setCanNext(emblaApi.canScrollNext());
    };
    update();
    emblaApi.on("select", update);
    emblaApi.on("reInit", update);
    return () => {
      emblaApi.off("select", update);
      emblaApi.off("reInit", update);
    };
  }, [emblaApi, products]);

  if (!loading && !error && products.length === 0) {
    return null;
  }

  return (
    <section
      className={`py-16 ${className}`.trim()}
      aria-labelledby="featured-partners-heading"
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h2 id="featured-partners-heading">{FEATURED_PARTNER_LABEL}</h2>
          <div className="hidden sm:flex gap-2 shrink-0">
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="Produits précédents"
              disabled={!canPrev}
              onClick={() => emblaApi?.scrollPrev()}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="Produits suivants"
              disabled={!canNext}
              onClick={() => emblaApi?.scrollNext()}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {error && (
          <p className="text-sm text-muted-foreground" role="status">
            Offres partenaires indisponibles pour le moment.
          </p>
        )}

        {!error && (
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex touch-pan-y -ml-4 items-stretch">
              {loading &&
                Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={`skeleton-${index}`}
                    className="flex-[0_0_85%] min-w-0 pl-4 sm:flex-[0_0_calc(50%-0.5rem)] lg:flex-[0_0_calc(33.333%-0.75rem)] xl:flex-[0_0_calc(25%-0.75rem)]"
                  >
                    <div
                      className="h-[420px] rounded-xl border bg-card animate-pulse"
                      aria-hidden
                    />
                  </div>
                ))}

              {!loading &&
                products.map((product, index) => (
                  <div
                    key={product.id}
                    className="flex flex-[0_0_85%] min-w-0 pl-4 sm:flex-[0_0_calc(50%-0.5rem)] lg:flex-[0_0_calc(33.333%-0.75rem)] xl:flex-[0_0_calc(25%-0.75rem)]"
                  >
                    <ProductCard
                      product={product}
                      priority={index < 2}
                      analyticsPlacement={placement}
                    />
                  </div>
                ))}
            </div>
          </div>
        )}

        <p className="mt-4 text-xs italic text-muted-foreground max-w-3xl">
          {FEATURED_PARTNER_DISCLAIMER}
        </p>
      </div>
    </section>
  );
}
