"use client";

import { useGetAnimePageQuery } from "@/lib/graphql/generated/operations";
import { MediaItem, MediaItemSchema } from "@/lib/schema";

export interface UseMediaPageReturn {
  mediaItems: MediaItem[];
  pageInfo: { hasNextPage: boolean; currentPage: number };
  loading: boolean;
  error: Error | null;
}

/**
 * Transform AniList media object to internal MediaItem format
 * Extracts and normalizes fields from GraphQL response
 * @throws Throws if required fields missing (catches in hook)
 */
function transformToMediaItem(anilistMedia: any): MediaItem {
  // Transform AniList API response to our internal MediaItem schema
  // Handles field mapping and type conversion
  const item = {
    id: anilistMedia.id?.toString() ?? "",
    engTitle: anilistMedia.title?.english ?? anilistMedia.title?.romaji ?? "Unknown",
    nativeTitle: anilistMedia.title?.native ?? "",
    status: anilistMedia.status ?? "UNKNOWN",
    type: anilistMedia.type ?? "ANIME",
    startDate: {
      year: anilistMedia.startDate?.year ?? null,
      month: anilistMedia.startDate?.month ?? null,
      day: anilistMedia.startDate?.day ?? null,
    },
    endDate: {
      year: anilistMedia.endDate?.year ?? null,
      month: anilistMedia.endDate?.month ?? null,
      day: anilistMedia.endDate?.day ?? null,
    },
    description: anilistMedia.description ?? "",
    imageMedium: anilistMedia.coverImage?.medium ?? "",
    imageLarge: anilistMedia.coverImage?.large ?? "",
  };

  // Validate transformed item with Zod schema
  // Ensures only properly typed data is returned
  return MediaItemSchema.parse(item);
}

/**
 * Fetch paginated anime data from AniList GraphQL API
 * Transforms API response to internal MediaItem format
 * Handles errors gracefully with detailed logging
 *
 * @param page - Page number (1-indexed)
 * @param perPage - Items per page (default 20)
 * @returns Object with mediaItems, pageInfo, loading, and error states
 */
export function useMediaPage(page: number, perPage: number = 20): UseMediaPageReturn {
  // Validate page parameter - ensure positive integer
  const validPage = Math.max(1, Math.floor(page));
  const validPerPage = Math.max(1, Math.min(perPage, 25)); // AniList max is 25

  // Execute GraphQL query with Apollo Client
  // errorPolicy: "all" continues loading even if graphQL errors occur
  const { data, loading, error } = useGetAnimePageQuery({
    variables: {
      page: validPage,
      perPage: validPerPage,
    },
    errorPolicy: "all", // Don't throw on GraphQL errors, show partial data
  });

  // Log errors for debugging (helpful in production)
  if (error) {
    console.error("Apollo Query Error:", {
      message: error.message,
      networkError: error.networkError,
      graphQLErrors: error.graphQLErrors,
    });
  }

  if (!data?.Page) {
    return {
      mediaItems: [],
      pageInfo: { hasNextPage: false, currentPage: validPage },
      loading,
      error: error ?? null,
    };
  }

  // Transform AniList response items to internal MediaItem format
  const mediaItems = (data.Page.media ?? [])
    .map((item: any) => {
      try {
        return transformToMediaItem(item);
      } catch (err) {
        // Log transformation errors but continue processing other items
        console.error("Failed to transform media item:", item.id, err);
        return null;
      }
    })
    .filter((item): item is MediaItem => item !== null); // Type guard to remove nulls

  return {
    mediaItems,
    pageInfo: {
      hasNextPage: data.Page.pageInfo?.hasNextPage ?? false,
      currentPage: validPage,
    },
    loading,
    error: error ?? null,
  };
}
