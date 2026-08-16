"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, TrendingUp, Package, Shield } from "lucide-react";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { productPath } from "@/lib/product-path";
import { categoryPath, HIDDEN_ROOT_CATEGORY_SLUGS, NAV_ROOT_CATEGORIES } from "@/lib/category-path";
import { useProducts } from "@/hooks/useProducts";
import { fetchCategories, type Category } from "@/lib/api";

export function HomePage() {
  const { products, loading, error, loadProducts } = useProducts();
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    // Chat + Chien uniquement — exclut « autre » et les racines masquées (ex. connecté).
    const featuredCategoryIds = NAV_ROOT_CATEGORIES.map((c) => c.slug).join(",");
    void loadProducts(1, 12, { categoryId: featuredCategoryIds });
  }, [loadProducts]);

  useEffect(() => {
    void fetchCategories().then(setCategories);
  }, []);

  const retailers = [
    { name: "Maxi Zoo", description: "Animalerie en ligne", color: "bg-orange-100" },
    { name: "Vivara", description: "Nature & jardin", color: "bg-green-100" },
  ];

  const features = [
    {
      icon: TrendingUp,
      title: "Comparaison de prix",
      description: "Visualisez les offres des marchands partenaires en un coup d'œil"
    },
    {
      icon: Package,
      title: "Catalogue Chat et Chien",
      description: "Parcourez les catégories dédiées, de l'alimentation aux accessoires"
    },
    {
      icon: Shield,
      title: "Fiches transparentes",
      description: "Prix, livraison et lien marchand tels que fournis par les feeds"
    }
  ];

  const featuredProducts = products.slice(0, 3);
  const rootCategories = categories.filter((c) => {
    const slug = c.slug || c.id;
    return (
      typeof slug === "string" &&
      slug.length > 0 &&
      !c.parentId &&
      !HIDDEN_ROOT_CATEGORY_SLUGS.has(slug)
    );
  });
  const childrenOf = (parentSlug: string) =>
    categories.filter((c) => c.parentId === parentSlug);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-primary/20 via-accent/30 to-secondary/20" />
        <div className="container mx-auto px-4 py-20 relative">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge className="bg-primary/20 text-primary border-primary/30">
                ✨ Nouveau sur AmiFidele
              </Badge>
              <h1 className="text-5xl">
                Trouvez les meilleurs produits pour vos animaux
              </h1>
              <p className="text-muted-foreground text-xl">
                Comparez les prix et les caractéristiques de milliers de produits 
                chez les meilleurs revendeurs. Faites le bon choix pour votre compagnon.
              </p>
              <div className="flex gap-4">
                <Button asChild size="lg">
                  <Link href="/produits">
                    Explorer les produits
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1588977827076-b4db84d29151?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMHBldHMlMjB0b2dldGhlcnxlbnwxfHx8fDE3NjIwODU1NTF8MA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Animaux heureux"
                  className="w-full h-[500px]"
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} className="border-none shadow-sm">
                <CardContent className="p-6 text-center">
                  <div className="inline-flex p-4 rounded-full bg-primary/10 mb-4">
                    <feature.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="mb-2">Produits à la une</h2>
              <p className="text-muted-foreground">
                Une sélection Chat et Chien parmi le catalogue AmiFidele
              </p>
            </div>
            <Button asChild variant="outline">
              <Link href="/produits">
                Voir tout
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>
          {loading && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Chargement des produits...</p>
            </div>
          )}
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-6">
              <p className="text-destructive">⚠️ {error}</p>
              <p className="text-muted-foreground text-sm mt-2">
                Impossible de charger les produits depuis l&apos;API. Veuillez vérifier votre connexion et réessayer.
              </p>
            </div>
          )}
          {!loading && (
            <div className="grid md:grid-cols-3 gap-6">
              {featuredProducts.length > 0 ? (
                featuredProducts.map((product) => (
                  <Card key={product.id} className="overflow-hidden group hover:shadow-lg transition-all">
                    <Link href={productPath(product.id)} className="block">
                      <div className="relative overflow-hidden">
                        <ImageWithFallback
                          src={product.image}
                          alt={product.name}
                          className="w-full h-64 bg-white"
                          imageClassName="object-contain group-hover:scale-105 transition-transform duration-300"
                          sizes="(min-width: 768px) 33vw, 100vw"
                        />
                        {product.brand && product.brand !== 'Marque inconnue' && (
                          <Badge className="absolute top-4 left-4 bg-primary">
                            {product.brand}
                          </Badge>
                        )}
                      </div>
                      <CardContent className="p-6">
                        <p className="text-muted-foreground mb-1">{product.category}</p>
                        <h4 className="mb-2">{product.name}</h4>
                        <p className="text-primary mb-4">
                          À partir de {product.price.toFixed(2)}
                          {product.currency === 'EUR' || !product.currency ? '€' : ` ${product.currency}`}
                        </p>
                        <span className="inline-flex w-full items-center justify-center rounded-md border px-4 py-2 text-sm font-medium">
                          Voir la fiche
                        </span>
                      </CardContent>
                    </Link>
                  </Card>
                ))
              ) : (
                <div className="col-span-3 text-center py-12">
                  <p className="text-muted-foreground">Aucun produit à afficher pour le moment</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="mb-10">
            <h2 className="mb-2">Parcourir par catégorie</h2>
            <p className="text-muted-foreground">
              Pages dédiées Chat et Chien — branchées sur le catalogue
            </p>
          </div>
          {rootCategories.length === 0 ? (
            <p className="text-muted-foreground">Catégories en cours de chargement…</p>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {rootCategories.map((root) => {
                const slug = root.slug || root.id || "";
                const kids = childrenOf(slug);
                return (
                  <Card key={slug} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <Link href={categoryPath(slug)} className="block mb-4">
                        <h3 className="text-xl font-semibold hover:text-primary">{root.name}</h3>
                      </Link>
                      {kids.length > 0 && (
                        <ul className="space-y-2">
                          {kids.map((child) => {
                            const childSlug = child.slug || child.id || "";
                            return (
                              <li key={childSlug}>
                                <Link
                                  href={categoryPath(childSlug)}
                                  className="text-sm text-muted-foreground hover:text-primary"
                                >
                                  {child.name}
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                      <Button asChild variant="outline" size="sm" className="mt-6">
                        <Link href={categoryPath(slug)}>
                          Voir {root.name}
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Retailers Section */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="mb-2">🏪 Nos Revendeurs Partenaires</h2>
            <p className="text-muted-foreground">
              Comparez les prix chez les meilleurs marchands en ligne
            </p>
          </div>
          <div className="grid grid-cols-2 gap-6 max-w-md mx-auto">
            {retailers.map((retailer) => (
              <Card 
                key={retailer.name} 
                className="border-2 hover:border-primary hover:shadow-lg transition-all cursor-pointer"
              >
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 rounded-full ${retailer.color} flex items-center justify-center mx-auto mb-3`}>
                    <span className="text-2xl">
                      {retailer.name.charAt(0)}
                    </span>
                  </div>
                  <h4 className="mb-1">{retailer.name}</h4>
                  <p className="text-muted-foreground">{retailer.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-linear-to-br from-primary/20 via-accent/30 to-secondary/20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4">Prêt à trouver le meilleur pour votre animal ?</h2>
          <p className="text-muted-foreground text-xl mb-8 max-w-2xl mx-auto">
            Commencez dès maintenant à comparer des milliers de produits et trouvez 
            les meilleures offres adaptées à votre compagnon.
          </p>
          <Button asChild size="lg">
            <Link href="/produits">
              Commencer la comparaison
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
