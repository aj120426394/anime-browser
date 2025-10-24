/**
 * Zod Validation Schemas for Runtime Type Safety
 *
 * All external data (API responses, user inputs, localStorage) must be
 * validated with these schemas before use.
 */

import { z } from "zod";

// ============================================================================
// Profile Schemas
// ============================================================================

/**
 * User profile stored in localStorage
 * Required to access the information page
 */
export const ProfileSchema = z.object({
  username: z
    .string()
    .min(1, "Username is required")
    .max(50, "Username must be 50 characters or less")
    .trim(),
  jobTitle: z
    .string()
    .min(1, "Job title is required")
    .max(100, "Job title must be 100 characters or less")
    .trim(),
});

export type Profile = z.infer<typeof ProfileSchema>;

// ============================================================================
// Media Schemas (AniList Data)
// ============================================================================

/**
 * Fuzzy date from AniList (allows partial dates)
 */
export const FuzzyDateSchema = z
  .object({
    year: z.number().nullable(),
    month: z.number().min(1).max(12).nullable(),
    day: z.number().min(1).max(31).nullable(),
  })
  .nullable();

export type FuzzyDate = z.infer<typeof FuzzyDateSchema>;

/**
 * Media status enum
 */
export const MediaStatusSchema = z.enum([
  "FINISHED",
  "RELEASING",
  "NOT_YET_RELEASED",
  "CANCELLED",
  "HIATUS",
]);

export type MediaStatus = z.infer<typeof MediaStatusSchema>;

/**
 * Media type enum
 */
export const MediaTypeSchema = z.enum(["ANIME", "MANGA"]);

export type MediaType = z.infer<typeof MediaTypeSchema>;

/**
 * Individual media item (anime/manga)
 * Internal DTO after transformation from AniList API
 */
export const MediaItemSchema = z.object({
  id: z.string(),
  engTitle: z.string(),
  nativeTitle: z.string().min(1, "Native title is required"),
  status: MediaStatusSchema,
  type: MediaTypeSchema,
  startDate: FuzzyDateSchema,
  endDate: FuzzyDateSchema,
  description: z.string(),
  imageMedium: z.string().url("Invalid medium image URL"),
  imageLarge: z.string().url("Invalid large image URL"),
});

export type MediaItem = z.infer<typeof MediaItemSchema>;

/**
 * Page info metadata from AniList API
 */
export const PageInfoSchema = z.object({
  currentPage: z.number().int().min(1, "Page must be at least 1"),
  hasNextPage: z.boolean(),
  perPage: z.number().int().min(1).max(50, "Per page must be between 1 and 50"),
});

export type PageInfo = z.infer<typeof PageInfoSchema>;

// ============================================================================
// AniList API Response Schemas (for validation)
// ============================================================================

/**
 * Raw AniList API response structure (before transformation)
 * Use this to validate API responses before transforming to internal DTOs
 */
const AniListTitleSchema = z.object({
  english: z.string().nullable(),
  native: z.string(),
});

const AniListCoverImageSchema = z.object({
  large: z.string().url(),
  medium: z.string().url(),
});

const AniListMediaSchema = z.object({
  id: z.number(),
  title: AniListTitleSchema,
  status: MediaStatusSchema,
  type: MediaTypeSchema,
  startDate: FuzzyDateSchema,
  endDate: FuzzyDateSchema,
  description: z.string().nullable(),
  coverImage: AniListCoverImageSchema,
});

export const AniListPageResponseSchema = z.object({
  pageInfo: PageInfoSchema,
  media: z.array(AniListMediaSchema),
});

export type AniListPageResponse = z.infer<typeof AniListPageResponseSchema>;

// ============================================================================
// Pagination Schemas
// ============================================================================

/**
 * Pagination state (derived from URL query params)
 */
export const PaginationStateSchema = z.object({
  currentPage: z.number().int().min(1).default(1),
  perPage: z.number().int().min(1).max(50).default(20),
});

export type PaginationState = z.infer<typeof PaginationStateSchema>;

// ============================================================================
// Utility Schemas
// ============================================================================

/**
 * Challenge version (static configuration)
 */
export const ChallengeVersionSchema = z.object({
  version: z
    .string()
    .regex(/^v?\d+\.\d+$/, 'Version must be in format "X.Y" or "vX.Y"'),
});

export type ChallengeVersion = z.infer<typeof ChallengeVersionSchema>;

// ============================================================================
// Schema Exports for Testing
// ============================================================================

/**
 * Export all schemas for use in tests and components
 */
export const schemas = {
  Profile: ProfileSchema,
  MediaItem: MediaItemSchema,
  PageInfo: PageInfoSchema,
  PaginationState: PaginationStateSchema,
  AniListPageResponse: AniListPageResponseSchema,
  ChallengeVersion: ChallengeVersionSchema,
} as const;
