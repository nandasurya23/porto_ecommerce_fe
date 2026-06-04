"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAdminProducts, fetchProductById, fetchProductBySlug, fetchPublicProducts } from "@/services/product.service";
import { fetchAdminCategories, fetchPublicCategories } from "@/services/category.service";
import type { Product } from "@/types/product";

type ProductFilters = {
  search?: string;
  category?: string;
  size?: string;
  color?: string;
  stock?: "all" | "available" | "low" | "out";
  sort?: "newest" | "price-asc" | "price-desc";
};

function filterProducts(products: Product[], filters: ProductFilters): Product[] {
  const next = products.filter((product) => {
    const matchesSearch = filters.search
      ? `${product.name} ${product.category} ${product.description}`.toLowerCase().includes(filters.search.toLowerCase())
      : true;
    const matchesCategory = filters.category ? product.category === filters.category : true;
    const matchesSize = filters.size ? product.variants.some((variant) => variant.size === filters.size) : true;
    const matchesColor = filters.color ? product.variants.some((variant) => variant.color === filters.color) : true;
    const matchesStock = filters.stock
      ? product.variants.some((variant) => {
          if (filters.stock === "available") return variant.stock > 5;
          if (filters.stock === "low") return variant.stock > 0 && variant.stock <= 5;
          if (filters.stock === "out") return variant.stock === 0;
          return true;
        })
      : true;

    return matchesSearch && matchesCategory && matchesSize && matchesColor && matchesStock;
  });

  return [...next].sort((a, b) => {
    if (filters.sort === "price-asc") {
      return a.basePrice - b.basePrice;
    }

    if (filters.sort === "price-desc") {
      return b.basePrice - a.basePrice;
    }

    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}

export function useProductsQuery(filters: ProductFilters = {}) {
  return useQuery({
    queryKey: ["products", filters],
    queryFn: async () => {
      const response = await fetchPublicProducts();
      return filterProducts(response.items, filters);
    },
    staleTime: 30_000,
  });
}

export function useAdminProductsQuery() {
  return useQuery({
    queryKey: ["products", "admin"],
    queryFn: async () => {
      const response = await fetchAdminProducts();
      return response.items;
    },
    staleTime: 30_000,
  });
}

export function useFeaturedProductsQuery() {
  return useQuery({
    queryKey: ["products", "featured"],
    queryFn: async () => {
      const response = await fetchPublicProducts();
      return response.items.slice(0, 3);
    },
    staleTime: 30_000,
  });
}

export function useProductDetailQuery(slug: string) {
  return useQuery({
    queryKey: ["products", slug],
    queryFn: async () => fetchProductBySlug(slug),
    enabled: Boolean(slug),
  });
}

export function useProductByIdQuery(productId: string) {
  return useQuery({
    queryKey: ["products", "id", productId],
    queryFn: async () => fetchProductById(productId),
    enabled: Boolean(productId),
  });
}

export function useProductCategoriesQuery() {
  return useQuery({
    queryKey: ["products", "categories"],
    queryFn: async () => fetchPublicCategories(),
    staleTime: 30_000,
  });
}

export function useAdminCategoriesQuery() {
  return useQuery({
    queryKey: ["admin", "categories"],
    queryFn: async () => fetchAdminCategories(),
    staleTime: 30_000,
  });
}

export function useVariantOptions(productSlug?: string) {
  const query = useProductDetailQuery(productSlug ?? "");
  return useMemo(() => {
    const product = query.data;
    return {
      colors: product ? [...new Set(product.variants.map((variant) => variant.color))] : [],
      sizes: product ? [...new Set(product.variants.map((variant) => variant.size))] : [],
      product,
    };
  }, [query.data]);
}
