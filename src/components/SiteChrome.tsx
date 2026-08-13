import type { ReactNode } from "react";
import Link from "next/link";
import { PawPrint } from "lucide-react";
import { Footer } from "@/components/Footer";

/**
 * En-tête + pied pour les pages hors SPA accueil/comparateur.
 */
export function SiteChrome({
  children,
  current = "other",
}: {
  children: ReactNode;
  current?: "home" | "other";
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
                Trouvez le meilleur pour votre compagnon
              </p>
            </div>
          </Link>
          <nav className="flex items-center gap-3 text-sm">
            <Link
              href="/"
              className={
                current === "home"
                  ? "font-medium text-primary"
                  : "text-muted-foreground hover:text-primary transition-colors"
              }
            >
              Accueil
            </Link>
          </nav>
        </div>
      </header>
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}
