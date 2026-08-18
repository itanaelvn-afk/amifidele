"use client";

import { useState, useRef, useCallback } from 'react';
import { fetchProducts, fetchProductsByCategory, searchProducts, ProductFilters } from '@/lib/api';
import { mapApiProductsToDisplayProducts } from '@/lib/utils/api-utils';
import { DisplayProduct } from '@/lib/types';

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export function useProducts() {
  const [products, setProducts] = useState<DisplayProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });
  const requestIdRef = useRef(0);

  const loadProducts = useCallback(async (page: number = 1, limit: number = 20, filters?: ProductFilters) => {
    const requestId = ++requestIdRef.current;
    try {
      setLoading(true);
      setError(null);
      const response = await fetchProducts(page, limit, filters);
      // Ignore les réponses obsolètes (frappe / filtres plus récents)
      if (requestId !== requestIdRef.current) return;
      const mappedProducts = mapApiProductsToDisplayProducts(response.products);
      setProducts(mappedProducts);
      setPagination({
        page: response.page,
        limit: response.limit,
        total: response.total,
        totalPages: response.totalPages,
      });
    } catch (err) {
      if (requestId !== requestIdRef.current) return;
      console.error('Erreur lors du chargement des produits:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des produits');
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  }, []);

  const loadProductsByCategory = async (category: string, page: number = 1, limit: number = 20) => {
    const requestId = ++requestIdRef.current;
    try {
      setLoading(true);
      setError(null);
      const response = await fetchProductsByCategory(category, page, limit);
      if (requestId !== requestIdRef.current) return;
      const mappedProducts = mapApiProductsToDisplayProducts(response.products);
      setProducts(mappedProducts);
      setPagination({
        page: response.page,
        limit: response.limit,
        total: response.total,
        totalPages: response.totalPages,
      });
    } catch (err) {
      if (requestId !== requestIdRef.current) return;
      console.error('Erreur lors du chargement des produits par catégorie:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des produits');
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  };

  const search = async (query: string, page: number = 1, limit: number = 20) => {
    const requestId = ++requestIdRef.current;
    try {
      setLoading(true);
      setError(null);
      const response = await searchProducts(query, page, limit);
      if (requestId !== requestIdRef.current) return;
      const mappedProducts = mapApiProductsToDisplayProducts(response.products);
      setProducts(mappedProducts);
      setPagination({
        page: response.page,
        limit: response.limit,
        total: response.total,
        totalPages: response.totalPages,
      });
    } catch (err) {
      if (requestId !== requestIdRef.current) return;
      console.error('Erreur lors de la recherche:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors de la recherche');
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  };

  return {
    products,
    loading,
    error,
    pagination,
    loadProducts,
    loadProductsByCategory,
    search,
    refetch: () => loadProducts(pagination.page, pagination.limit),
  };
}
