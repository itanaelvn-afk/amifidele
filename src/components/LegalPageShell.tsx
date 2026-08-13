import type { ReactNode } from "react";
import Link from "next/link";
import { PawPrint } from "lucide-react";
import { Footer } from "@/components/Footer";

export function LegalPageShell({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-border sticky top-0 z-50 backdrop-blur-md bg-card/95 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="p-3 rounded-full bg-primary/10">
              <PawPrint className="w-8 h-8 text-primary" />
            </div>
            <div>
              <p className="text-xl font-bold leading-tight">AmiFidele</p>
              <p className="text-muted-foreground text-sm hidden sm:block">
                Comparateur pour animaux de compagnie
              </p>
            </div>
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link
              href="/"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Accueil
            </Link>
            <Link
              href="/produits"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Produits
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-10 max-w-3xl">
        <h1 className="text-3xl font-bold mb-2">{title}</h1>
        <p className="text-muted-foreground text-sm mb-8">
          Dernière mise à jour : 7 août 2026 — version V1 (brouillon de démarrage ;
          identité éditeur à compléter avant mise en production).
        </p>
        <div className="legal-prose space-y-6 text-foreground/90 leading-relaxed">
          {children}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-3">
      <h2 className="text-xl font-semibold">{title}</h2>
      <div className="space-y-3 text-muted-foreground">{children}</div>
    </section>
  );
}
