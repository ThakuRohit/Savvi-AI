import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  className?: string;
}

export function StarRating({
  rating,
  maxRating = 5,
  className,
}: StarRatingProps) {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;
  const emptyStars = maxRating - fullStars - (halfStar ? 1 : 0);

  return (
    <div className={cn('flex items-center gap-0.5', className)}>
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
      ))}
      {/* Note: Half star implementation is possible but omitted for simplicity with line-art icons */}
      {[...Array(emptyStars + (halfStar ? 1 : 0))].map((_, i) => (
        <Star key={`empty-${i}`} className="h-4 w-4 text-muted-foreground/50" />
      ))}
    </div>
  );
}
