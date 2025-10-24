"use client";

import { useState } from "react";
import { MediaItem } from "@/lib/schema";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { sanitizeHTML } from "@/lib/utils/sanitize";
import Image from "next/image";

interface MediaModalProps {
  isOpen: boolean;
  item: MediaItem | null;
  onClose: () => void;
}

/**
 * MediaModal Component - Displays detailed media information in an accessible modal
 * Shows large image, title (English and native), status, dates, type, and description
 * Handles image loading failures gracefully
 */
export function MediaModal({ isOpen, item, onClose }: MediaModalProps) {
  const [imageError, setImageError] = useState(false);

  if (!item) return null;

  // Format date from FuzzyDate
  const formatDate = (date: { year: number; month: number; day: number } | null) => {
    if (!date || !date.year) return "Unknown";
    const { year, month, day } = date;

    if (month && day) {
      return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    } else if (month) {
      return `${year}-${String(month).padStart(2, "0")}`;
    }
    return `${year}`;
  };

  const sanitizedDescription = sanitizeHTML(item.description);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" data-testid="media-modal">
        <div className="space-y-6 pt-8">
          {/* Large Image */}
          <div className="relative w-full max-h-screen bg-muted rounded-lg overflow-hidden flex items-center justify-center min-h-96">
            {item.imageLarge && !imageError ? (
              <Image
                src={item.imageLarge}
                alt={item.engTitle || "Media image"}
                width={300}
                height={450}
                quality={90}
                className="object-contain w-full h-auto"
                priority
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="flex items-center justify-center h-full bg-gradient-to-br from-muted to-muted/50 w-full">
                <div className="text-center space-y-2">
                  <div className="text-5xl">📷</div>
                  <p className="text-muted-foreground">Image unavailable</p>
                </div>
              </div>
            )}
          </div>

          {/* Title Section */}
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">{item.engTitle || "Unknown Title"}</h2>
            {item.nativeTitle && (
              <p className="text-lg text-muted-foreground" lang="ja">
                {item.nativeTitle}
              </p>
            )}
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-semibold text-muted-foreground">Status</p>
              <p className="text-base">{item.status}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-muted-foreground">Type</p>
              <p className="text-base">{item.type}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-muted-foreground">Start Date</p>
              <p className="text-base">{formatDate(item.startDate as any)}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-muted-foreground">End Date</p>
              <p className="text-base">{formatDate(item.endDate as any)}</p>
            </div>
          </div>

          {/* Description */}
          {item.description && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-muted-foreground">Description</h3>
              <div
                className="text-sm leading-relaxed text-foreground prose prose-sm dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
              />
            </div>
          )}

          {/* Close Button */}
          <DialogClose asChild>
            <Button className="w-full">Close</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
