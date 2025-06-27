import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { Product } from '@/lib/types';
import { StarRating } from './StarRating';
import { cn } from '@/lib/utils';

export function ProductCard({ product }: { product: Product }) {
  return (
    <Card className="flex h-full flex-col overflow-hidden rounded-lg shadow-sm transition-all hover:shadow-md">
      <CardHeader className="p-0">
        <div className="relative aspect-square w-full">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover"
            data-ai-hint={`${product.category} product`}
          />
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-4">
        <CardTitle className="mb-2 line-clamp-2 text-base font-semibold leading-tight">
          {product.name}
        </CardTitle>
        <div className="flex items-center gap-2">
          <StarRating rating={product.rating} />
          <span className="text-sm text-muted-foreground">({product.rating})</span>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between p-4 pt-0">
        <p className="text-lg font-bold text-primary">${product.price.toFixed(2)}</p>
        <Button asChild size="sm">
          <Link href={product.productUrl} target="_blank" rel="noopener noreferrer">
            View Product
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
