"use client";

import { useSearchParams, useRouter } from "next/navigation";

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
  const currentPage = Math.max(1, parseInt(searchParams.get("page") || "1", 10));

  // Navigate to a specific page
  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams);
    const validPage = Math.max(1, page);
    params.set("page", validPage.toString());
    router.push(`?${params.toString()}`);
  };

  return { currentPage, goToPage };
}
