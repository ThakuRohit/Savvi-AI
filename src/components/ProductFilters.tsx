'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Star } from 'lucide-react';
import { Input } from './ui/input';

interface ProductFiltersProps {
  priceRange: { min: number | undefined; max: number | undefined };
  minRating: number;
  onFiltersChange: (newFilters: {
    priceRange: { min: number | undefined; max: number | undefined };
    minRating: number;
  }) => void;
}

const ratings = [4, 3, 2, 1, 0];

export function ProductFilters({
  priceRange,
  minRating,
  onFiltersChange,
}: ProductFiltersProps) {
  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === '' ? undefined : Number(e.target.value);
    onFiltersChange({ priceRange: { ...priceRange, min: value }, minRating });
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === '' ? undefined : Number(e.target.value);
    onFiltersChange({ priceRange: { ...priceRange, max: value }, minRating });
  };

  const handleRatingChange = (value: string) => {
    onFiltersChange({ priceRange, minRating: Number(value) });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <Label>Price Range</Label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              placeholder="Min"
              value={priceRange.min ?? ''}
              onChange={handleMinPriceChange}
              className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
            <span>-</span>
            <Input
              type="number"
              placeholder="Max"
              value={priceRange.max ?? ''}
              onChange={handleMaxPriceChange}
              className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
          </div>
        </div>
        <div className="space-y-4">
          <Label>Minimum Rating</Label>
          <RadioGroup
            value={String(minRating)}
            onValueChange={handleRatingChange}
            className="space-y-2"
          >
            {ratings.map((rating) => (
              <div key={rating} className="flex items-center space-x-2">
                <RadioGroupItem value={String(rating)} id={`r${rating}`} />
                <Label
                  htmlFor={`r${rating}`}
                  className="flex cursor-pointer items-center"
                >
                  {rating > 0 ? (
                    <>
                      <span className="flex">
                        {[...Array(rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </span>
                      <span className="ml-2 text-sm text-muted-foreground">
                        & up
                      </span>
                    </>
                  ) : (
                    'Any Rating'
                  )}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  );
}
