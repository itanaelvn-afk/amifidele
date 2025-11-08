"use client";

import { ArrowRight, Star, TrendingUp, Package, Shield } from "lucide-react";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/components/ProductCard";
import { Footer } from "@/components/Footer";

interface HomePageProps {
  onNavigateToComparison: () => void;
  products: Product[];
}

const retailers = [
  { name: "Zooplus", description: "Leader européen", color: "bg-orange-100" },
  { name: "Amazon", description: "Livraison rapide", color: "bg-yellow-100" },
  { name: "Cdiscount", description: "Prix bas", color: "bg-blue-100" },
  { name: "La Ferme des Animaux", description: "Spécialiste", color: "bg-green-100" },
  { name: "Wanimo", description: "Large choix", color: "bg-purple-100" },
  { name: "Animalis", description: "Expert animal", color: "bg-pink-100" },
];

const features = [
  {
    icon: TrendingUp,
    title: "Meilleurs prix",
    description: "Comparez les prix de tous les revendeurs en un coup d'œil"
  },
  {
    icon: Star,
    title: "Avis vérifiés",
    description: "Notes et commentaires authentiques de propriétaires d'animaux"
  },
  {
    icon: Package,
    title: "Large sélection",
    description: "Des milliers de produits pour tous types d'animaux"
  },
  {
    icon: Shield,
    title: "Produits testés",
    description: "Recommandations basées sur la qualité et la sécurité"
  }
];

export function HomePage({ onNavigateToComparison, products }: HomePageProps) {
  const featuredProducts = products.filter(p => p.rating >= 4.7).slice(0, 3);
  const foodProducts = products.filter(p => p.category === "Alimentation");
  const toyProducts = products.filter(p => p.category === "Jouets");
  const accessoryProducts = products.filter(p => p.category === "Accessoires");

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/30 to-secondary/20" />
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
                <Button size="lg" onClick={onNavigateToComparison}>
                  Explorer les produits
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button size="lg" variant="outline">
                  En savoir plus
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1588977827076-b4db84d29151?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMHBldHMlMjB0b2dldGhlcnxlbnwxfHx8fDE3NjIwODU1NTF8MA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Animaux heureux"
                  className="w-full h-[500px] object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
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
              <h2 className="mb-2">⭐ Produits Recommandés</h2>
              <p className="text-muted-foreground">
                Les meilleures notes de nos utilisateurs
              </p>
            </div>
            <Button variant="outline" onClick={onNavigateToComparison}>
              Voir tout
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden group hover:shadow-lg transition-all">
                <div className="relative overflow-hidden">
                  <ImageWithFallback
                    src={product.image}
                    alt={product.name}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <Badge className="absolute top-4 left-4 bg-primary">
                    ⭐ {product.rating}
                  </Badge>
                </div>
                <CardContent className="p-6">
                  <p className="text-muted-foreground mb-1">{product.brand}</p>
                  <h4 className="mb-2">{product.name}</h4>
                  <p className="text-primary mb-4">À partir de {product.price.toFixed(2)}€</p>
                  <Button variant="outline" className="w-full" onClick={onNavigateToComparison}>
                    Comparer les prix
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Category Sections */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="mb-12">
            <h2 className="mb-2">🍖 Alimentation</h2>
            <p className="text-muted-foreground">
              Des croquettes premium aux friandises naturelles
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="relative rounded-2xl overflow-hidden h-80">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1761203429183-9f8235780c42?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2clMjBlYXRpbmclMjBoZWFsdGh5fGVufDF8fHx8MTc2MjA4NTU1Mnww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Alimentation pour chiens"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                <div className="text-white">
                  <h3 className="mb-2 text-white">Pour chiens</h3>
                  <p className="text-white/90 mb-4">
                    Nourriture équilibrée et savoureuse
                  </p>
                  <Button variant="secondary" onClick={onNavigateToComparison}>
                    Découvrir
                  </Button>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              {foodProducts.slice(0, 2).map((product) => (
                <Card key={product.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4 flex gap-4">
                    <ImageWithFallback
                      src={product.image}
                      alt={product.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <p className="text-muted-foreground">{product.brand}</p>
                      <h4 className="mb-1">{product.name}</h4>
                      <p className="text-primary">{product.price.toFixed(2)}€</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12">
            <h2 className="mb-2">🎾 Jouets & Divertissement</h2>
            <p className="text-muted-foreground">
              Pour des heures de jeu et de complicité
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              {toyProducts.slice(0, 2).map((product) => (
                <Card key={product.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4 flex gap-4">
                    <ImageWithFallback
                      src={product.image}
                      alt={product.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <p className="text-muted-foreground">{product.brand}</p>
                      <h4 className="mb-1">{product.name}</h4>
                      <p className="text-primary">{product.price.toFixed(2)}€</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="relative rounded-2xl overflow-hidden h-80">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1723115891740-8adcc7e16436?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXRlJTIwa2l0dGVuJTIwcGxheWluZ3xlbnwxfHx8fDE3NjIwODU1NTJ8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Jouets pour chats"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                <div className="text-white">
                  <h3 className="mb-2 text-white">Pour chats</h3>
                  <p className="text-white/90 mb-4">
                    Stimulation et amusement garantis
                  </p>
                  <Button variant="secondary" onClick={onNavigateToComparison}>
                    Découvrir
                  </Button>
                </div>
              </div>
            </div>
          </div>
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
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
          <div className="text-center mt-8">
            <p className="text-muted-foreground">
              Et bien d'autres revendeurs pour vous offrir les meilleurs prix
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary/20 via-accent/30 to-secondary/20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4">Prêt à trouver le meilleur pour votre animal ?</h2>
          <p className="text-muted-foreground text-xl mb-8 max-w-2xl mx-auto">
            Commencez dès maintenant à comparer des milliers de produits et trouvez 
            les meilleures offres adaptées à votre compagnon.
          </p>
          <Button size="lg" onClick={onNavigateToComparison}>
            Commencer la comparaison
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
