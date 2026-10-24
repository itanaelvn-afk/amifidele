import Link from "next/link";
import { PawPrint } from "lucide-react";
import { CookieSettingsButton } from "@/components/consent/CookieSettingsButton";
import { Separator } from "@/components/ui/separator";
import { categoryPath, NAV_ROOT_CATEGORIES } from "@/lib/category-path";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-full bg-primary/10">
                <PawPrint className="w-6 h-6 text-primary" />
              </div>
              <h3>AmiFidele</h3>
            </div>
            <p className="text-muted-foreground mb-4 max-w-md">
              Comparateur de produits pour animaux de compagnie. Comparez les
              prix et les offres des marchands partenaires.
            </p>
            <p className="text-sm text-muted-foreground">
              Contact :{" "}
              <Link
                href="/contact"
                className="hover:text-primary transition-colors"
              >
                Formulaire
              </Link>
              {" · "}
              <a
                href="mailto:contact@amifidele.fr"
                className="hover:text-primary transition-colors"
              >
                contact@amifidele.fr
              </a>
            </p>
          </div>

          <div>
            <h4 className="mb-4">Catalogue</h4>
            <ul className="space-y-1">
              <li>
                <Link
                  href="/produits"
                  className="inline-flex items-center min-h-11 py-2 text-muted-foreground hover:text-primary transition-colors"
                >
                  Tous les produits
                </Link>
              </li>
              <li>
                <Link
                  href="/marques"
                  className="inline-flex items-center min-h-11 py-2 text-muted-foreground hover:text-primary transition-colors"
                >
                  Marques
                </Link>
              </li>
              {NAV_ROOT_CATEGORIES.map((item) => (
                <li key={item.slug}>
                  <Link
                    href={categoryPath(item.slug)}
                    className="inline-flex items-center min-h-11 py-2 text-muted-foreground hover:text-primary transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4">Informations</h4>
            <ul className="space-y-1">
              <li>
                <Link
                  href="/a-propos"
                  className="inline-flex items-center min-h-11 py-2 text-muted-foreground hover:text-primary transition-colors"
                >
                  À propos
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="inline-flex items-center min-h-11 py-2 text-muted-foreground hover:text-primary transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/contact?sujet=idee"
                  className="inline-flex items-center min-h-11 py-2 text-muted-foreground hover:text-primary transition-colors"
                >
                  Donner un avis
                </Link>
              </li>
              <li>
                <Link
                  href="/mentions-legales"
                  className="inline-flex items-center min-h-11 py-2 text-muted-foreground hover:text-primary transition-colors"
                >
                  Mentions légales
                </Link>
              </li>
              <li>
                <Link
                  href="/confidentialite"
                  className="inline-flex items-center min-h-11 py-2 text-muted-foreground hover:text-primary transition-colors"
                >
                  Confidentialité
                </Link>
              </li>
              <li>
                <Link
                  href="/cgu"
                  className="inline-flex items-center min-h-11 py-2 text-muted-foreground hover:text-primary transition-colors"
                >
                  CGU
                </Link>
              </li>
              <li>
                <Link
                  href="/cookies"
                  className="inline-flex items-center min-h-11 py-2 text-muted-foreground hover:text-primary transition-colors"
                >
                  Cookies
                </Link>
              </li>
              <li>
                <CookieSettingsButton className="inline-flex items-center min-h-11 py-2 text-muted-foreground hover:text-primary transition-colors text-left" />
              </li>
            </ul>
          </div>
        </div>

        <Separator className="mb-8" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-center md:text-left text-sm">
            © {currentYear} AmiFidele. Tous droits réservés.
          </p>
          <p className="text-muted-foreground text-center md:text-right text-sm max-w-xl">
            V1 : formulaire de contact optionnel, pas de newsletter. Vos choix
            cookies :{" "}
            <CookieSettingsButton className="underline hover:text-primary transition-colors" />
            . Voir la{" "}
            <Link
              href="/confidentialite"
              className="underline hover:text-primary transition-colors"
            >
              politique de confidentialité
            </Link>
            .
          </p>
        </div>
      </div>
    </footer>
  );
}
