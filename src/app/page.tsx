"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { HomePage } from "@/components/HomePage";
import { ComparisonPage } from "@/components/ComparisonPage";
import { mockProducts } from "@/components/products";

type Page = "home" | "comparison";

export default function Home() {
  const [currentPage, setCurrentPage] = useState<Page>("home");

  return (
    <div className="min-h-screen">
      <Header
        currentPage={currentPage}
        onNavigateToHome={() => setCurrentPage("home")}
        onNavigateToComparison={() => setCurrentPage("comparison")}
      />
      
      {currentPage === "home" ? (
        <HomePage 
          products={mockProducts} 
          onNavigateToComparison={() => setCurrentPage("comparison")}
        />
      ) : (
        <ComparisonPage products={mockProducts} />
      )}
    </div>
  );
}
