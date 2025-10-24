# Leonardo AI Take-Home -- Process, Decisions, and Implementation Notes

## Links

- **Deployed app:** [anime-browser-jeff](https://anime-browser-jeff.vercel.app/)
- **Repository:** [anime-browser](https://github.com/aj120426394/anime-browser)
- **SpecKit prompt & phases:** [speckit-prompt](./speckit-prompt.md)

## Overview

I approached the challenge intentionally: a short research pass to understand constraints, a spec-driven plan to lock scope and quality, and then an AI-assisted build loop with human review and tests. The aim wasn't just "make it work," but to demonstrate how I structure unknowns, encode decisions up front, and keep delivery predictable under time pressure.

The app is built with **Next.js (App Router) + React + TypeScript**, styled with **Tailwind CSS** and **shadcn/ui**, and uses **Apollo Client** to query the **AniList GraphQL public API**. It's responsive from mobile to desktop, deploys to **Vercel (free tier)**, and ships with a lean testing stack (Vitest + React Testing Library, and Playwright for E2E).

A blocking **Dialog** collects **Username** and **Job Title** on first run. Until that is provided, the rest of the app---and any network calls---remain inaccessible by design. The info is persisted, deep links are supported, and the footer permanently shows **"Challenge Version 3.5."**

---

## Time & Effort

| Phase                  | Focus                                                                                                                                                | Duration |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| Initial research       | Compared candidate APIs, studied AniList schema and image fields, confirmed auth (public), weighed Zod, set target a11y (WCAG 2.2 AA), scoped tests. | ~30 min  |
| Spec writing (SDD)     | Wrote the spec: requirements, user stories, two-page flow, data model, queries, retry & caching, security, perf budget, directory layout.            | ~45 min  |
| Preparing SpecKit      | Structured the spec so SpecKit could generate in phases with guardrails and explicit acceptance criteria.                                            | ~15 min  |
| AI build + review loop | Let AI scaffold and implement; I reviewed diffs, ran locally, debugged edge cases, and guided corrections (manual fixes where necessary).            | ~1 hr    |
| Polish & ship          | UI adjustments, Playwright golden-path pass, a few extra tests, deployment and README.                                                               | ~1 hr    |

**Total:** ~3.5hours. Core implementation fit the recommended window; extra time went into spec quality, testing breadth, and deployment hardening.

---

## Methodology

I used **Spec-Driven Development (SDD)** with **SpecKit**, and run it with **Cursor IDE**. The spec captured user journeys, page flows, data models, non-functional goals (a11y AA; TTI < 1s), and guardrails (no data before profile gate, minimal dependencies). SpecKit turned this into phased tasks and structured prompts so AI output stayed inside the plan. I acted as reviewer/maintainer, correcting inaccuracies and enforcing the spec.

---

## Stack & Key Choices

- **Framework & Lang:** Next.js (App Router) + React + TypeScript
- **UI & Styling:** Tailwind CSS + shadcn/ui (Dialog, Card, Button, Pagination, etc.)
- **Data & Client:** AniList **public** GraphQL via **Apollo Client**
- **Validation:** **Zod** for runtime validation at app boundaries (profile read/write and selected GraphQL response fields)
- **Type generation:** **GraphQL Code Generator** produces **operation types** and **generated React Apollo hooks** from AniList's schema (no base schema types emitted). This gives compile-time safety for variables/results and a smooth DX with typed hooks.
- **Testing:** Vitest + React Testing Library (unit/component), Playwright (E2E)
- **Deployment:** Vercel (free tier) with preview builds
- **Dependencies:** Minimal---Next.js, React, TS, Apollo, Tailwind, shadcn/ui, Zod, Playwright, Vitest, RTL

---

## Product Shape

### First-Run Blocking Gate

On initial visit, a **shadcn/ui Dialog** blocks the app until the user provides **Username** and **Job Title**. Until saved, no data is fetched and the rest of the UI is inaccessible. After submit, the profile persists (details below) and the UI unlocks.

### Information Page (Browse)

A paginated list backed by AniList GraphQL. Items display image, title, and summary. Pagination is **URL-addressable** so users can deep-link a specific page, e.g. `/browse?page=2&perPage=20`. The grid adapts from one column on small screens to multiple cards on wider breakpoints.

### Details Modal

Clicking a card opens a **Dialog** with richer metadata: large cover image, localized titles, status, and start/end dates. It's keyboard-navigable (focus trap, Escape to close) and responsive.

### Footer

Always shows **"Challenge Version 3.5"** and a compact profile affordance to view/edit the stored profile.

---

## Data: Query, Caching, Mapping & Validation

### GraphQL Query (used in the app)

```
query GetAnimePage($page: Int!, $perPage: Int!) {
  Page(page: $page, perPage: $perPage) {
    pageInfo {
      currentPage
      hasNextPage
      perPage
    }
    media(type: ANIME, sort: POPULARITY_DESC) {
      id
      title {
        english
        native
      }
      status
      type
      startDate {
        year
        month
        day
      }
      endDate {
        year
        month
        day
      }
      description(asHtml: false)
      coverImage {
        large
        medium
      }
    }
  }
}
```

I chose this because it reliably returns image URLs (`coverImage.large`/`medium`) and titles in multiple locales. Images render with intrinsic width/height and an `alt` derived from the chosen title to prevent CLS and improve screen reader support.

### Type Generation (graphql-codegen)

I use **GraphQL Code Generator** to emit operation types and **`typescript-react-apollo`** hooks for my `.graphql` documents. Codegen ensures **compile-time** safety (typed variables/results & hook signatures). I still run **Zod** at runtime in the hooks layer before mapping to UI DTOs, so unexpected/null shapes won't break rendering.

### Conditional Fetching

Apollo queries are conditionally enabled **only after** the profile exists. Before that, the blocking Dialog is the only render path.

### Mapping (Network → UI DTO)

```

import { useGetAnimePageQuery } from "@/lib/graphql/generated/operations";
import { MediaItem, MediaItemSchema } from "@/lib/schema";
import type { GetAnimePageQuery } from "@/lib/graphql/generated/operations";

export interface UseMediaPageReturn {
  mediaItems: MediaItem[];
  pageInfo: { hasNextPage: boolean; currentPage: number };
  loading: boolean;
  error: Error | null;
}

// Extract the Media type from GetAnimePageQuery
// This is the proper type for individual media items returned from AniList
type AniListMedia = NonNullable<NonNullable<GetAnimePageQuery["Page"]>["media"]>[number];

/**
 * Transform AniList media object to internal MediaItem format
 * Extracts and normalizes fields from GraphQL response
 * @throws Throws if required fields missing (catches in hook)
 */
function transformToMediaItem(anilistMedia: AniListMedia | null | undefined): MediaItem | null {
  if (!anilistMedia) return null;

  // Transform AniList API response to our internal MediaItem schema
  // Handles field mapping and type conversion
  const item = {
    id: anilistMedia.id?.toString() ?? "",
    engTitle: anilistMedia.title?.english ?? "Unknown", // AniList query only includes english, not romaji
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
    .filter((item): item is AniListMedia => item !== null) // Filter out nulls first
    .map((item) => {
      try {
        return transformToMediaItem(item);
      } catch (err) {
        // Log transformation errors but continue processing other items
        console.error("Failed to transform media item:", item?.id, err);
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
```

This shows the complete path: **typed hook** → **runtime validation (Zod)** → **stable UI DTOs**.

---

## Profile Gate & Persistence

- **Blocking Dialog** collects **Username** and **Job Title** on first run.
- **Persistence:** stored in `localStorage` under key **`user-profile`**.
- **Zod guard:** both writes and reads pass through `ProfileSchema` (`safeParse`). Invalid/legacy data is ignored and the gate reappears with a small hint.
- **Guardrail:** Without a valid profile, queries never fire and pages remain gated. After submission, the app hydrates from storage on reload and stays unlocked.

---

## Accessibility & Performance

- **A11y target:** WCAG **2.2 AA** baseline; AAA where "free" (strong focus outlines, reduced motion support). The Dialog uses `role="dialog"`, labelled fields, focus trap, Escape handling, and a logical tab order. Zod validation surfaces inline, accessible error messages.
- **Perf goal:** **TTI < 1s** on a laptop-class device. Techniques include intrinsic image sizes to avoid CLS, memoization to prevent re-render storms, GraphQL pagination to bound payload size, and Apollo request dedupe. The UI remains responsive on slower networks through progressive rendering and lightweight components.

---

## Testing

- **Unit & Component (Vitest + RTL)**
  - `schema.ts`: Zod `safeParse` happy/edge paths
  - DTO mappers: title fallback, image placeholder, description trimming
  - Dialog & Pagination: keyboard flows, ARIA roles, focus return

- **E2E (Playwright)**
  1. First run shows the blocking profile dialog; invalid input shows Zod errors; valid profile unlocks app and persists.
  2. `/information` loads page 1 with images.
  3. Deep-link `/information?page=2` renders correct page after a hard reload.
  4. Clicking a card opens details Dialog; Esc closes; focus returns to the trigger.
  5. Simulated network error shows friendly error with retry, preserving last good state where applicable.

Follow-ups (out of MVP): broader error/empty state coverage, screenshot/visual checks, Lighthouse CI, and network chaos tests.

---

## Directory Layout

```
app/
  pages.tsx           # Page-level components (router entry points)
lib/
  schema.ts           # Zod models (ProfileSchema, MediaSchema, etc.)
  graphql/            # Apollo client, documents, fragments
  hooks/              # useQuery hooks → validate (Zod) → map to internal DTOs
components/           # Presentation and container components
tests/                # Unit/component tests (Vitest + RTL)
e2e/                  # Playwright specs
```

---

## Notable Trade-offs

- **Runtime validation (Zod)**
  - **Trade-off:** Add Zod at boundaries vs. rely on compile-time types only
  - **Why:** Protects against unexpected/null shapes and forward schema drift at runtime
  - **Cost:** Small perf overhead on parse; minimal code footprint

- **A11y target (AA vs AAA)**
  - **Trade-off:** WCAG 2.2 **AA** baseline with selective **AAA** vs. chasing full AAA everywhere
  - **Why:** Meets inclusivity goals without slowing delivery
  - **Cost:** A few edge criteria deferred (not user-visible in most flows)

- **Type strategy (codegen + DTOs)**
  - **Trade-off:** Generated operation types + hand-rolled UI DTOs vs. using raw GraphQL shapes in components
  - **Why:** Stable, ergonomic props; single place for sanitation/fallbacks
  - **Cost:** Thin mapping layer to maintain

- **Caching approach**
  - **Trade-off:** Apollo in-memory cache + field policies vs. heavier route-level caching/ISR
  - **Why:** Simple, predictable, and enough for this scope
  - **Cost:** No cross-session persistence; can evolve later if needed

### Storage & Networking

- **LocalStorage vs. Cookies (Profile gate)**
  - **Trade-off:** `localStorage` (user-controlled, never sent to server) vs. cookies
  - **Why:** Profile data is **client-only**; no reason to transmit on every request
  - **Cost:** `localStorage` can be unavailable/restricted in some private browsing contexts

- **Pagination: No Prefetching**
  - **Trade-off:** Fetch on-demand only vs. eagerly prefetch next page
  - **Why:** Simplicity and respect AniList rate limits (~90 req/min); avoids wasted bandwidth
  - **Cost:** Slight delay when clicking "Next" (Apollo cache softens repeat visits)

### Content & Safety

- **GraphQL descriptions: plain text by default**
  - **Trade-off:** `description(asHtml: false)` + sanitize when needed vs. always accepting HTML
  - **Why:** Most AniList descriptions are plain text; reduces exposure to unsafe markup
  - **Cost:** Minor overhead when legitimate HTML appears (sanitization + formatting loss possible)

- **Sanitization approach**
  - **Trade-off:** `isomorphic-dompurify` + Zod validation vs. forcing plain text only
  - **Why:** Preserves useful formatting (bold/italics) while preventing XSS on both server & client
  - **Cost:** Small library overhead (~5KB gzipped) and a sanitize step per render path
