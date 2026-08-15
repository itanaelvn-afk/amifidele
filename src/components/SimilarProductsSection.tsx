import { ProductCard } from "@/components/ProductCard";
import type { DisplayProduct } from "@/lib/types";

interface SimilarProductsSectionProps {
  products: DisplayProduct[];
  title?: string;
  subtitle?: string;
  /** Mode comparaison : permettre d’ajouter à la sélection */
  onToggleSelect?: (id: string) => void;
  selectedIds?: string[];
  className?: string;
}

/**
 * Grille « Produits similaires ». Ne rend rien si la liste est vide.
 */
export function SimilarProductsSection({
  products,
  title = "Produits similaires",
  subtitle,
  onToggleSelect,
  selectedIds = [],
  className = "",
}: SimilarProductsSectionProps) {
  if (products.length === 0) {
    return null;
  }

  return (
    <section className={`mt-12 ${className}`.trim()} aria-labelledby="similar-products-heading">
      <div className="mb-6">
        <h2 id="similar-products-heading" className="text-xl font-semibold mb-1">
          {title}
        </h2>
        {subtitle ? (
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        ) : null}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product, index) => (
          <ProductCard
            key={product.id}
            product={product}
            priority={index < 4}
            isSelected={selectedIds.includes(product.id)}
            onToggleSelect={onToggleSelect}
          />
        ))}
      </div>
    </section>
  );
}
