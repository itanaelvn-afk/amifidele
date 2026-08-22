import { Badge } from "@/components/ui/badge";

/** En-tête catalogue rendu côté serveur (H1 visible dans le HTML initial). */
export function CatalogHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-accent/20 to-secondary/10 border-b border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl">
          <Badge className="bg-primary/20 text-primary border-primary/30 mb-4">
            🔍 Catalogue Complet
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Trouvez le produit parfait
          </h1>
          <p className="text-muted-foreground text-lg mb-8">
            Explorez notre catalogue complet et comparez les meilleurs produits
            pour vos animaux de compagnie
          </p>
        </div>
      </div>
    </section>
  );
}
