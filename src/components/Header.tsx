"use client";

import { PawPrint, Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface HeaderProps {
  onNavigateToComparison?: () => void;
  onNavigateToHome?: () => void;
  currentPage: "home" | "comparison";
}

export function Header({ onNavigateToComparison, onNavigateToHome, currentPage }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="border-b border-border sticky top-0 z-50 backdrop-blur-md bg-card/95 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <button 
            onClick={onNavigateToHome}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity group"
          >
            <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <PawPrint className="w-8 h-8 text-primary" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold">AmiFidele</h1>
              <p className="text-muted-foreground text-sm">Trouvez le meilleur pour votre compagnon</p>
            </div>
            <div className="sm:hidden">
              <h1 className="text-lg font-bold">AmiFidele</h1>
            </div>
          </button>

          <nav className="hidden md:flex items-center gap-4">
            <Button 
              variant={currentPage === "home" ? "default" : "ghost"}
              onClick={onNavigateToHome}
              className="transition-all"
            >
              Accueil
            </Button>
            <Button 
              variant={currentPage === "comparison" ? "default" : "ghost"}
              onClick={onNavigateToComparison}
              className="transition-all"
            >
              Comparer
            </Button>
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-border">
            <nav className="flex flex-col gap-2">
              <Button 
                variant={currentPage === "home" ? "default" : "ghost"}
                onClick={() => {
                  onNavigateToHome?.();
                  setMobileMenuOpen(false);
                }}
                className="w-full justify-start"
              >
                Accueil
              </Button>
              <Button 
                variant={currentPage === "comparison" ? "default" : "ghost"}
                onClick={() => {
                  onNavigateToComparison?.();
                  setMobileMenuOpen(false);
                }}
                className="w-full justify-start"
              >
                Comparer
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
