'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Loader2, Sparkles } from 'lucide-react';
import { suggestBetterProducts } from '@/ai/flows/suggest-better-products';
import type { SuggestBetterProductsOutput } from '@/ai/flows/suggest-better-products';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

interface AiSuggestionProps {
  searchQuery: string;
  filters: {
    rating: number;
    price: { min?: number; max?: number };
    country: string;
    language: string;
  };
  externalProductData: string;
}

export function AiSuggestion({
  searchQuery,
  filters,
  externalProductData,
}: AiSuggestionProps) {
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] =
    useState<SuggestBetterProductsOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setLoading(false);
      setSuggestion(null);
      setError(null);
      return;
    }

    const timerId = setTimeout(() => {
      const getSuggestions = async () => {
        setLoading(true);
        setError(null);
        setSuggestion(null);

        try {
          const result = await suggestBetterProducts({
            searchQuery,
            filters,
            externalProductData,
          });
          setSuggestion(result);
        } catch (e) {
          setError('Failed to get AI suggestions. Please try again.');
          console.error(e);
        } finally {
          setLoading(false);
        }
      };
      getSuggestions();
    }, 500); // Debounce for 500ms

    return () => {
      clearTimeout(timerId);
    };
  }, [searchQuery, filters, externalProductData]);

  const showContent = loading || error || suggestion;

  return (
    <Card className="bg-card/50">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <div>
            <CardTitle>AI-Powered Suggestions</CardTitle>
            <CardDescription>
              As you type, AI will find better products for you.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      {showContent && (
        <CardContent>
          {loading && (
            <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/20 py-10">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="text-lg font-medium">Thinking...</span>
              </div>
            </div>
          )}
          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {suggestion && (
            <div className="space-y-4 rounded-lg border bg-background p-4">
              <div>
                <h4 className="font-semibold">Suggested Products:</h4>
                <ul className="mt-2 list-disc space-y-1 pl-5">
                  {suggestion.suggestedProducts.map((product, index) => (
                    <li key={index}>
                      <a
                        href={product.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary underline-offset-4 hover:underline"
                      >
                        {product.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold">Reasoning:</h4>
                <p className="mt-2 text-sm text-muted-foreground">
                  {suggestion.reasoning}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}
