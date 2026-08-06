"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { HomePage } from "@/components/HomePage";
import { ComparisonPage } from "@/components/ComparisonPage";
import { useProducts } from "@/hooks/useProducts";

type Page = "home" | "comparison";

export default function Home() {
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const { products, loading, error } = useProducts();

  return (
    <div className="min-h-screen">
      <Header
        currentPage={currentPage}
        onNavigateToHome={() => setCurrentPage("home")}
        onNavigateToComparison={() => setCurrentPage("comparison")}
      />
      
      {currentPage === "home" ? (
        <HomePage 
          products={products}
          loading={loading}
          error={error}
          onNavigateToComparison={() => setCurrentPage("comparison")}
        />
      ) : (
        <ComparisonPage />
      )}
    </div>
  );
}
