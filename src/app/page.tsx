'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Header } from '@/components/Header';
import { ProductCard } from '@/components/ProductCard';
import { ProductFilters } from '@/components/ProductFilters';
import { AiSuggestion } from '@/components/AiSuggestion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, SlidersHorizontal, Loader2 } from 'lucide-react';
import { searchProducts } from '@/services/product-api';
import type { Product } from '@/lib/types';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [priceRange, setPriceRange] = useState<{ min: number | undefined, max: number | undefined }>({ min: undefined, max: undefined });
  const [minRating, setMinRating] = useState<number>(0);
  const [country, setCountry] = useState('US');
  const [language, setLanguage] = useState('en');
  
  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300); // 300ms debounce delay

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);


  useEffect(() => {
    const fetchProducts = async () => {
      if (!debouncedSearchQuery) {
        setProducts([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const results = await searchProducts(debouncedSearchQuery, { priceRange, minRating });
        setProducts(results);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [debouncedSearchQuery, priceRange, minRating]);

  const onFiltersChange = useCallback(
    (newFilters: { 
      priceRange: { min: number | undefined; max: number | undefined };
      minRating: number;
    }) => {
      setPriceRange(newFilters.priceRange);
      setMinRating(newFilters.minRating);
    },
    []
  );

  const filtersComponent = (
    <ProductFilters
      priceRange={priceRange}
      minRating={minRating}
      onFiltersChange={onFiltersChange}
    />
  );

  const aiFilters = useMemo(() => ({
    price: priceRange,
    rating: minRating,
    country,
    language,
  }), [priceRange, minRating, country, language]);

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header
        showControls={true}
        country={country}
        onCountryChange={setCountry}
        language={language}
        onLanguageChange={setLanguage}
      />
      <main className="flex-1">
        <div className="container mx-auto grid flex-1 gap-8 px-4 py-8 md:grid-cols-[280px_1fr]">
          <aside className="hidden md:block">{filtersComponent}</aside>
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search for products... AI will suggest as you type"
                  className="w-full rounded-full bg-white pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="md:hidden">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-full">
                      <SlidersHorizontal className="h-5 w-5" />
                      <span className="sr-only">Open filters</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                    {filtersComponent}
                  </SheetContent>
                </Sheet>
              </div>
            </div>

            <AiSuggestion
              searchQuery={debouncedSearchQuery}
              filters={aiFilters}
              externalProductData={JSON.stringify(products)}
            />

            {isLoading ? (
               <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/20 py-20 text-center">
                 <Loader2 className="h-10 w-10 animate-spin text-primary" />
                 <h3 className="mt-4 text-xl font-semibold tracking-tight text-muted-foreground">
                   Searching for products...
                 </h3>
               </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </main>
    </div>
  );
}
