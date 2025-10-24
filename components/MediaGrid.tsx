"use client";

import { MediaCard } from "@/components/MediaCard";
import { MediaItem } from "@/lib/schema";

interface MediaGridProps {
  items: MediaItem[];
  onItemClick?: (item: MediaItem) => void;
  isLoading?: boolean;
}

/**
 * MediaGrid Component
 * Displays a responsive grid of media items.
 * Responsive: 1 column on mobile, 2 on tablet, 3-4 on desktop
 *
 * @param items - Array of MediaItems to display
 * @param onItemClick - Callback when an item is clicked
 * @param isLoading - Show skeleton loading state
 */
export function MediaGrid({ items, onItemClick, isLoading = false }: MediaGridProps) {
  if (isLoading) {
    // Skeleton loading state
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="aspect-[3/4] bg-muted rounded-lg animate-pulse"
            aria-busy="true"
            aria-label="Loading..."
          />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 text-center">
        <div>
          <p className="text-muted-foreground">No anime found</p>
          <p className="text-sm text-muted-foreground mt-2">Try adjusting your search</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {items.map((item) => (
        <div key={item.id} className="h-full">
          <MediaCard item={item} onClick={() => onItemClick?.(item)} />
        </div>
      ))}
    </div>
  );
}
