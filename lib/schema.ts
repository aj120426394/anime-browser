import { z } from "zod";

/**
 * Profile Schema - User identity stored in localStorage
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

/**
 * Media Entity Schemas
 */
export const FuzzyDateSchema = z
  .object({
    year: z.number().nullable(),
    month: z.number().min(1).max(12).nullable(),
    day: z.number().min(1).max(31).nullable(),
  })
  .nullable();

export type FuzzyDate = z.infer<typeof FuzzyDateSchema>;

export const MediaStatusSchema = z.enum([
  "FINISHED",
  "RELEASING",
  "NOT_YET_RELEASED",
  "CANCELLED",
  "HIATUS",
]);

export type MediaStatus = z.infer<typeof MediaStatusSchema>;

export const MediaTypeSchema = z.enum(["ANIME", "MANGA"]);

export type MediaType = z.infer<typeof MediaTypeSchema>;

/**
 * MediaItem Schema - Internal DTO after transformation from AniList API
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
 * PageInfo Schema - Pagination metadata from AniList API
 */
export const PageInfoSchema = z.object({
  currentPage: z.number().int().min(1, "Page must be at least 1"),
  hasNextPage: z.boolean(),
  perPage: z.number().int().min(1).max(50, "Per page must be between 1 and 50"),
});

export type PageInfo = z.infer<typeof PageInfoSchema>;

/**
 * PaginationState Schema - Derived from URL query params
 */
export const PaginationStateSchema = z.object({
  currentPage: z.number().int().min(1).default(1),
  perPage: z.number().int().min(1).max(50).default(20),
});

export type PaginationState = z.infer<typeof PaginationStateSchema>;

/**
 * Challenge Version Schema
 */
export const ChallengeVersionSchema = z.object({
  version: z.string().regex(/^v?\d+\.\d+$/, 'Version must be in format "X.Y" or "vX.Y"'),
});

export type ChallengeVersion = z.infer<typeof ChallengeVersionSchema>;

/**
 * Export all schemas for use in tests and components
 */
export const schemas = {
  Profile: ProfileSchema,
  MediaItem: MediaItemSchema,
  PageInfo: PageInfoSchema,
  PaginationState: PaginationStateSchema,
  ChallengeVersion: ChallengeVersionSchema,
} as const;
