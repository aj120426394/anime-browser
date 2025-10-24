"use client";

import { Button } from "@/components/ui/button";

interface PaginationProps {
  currentPage: number;
  hasNextPage: boolean;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

/**
 * Pagination Component
 * Displays pagination controls with Previous/Next buttons and page numbers.
 * Includes ellipsis logic for large page counts.
 *
 * @param currentPage - Current page number (1-indexed)
 * @param hasNextPage - Whether there's a next page
 * @param onPageChange - Callback when page changes
 * @param isLoading - Disable controls during loading
 */
export function Pagination({
  currentPage,
  hasNextPage,
  onPageChange,
  isLoading = false,
}: PaginationProps) {
  // Generate page numbers to display
  const generatePageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = [];
    const delta = 2;
    const left = currentPage - delta;
    const right = currentPage + delta;

    // Always show page 1
    pages.push(1);

    // Add ellipsis if needed
    if (left > 2) {
      pages.push("...");
    }

    // Add pages around current page
    for (let i = Math.max(2, left); i <= Math.min(right, 99); i++) {
      if (i !== 1) {
        pages.push(i);
      }
    }

    // Add ellipsis if needed
    if (right < 98) {
      pages.push("...");
    }

    // Always show at least a few more pages for navigation
    // (since we don't know the total, we assume up to 100+)
    if (right >= 98 && hasNextPage) {
      pages.push(99);
    }

    return pages;
  };

  const pageNumbers = generatePageNumbers();

  return (
    <div className="flex items-center justify-center gap-1 py-8 flex-wrap">
      {/* Previous Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1 || isLoading}
        aria-label="Previous page"
      >
        Previous
      </Button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1 mx-2">
        {pageNumbers.map((page, index) => {
          if (page === "...") {
            return (
              <span key={`ellipsis-${index}`} className="px-2 py-1 text-muted-foreground">
                ...
              </span>
            );
          }

          const pageNum = page as number;
          const isCurrentPage = pageNum === currentPage;

          return (
            <Button
              key={pageNum}
              variant={isCurrentPage ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(pageNum)}
              disabled={isLoading}
              aria-label={`Go to page ${pageNum}`}
              aria-current={isCurrentPage ? "page" : undefined}
            >
              {pageNum}
            </Button>
          );
        })}
      </div>

      {/* Next Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNextPage || isLoading}
        aria-label="Next page"
      >
        Next
      </Button>

      {/* Page Info */}
      <span className="text-sm text-muted-foreground ml-4">Page {currentPage}</span>
    </div>
  );
}
