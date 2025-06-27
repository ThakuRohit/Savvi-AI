'use server';

import { mockProducts } from '@/lib/products';
import type { Product } from '@/lib/types';

interface SearchFilters {
  priceRange: { min: number | undefined; max: number | undefined };
  minRating: number;
}

export async function searchProducts(
  query: string,
  filters: SearchFilters
): Promise<Product[]> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  if (!query) {
    return [];
  }

  const lowerCaseQuery = query.toLowerCase();

  return mockProducts.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(lowerCaseQuery) ||
      product.description.toLowerCase().includes(lowerCaseQuery) ||
      product.category.toLowerCase().includes(lowerCaseQuery);

    const matchesPrice =
      (filters.priceRange.min === undefined || product.price >= filters.priceRange.min) &&
      (filters.priceRange.max === undefined || product.price <= filters.priceRange.max);

    const matchesRating = product.rating >= filters.minRating;

    return matchesSearch && matchesPrice && matchesRating;
  });
}
