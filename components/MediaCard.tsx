"use client";

import Image from "next/image";
import { MediaItem } from "@/lib/schema";

interface MediaCardProps {
  item: MediaItem;
  onClick?: () => void;
}

/**
 * MediaCard Component
 * Displays a single anime item with cover image, title, and basic info.
 * Clickable to open details modal.
 *
 * @param item - MediaItem data to display
 * @param onClick - Callback when card is clicked
 */
export function MediaCard({ item, onClick }: MediaCardProps) {
  return (
    <button
      onClick={onClick}
      className="group relative w-full h-full text-left transition-all duration-200 hover:shadow-lg hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg overflow-hidden"
      aria-label={`View details for ${item.engTitle || item.nativeTitle}`}
    >
      <div className="bg-card border border-border rounded-lg overflow-hidden h-full flex flex-col">
        {/* Image Container */}
        <div className="relative w-full aspect-[3/4] bg-muted overflow-hidden">
          {item.imageMedium ? (
            <Image
              src={item.imageMedium}
              alt={item.engTitle || item.nativeTitle}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-200"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              priority={false}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-muted-foreground text-sm">No image</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 p-4 space-y-2">
          {/* Title */}
          <div className="space-y-1">
            <p className="font-semibold text-sm leading-tight line-clamp-2">
              {item.engTitle || item.nativeTitle}
            </p>
            {item.engTitle && item.nativeTitle !== item.engTitle && (
              <p className="text-xs text-muted-foreground line-clamp-1">{item.nativeTitle}</p>
            )}
          </div>

          {/* Meta */}
          <div className="flex items-center gap-2 flex-wrap text-xs text-muted-foreground">
            <span className="px-2 py-1 bg-muted rounded">{item.type}</span>
            <span className="px-2 py-1 bg-muted rounded">{item.status}</span>
          </div>
        </div>
      </div>
    </button>
  );
}
