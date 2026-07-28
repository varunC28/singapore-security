import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { Product } from '@/types';
import { MOCK_PRODUCTS } from '@/lib/constants';

interface UseProductsOptions {
  categoryId?: string | null;
}

export function useProducts(options: UseProductsOptions = {}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    // If Supabase isn't configured, use mock data
    if (!isSupabaseConfigured()) {
      const filtered = options.categoryId
        ? MOCK_PRODUCTS.filter((p) => p.category_id === options.categoryId)
        : MOCK_PRODUCTS;
      setProducts(filtered);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let query = supabase
        .from('products')
        .select('*, category:categories(id, name, slug)')
        .order('created_at', { ascending: false });

      if (options.categoryId) {
        query = query.eq('category_id', options.categoryId);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;
      setProducts((data as Product[]) ?? []);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
      // Fallback to mock data on error
      setProducts(MOCK_PRODUCTS);
    } finally {
      setLoading(false);
    }
  }, [options.categoryId]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, loading, error, refetch: fetchProducts };
}
