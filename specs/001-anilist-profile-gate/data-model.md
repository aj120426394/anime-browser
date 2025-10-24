# Data Model: AniList Profile Gate & Information Browser

**Feature**: 001-anilist-profile-gate
**Date**: 2025-10-24
**Purpose**: Define data entities, relationships, validation rules, and state management

## Overview

The application manages three primary data entities: **Profile** (user identity), **MediaItem** (anime data), and **PaginationState** (navigation state). Profile is persisted in localStorage, MediaItem data is fetched from AniList GraphQL API and cached in Apollo, and PaginationState is synchronized with URL query parameters.

---

## 1. Profile Entity

### Description

Represents the user's identity information required to access the application. Acts as the gate credential.

### Schema

```typescript
interface Profile {
  username: string; // User's display name or identifier
  jobTitle: string; // User's job title or role
}
```

### Validation Rules (Zod)

```typescript
import { z } from "zod";

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
```

### Storage

- **Location**: Browser localStorage under key `user-profile`
- **Format**: JSON string
- **Persistence**: Indefinite (until user clears browser data)
- **Validation**: Parsed and validated with Zod on read
- **SSR Consideration**: Only accessed client-side (window check required)

### State Transitions

```text
[No Profile] --submit form--> [Profile Exists] --clear/edit--> [Profile Updated]
     |                              |
     v                              v
  Blocked                       Unblocked
```

### Operations

- **Create**: Save to localStorage on form submission
- **Read**: Load from localStorage on app initialization
- **Update**: Modify and re-save to localStorage
- **Delete**: Remove from localStorage (optional, not required for MVP)

---

## 2. MediaItem Entity

### Description

Represents a single anime entry from the AniList database. Contains title, description, images, dates, and status information.

### Schema

```typescript
interface MediaItem {
  id: string; // Unique identifier from AniList
  engTitle: string; // English title (may be empty)
  nativeTitle: string; // Native language title (always present)
  status: MediaStatus; // Current release status
  type: MediaType; // ANIME or MANGA
  startDate: FuzzyDate | null; // Release start date
  endDate: FuzzyDate | null; // Release end date (null if ongoing)
  description: string; // Synopsis/description (sanitized)
  imageMedium: string; // Medium-sized cover image URL
  imageLarge: string; // Large-sized cover image URL
}

enum MediaStatus {
  FINISHED = "FINISHED",
  RELEASING = "RELEASING",
  NOT_YET_RELEASED = "NOT_YET_RELEASED",
  CANCELLED = "CANCELLED",
  HIATUS = "HIATUS",
}

enum MediaType {
  ANIME = "ANIME",
  MANGA = "MANGA",
}

interface FuzzyDate {
  year: number | null;
  month: number | null;
  day: number | null;
}
```

### Validation Rules (Zod)

```typescript
const FuzzyDateSchema = z
  .object({
    year: z.number().nullable(),
    month: z.number().min(1).max(12).nullable(),
    day: z.number().min(1).max(31).nullable(),
  })
  .nullable();

const MediaStatusSchema = z.enum([
  "FINISHED",
  "RELEASING",
  "NOT_YET_RELEASED",
  "CANCELLED",
  "HIATUS",
]);

const MediaTypeSchema = z.enum(["ANIME", "MANGA"]);

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
```

### Storage

- **Location**: Apollo InMemoryCache (client-side cache)
- **Format**: Normalized GraphQL objects
- **Persistence**: Session-based (cleared on page refresh unless cache persistence enabled)
- **Validation**: Validated after transformation from AniList API response

### Data Transformation

AniList API returns nested structures that must be flattened:

```typescript
// AniList API Response
interface AniListMedia {
  id: number;
  title: {
    english: string | null;
    native: string;
  };
  status: string;
  type: string;
  startDate: { year: number; month: number; day: number } | null;
  endDate: { year: number; month: number; day: number } | null;
  description: string | null;
  coverImage: {
    large: string;
    medium: string;
  };
}

// Transform function
function transformToMediaItem(anilistMedia: AniListMedia): MediaItem {
  return {
    id: anilistMedia.id.toString(),
    engTitle: anilistMedia.title.english || "",
    nativeTitle: anilistMedia.title.native,
    status: anilistMedia.status as MediaStatus,
    type: anilistMedia.type as MediaType,
    startDate: anilistMedia.startDate,
    endDate: anilistMedia.endDate,
    description: anilistMedia.description || "",
    imageMedium: anilistMedia.coverImage.medium,
    imageLarge: anilistMedia.coverImage.large,
  };
}
```

### Relationships

- **Many-to-One with PaginationState**: Many MediaItems belong to one Page
- **No relationships with Profile**: Profile gates access but doesn't relate to media data

---

## 3. PageInfo Entity

### Description

Represents metadata about the current page of results from the AniList API.

### Schema

```typescript
interface PageInfo {
  currentPage: number; // Current page number (1-indexed)
  hasNextPage: boolean; // Whether more pages exist
  perPage: number; // Items per page (12-20 configurable)
}
```

### Validation Rules (Zod)

```typescript
export const PageInfoSchema = z.object({
  currentPage: z.number().int().min(1, "Page must be at least 1"),
  hasNextPage: z.boolean(),
  perPage: z.number().int().min(1).max(50, "Per page must be between 1 and 50"),
});

export type PageInfo = z.infer<typeof PageInfoSchema>;
```

### Storage

- **Location**: Derived from AniList API response, stored in Apollo cache
- **Format**: Part of Page query response
- **Persistence**: Session-based with Apollo cache

---

## 4. PaginationState (Derived Entity)

### Description

Represents the current navigation state for pagination. Synchronized with URL query parameters for deep linking.

### Schema

```typescript
interface PaginationState {
  currentPage: number; // Current page being viewed (1-indexed)
  perPage: number; // Number of items per page (constant: 20)
  totalPages?: number; // Total pages available (calculated from hasNextPage)
}
```

### Storage

- **Location**: URL query parameter `?page=N` (source of truth)
- **Format**: Integer in URL string
- **Persistence**: Browser history (shareable, bookmarkable)
- **Validation**: Parsed as integer, defaults to 1 if invalid

### Operations

- **Read**: Parse from `useSearchParams().get('page')`
- **Update**: Use `router.push()` to update URL with new page number
- **Default**: Default to page 1 if no parameter or invalid value

### Constraints

- Minimum page: 1
- Maximum page: Determined by `hasNextPage` from API
- Invalid values (negative, zero, non-numeric) default to 1

---

## 5. Challenge Version (Static Entity)

### Description

Static version identifier displayed in the footer. Not stored or fetched, just rendered.

### Schema

```typescript
interface ChallengeVersion {
  version: string; // e.g., "3.5" or "v3.5"
}
```

### Storage

- **Location**: Environment variable `NEXT_PUBLIC_CHALLENGE_VERSION` or constant in code
- **Format**: String literal
- **Persistence**: Deployment-time configuration

---

## Data Flow Diagram

```text
┌─────────────┐
│   Browser   │
│ localStorage│
│  (Profile)  │
└──────┬──────┘
       │
       │ Read/Write
       │
       v
┌─────────────────┐         ┌──────────────┐
│  Profile Gate   │────────>│  Information │
│  (/ route)      │ Unblock │  Page        │
└─────────────────┘         └───────┬──────┘
                                    │
                                    │ Query
                                    v
                            ┌───────────────┐
                            │ Apollo Client │
                            │  (InMemory    │
                            │   Cache)      │
                            └───────┬───────┘
                                    │
                                    │ GraphQL Query
                                    v
                            ┌───────────────┐
                            │  AniList API  │
                            │  (Page query) │
                            └───────────────┘

URL Query Params (?page=N) <──> PaginationState <──> Apollo Query Variables
```

---

## Validation Strategy

### Input Validation (Client-Side)

1. **Profile Form**: Validate on blur and submit using Zod schema
2. **Page Number**: Validate on URL parse, default to 1 if invalid
3. **API Responses**: Validate with Zod after fetching, before rendering

### Error Handling

- **Profile validation errors**: Display inline error messages in form
- **API validation errors**: Log to console, display generic error to user
- **Network errors**: Show retry button with user-friendly message
- **localStorage errors**: Gracefully fall back to prompting for profile again

---

## Performance Considerations

### Caching Strategy

- **Profile**: Cached in localStorage, read once on mount
- **MediaItems**: Cached by Apollo with `keyArgs: ['page', 'perPage']`
- **Images**: Lazy loaded with Next.js Image component

### Pagination Optimization

- **Fetch on demand**: Only fetch requested page, no prefetching (simplicity)
- **Cache invalidation**: None needed (data is read-only from user perspective)
- **Stale data**: Acceptable (anime data doesn't change frequently)

---

## Summary

Three core entities (Profile, MediaItem, PageInfo) with clear ownership and validation. Profile persists in localStorage, MediaItem data flows from AniList API through Apollo cache, and PaginationState syncs with URL for deep linking. All external data validated with Zod before use.
