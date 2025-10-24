"use client";

import { useGetAnimePageQuery } from "@/lib/graphql/generated/operations";
import { MediaItem, MediaItemSchema, PageInfo, PageInfoSchema } from "@/lib/schema";

interface UseMediaPageReturn {
  mediaItems: MediaItem[];
  pageInfo: PageInfo | null;
  loading: boolean;
  error: Error | null;
}

interface AniListMedia {
  id: number;
  title: {
    english: string | null;
    native: string;
  };
  status: string;
  type: string;
  startDate: {
    year: number | null;
    month: number | null;
    day: number | null;
  };
  endDate: {
    year: number | null;
    month: number | null;
    day: number | null;
  };
  description: string | null;
  coverImage: {
    large: string | null;
    medium: string | null;
  };
}

/**
 * Transform AniList API response to internal MediaItem DTO
 */
function transformToMediaItem(anilistMedia: AniListMedia): MediaItem {
  return {
    id: anilistMedia.id.toString(),
    engTitle: anilistMedia.title.english || "",
    nativeTitle: anilistMedia.title.native,
    status: anilistMedia.status as any,
    type: anilistMedia.type as any,
    startDate: anilistMedia.startDate,
    endDate: anilistMedia.endDate,
    description: anilistMedia.description || "",
    imageMedium: anilistMedia.coverImage.medium || "",
    imageLarge: anilistMedia.coverImage.large || "",
  };
}

/**
 * Fetch and transform paginated anime data from AniList
 * @param page - Current page number (1-indexed)
 * @param perPage - Number of items per page (default 20, max 50)
 * @returns Object containing mediaItems array, pageInfo, loading and error states
 */
export function useMediaPage(page: number, perPage: number = 20): UseMediaPageReturn {
  // Validate page parameter
  const validPage = Math.max(1, Math.floor(page));
  const validPerPage = Math.max(1, Math.min(perPage, 50)); // AniList max is 50

  // Use the generated hook to fetch data
  const { data, loading, error } = useGetAnimePageQuery({
    variables: {
      page: validPage,
      perPage: validPerPage,
    },
  });

  // Handle no data
  if (!data || !data.Page) {
    return {
      mediaItems: [],
      pageInfo: null,
      loading,
      error: error || null,
    };
  }

  try {
    // Transform and validate pageInfo
    const pageInfoData = data.Page.pageInfo;
    const pageInfo = pageInfoData
      ? PageInfoSchema.parse({
          currentPage: pageInfoData.currentPage,
          hasNextPage: pageInfoData.hasNextPage,
          perPage: pageInfoData.perPage,
        })
      : null;

    // Transform and validate media items
    const mediaItems = (data.Page.media || [])
      .filter((item): item is AniListMedia => Boolean(item))
      .map(transformToMediaItem)
      .map((item) => MediaItemSchema.parse(item));

    return { mediaItems, pageInfo, loading, error: error || null };
  } catch (validationError) {
    console.error("Validation error:", validationError);
    return {
      mediaItems: [],
      pageInfo: null,
      loading: false,
      error: validationError instanceof Error ? validationError : new Error("Validation failed"),
    };
  }
}
