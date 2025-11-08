"use client";

import { PawPrint } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  onNavigateToComparison?: () => void;
  onNavigateToHome?: () => void;
  currentPage: "home" | "comparison";
}

export function Header({ onNavigateToComparison, onNavigateToHome, currentPage }: HeaderProps) {
  return (
    <header className="bg-card border-b border-border sticky top-0 z-10 backdrop-blur-sm bg-card/95">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <button 
            onClick={onNavigateToHome}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <div className="p-3 rounded-full bg-primary/10">
              <PawPrint className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1>AmiFidele</h1>
              <p className="text-muted-foreground">Trouvez le meilleur pour votre compagnon</p>
            </div>
          </button>

          <nav className="flex items-center gap-4">
            <Button 
              variant={currentPage === "home" ? "default" : "ghost"}
              onClick={onNavigateToHome}
            >
              Accueil
            </Button>
            <Button 
              variant={currentPage === "comparison" ? "default" : "ghost"}
              onClick={onNavigateToComparison}
            >
              Comparer
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
