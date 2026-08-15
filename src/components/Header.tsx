"use client";

import Link from "next/link";
import { PawPrint, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { NAV_ROOT_CATEGORIES, categoryPath } from "@/lib/category-path";

export type HeaderCurrent = "home" | "produits" | "contact" | "other";

interface HeaderProps {
  current?: HeaderCurrent;
}

export function Header({ current = "other" }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="border-b border-border sticky top-0 z-50 backdrop-blur-md bg-card/95 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-3 hover:opacity-80 transition-opacity group"
          >
            <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <PawPrint className="w-8 h-8 text-primary" />
            </div>
            <div className="hidden sm:block">
              <p className="text-xl font-bold">AmiFidele</p>
              <p className="text-muted-foreground text-sm">
                Trouvez le meilleur pour votre compagnon
              </p>
            </div>
            <div className="sm:hidden">
              <p className="text-lg font-bold">AmiFidele</p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-4">
            <Button asChild variant={current === "home" ? "default" : "ghost"}>
              <Link href="/">Accueil</Link>
            </Button>
            <Button asChild variant={current === "produits" ? "default" : "ghost"}>
              <Link href="/produits">Produits</Link>
            </Button>
            {NAV_ROOT_CATEGORIES.map((item) => (
              <Button key={item.slug} asChild variant="ghost">
                <Link href={categoryPath(item.slug)}>{item.label}</Link>
              </Button>
            ))}
            <Button asChild variant={current === "contact" ? "default" : "ghost"}>
              <Link href="/contact">Contact</Link>
            </Button>
          </nav>

          <button
            className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-border">
            <nav className="flex flex-col gap-2">
              <Button
                asChild
                variant={current === "home" ? "default" : "ghost"}
                className="w-full justify-start"
              >
                <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                  Accueil
                </Link>
              </Button>
              <Button
                asChild
                variant={current === "produits" ? "default" : "ghost"}
                className="w-full justify-start"
              >
                <Link href="/produits" onClick={() => setMobileMenuOpen(false)}>
                  Produits
                </Link>
              </Button>
              {NAV_ROOT_CATEGORIES.map((item) => (
                <Button
                  key={item.slug}
                  asChild
                  variant="ghost"
                  className="w-full justify-start"
                >
                  <Link
                    href={categoryPath(item.slug)}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                </Button>
              ))}
              <Button
                asChild
                variant={current === "contact" ? "default" : "ghost"}
                className="w-full justify-start"
              >
                <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>
                  Contact
                </Link>
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
