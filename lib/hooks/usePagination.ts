"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";

interface UsePaginationReturn {
  currentPage: number;
  goToPage: (page: number) => void;
}

/**
 * Hook to manage pagination state synced with URL query parameters
 * Enables deep linking and browser history support
 */
export function usePagination(): UsePaginationReturn {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Parse current page from URL, default to 1
  // Handle non-numeric values by checking for NaN
  const parsedPage = parseInt(searchParams.get("page") || "1", 10);
  const isValidPage = !isNaN(parsedPage) && parsedPage >= 1;
  const currentPage = isValidPage ? parsedPage : 1;

  // If page parameter is invalid or out of bounds, correct the URL
  useEffect(() => {
    if (!isValidPage) {
      const params = new URLSearchParams(searchParams);
      params.set("page", "1");
      router.replace(`?${params.toString()}`);
    }
  }, [isValidPage, searchParams, router]);

  // Navigate to a specific page
  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams);
    const validPage = Math.max(1, page);
    params.set("page", validPage.toString());
    router.push(`?${params.toString()}`);
  };

  return { currentPage, goToPage };
}
