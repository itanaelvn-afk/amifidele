"use client";

import Link from "next/link";
import { SiFacebook, SiInstagram, SiX, SiYoutube } from "@icons-pack/react-simple-icons";
import { PawPrint, Mail, Phone, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border mt-auto">
      {/* Newsletter Section */}
      <div className="bg-linear-to-br from-primary/10 via-accent/20 to-secondary/10 border-b border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="mb-2">📧 Restez informé</h3>
            <p className="text-muted-foreground mb-6">
              Recevez nos meilleures offres et conseils pour le bien-être de vos animaux
            </p>
            <div className="flex gap-2 max-w-md mx-auto">
              <Input 
                type="email" 
                placeholder="Votre adresse email"
                className="bg-background"
              />
              <Button>S&apos;inscrire</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-full bg-primary/10">
                <PawPrint className="w-6 h-6 text-primary" />
              </div>
              <h3>AmiFidele</h3>
            </div>
            <p className="text-muted-foreground mb-4">
              Votre comparateur pour trouver les produits pour vos animaux de
              compagnie. Comparez les prix et faites le meilleur choix.
            </p>
            <div className="flex gap-3">
              <a 
                href="#" 
                className="p-2 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
                aria-label="Facebook"
              >
                <SiFacebook className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="p-2 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
                aria-label="Twitter"
              >
                <SiX className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="p-2 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
                aria-label="Instagram"
              >
                <SiInstagram className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="p-2 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
                aria-label="YouTube"
              >
                <SiYoutube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* À propos Column */}
          <div>
            <h4 className="mb-4">À propos</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Qui sommes-nous
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Notre équipe
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Comment ça marche
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Devenir partenaire
                </a>
              </li>
            </ul>
          </div>

          {/* Aide & Support Column */}
          <div>
            <h4 className="mb-4">Aide & Support</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Nous contacter
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Guide d&apos;utilisation
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Signaler un problème
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Accessibilité
                </a>
              </li>
            </ul>
          </div>

          {/* Catégories Column */}
          <div>
            <h4 className="mb-4">Catégories</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Alimentation
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Jouets
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Accessoires
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Repos & Confort
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Soins & Hygiène
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-muted/50 rounded-lg p-6 mb-8">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-full bg-primary/10">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-muted-foreground">Email</p>
                <a href="mailto:contact@AmiFidele.fr" className="hover:text-primary transition-colors">
                  contact@AmiFidele.fr
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-full bg-primary/10">
                <Phone className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-muted-foreground">Téléphone</p>
                <a href="tel:+33123456789" className="hover:text-primary transition-colors">
                  +33 1 23 45 67 89
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-full bg-primary/10">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-muted-foreground">Adresse</p>
                <p>Paris, France</p>
              </div>
            </div>
          </div>
        </div>

        <Separator className="mb-8" />

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-center md:text-left">
            © {currentYear} AmiFidele. Tous droits réservés.
          </p>
          <div className="flex flex-wrap gap-6 justify-center">
            <Link
              href="/mentions-legales"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Mentions légales
            </Link>
            <Link
              href="/confidentialite"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Politique de confidentialité
            </Link>
            <Link
              href="/cgu"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Conditions d&apos;utilisation
            </Link>
            <Link
              href="/cookies"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Gestion des cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
