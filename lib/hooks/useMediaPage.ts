"use client";

import { useQuery } from "@apollo/client";
import { GET_ANIME_PAGE } from "@/lib/graphql/queries";
import { MediaItem, MediaItemSchema, PageInfo, PageInfoSchema } from "@/lib/schema";

interface UseMediaPageReturn {
  mediaItems: MediaItem[];
  pageInfo: PageInfo | null;
  loading: boolean;
  error: Error | undefined;
}

interface AniListMedia {
  id: number;
  title: {
    english: string | null;
    native: string;
  };
  status: string;
  type: string;
  startDate: { year: number | null; month: number | null; day: number | null } | null;
  endDate: { year: number | null; month: number | null; day: number | null } | null;
  description: string | null;
  coverImage: {
    large: string;
    medium: string;
  };
}

interface GetAnimePageData {
  Page: {
    pageInfo: {
      currentPage: number;
      hasNextPage: boolean;
      perPage: number;
    };
    media: AniListMedia[];
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
    imageMedium: anilistMedia.coverImage.medium,
    imageLarge: anilistMedia.coverImage.large,
  };
}

/**
 * Hook to fetch and transform media data from AniList API
 * Handles pagination, loading, and error states
 */
export function useMediaPage(page: number, perPage: number = 20): UseMediaPageReturn {
  const { data, loading, error } = useQuery<GetAnimePageData>(GET_ANIME_PAGE, {
    variables: { page, perPage },
    skip: !page, // Skip query if no page provided
  });

  if (!data?.Page) {
    return {
      mediaItems: [],
      pageInfo: null,
      loading,
      error,
    };
  }

  try {
    // Transform and validate media items
    const mediaItems = data.Page.media
      .map(transformToMediaItem)
      .map((item) => MediaItemSchema.parse(item));

    // Validate page info
    const pageInfo = PageInfoSchema.parse(data.Page.pageInfo);

    return { mediaItems, pageInfo, loading, error };
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
