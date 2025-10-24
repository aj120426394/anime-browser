# Research: AniList Profile Gate & Information Browser

**Feature**: 001-anilist-profile-gate
**Date**: 2025-10-24
**Purpose**: Research technical decisions, best practices, and patterns for implementation

## 1. Apollo Client Setup with Next.js 15 App Router

### Decision

Use Apollo Client 3.x with React Server Components (RSC) compatibility. Create a client-side Apollo provider wrapper and use `'use client'` directive for components that need `useQuery` hooks.

### Rationale

- Next.js 15 App Router defaults to Server Components, but Apollo hooks require client-side rendering
- Official Apollo guidance for Next.js 13+ recommends wrapping Apollo Provider at the app level
- InMemoryCache with type policies enables efficient pagination caching
- No SSR for GraphQL queries needed (data loads after profile gate on client side)

### Implementation Approach

```typescript
// lib/graphql/client.ts
import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

export const createApolloClient = () => {
  return new ApolloClient({
    link: new HttpLink({
      uri: "https://graphql.anilist.co",
    }),
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            Page: {
              keyArgs: ["page", "perPage"],
              merge(existing, incoming) {
                return incoming; // Replace cache on page change
              },
            },
          },
        },
      },
    }),
  });
};
```

### Alternatives Considered

- **urql**: Lighter weight but less mature pagination support
- **SWR/React Query**: Not GraphQL-specific, would need manual query construction
- **Native fetch**: No caching, error handling, or retry logic built-in

### References

- [Apollo Client Next.js Integration](https://www.apollographql.com/docs/react/integrations/nextjs/)
- [Next.js 15 App Router Data Fetching](https://nextjs.org/docs/app/building-your-application/data-fetching)

---

## 2. GraphQL Code Generator Configuration

### Decision

Use `@graphql-codegen/cli` with `@graphql-codegen/typescript` and `@graphql-codegen/typescript-react-apollo` plugins to generate TypeScript types and typed hooks from AniList schema.

### Rationale

- Eliminates manual type definitions for GraphQL responses
- Provides type-safe hooks (e.g., `usePageQuery`) with autocomplete
- Performs schema introspection at build time, not runtime (performance & security)
- Catches schema mismatches at compile time

### Implementation Approach

```yaml
# codegen.yml
schema: https://graphql.anilist.co
documents: "lib/graphql/**/*.graphql"
generates:
  lib/graphql/generated/schema.ts:
    plugins:
      - typescript
  lib/graphql/generated/operations.ts:
    plugins:
      - typescript
      - typescript-operations
      - typescript-react-apollo
    config:
      withHooks: true
      withComponent: false
```

### Alternatives Considered

- **Manual type definitions**: Error-prone, no autocomplete, requires manual updates
- **Runtime introspection**: Performance overhead, exposes schema to client
- **TypeScript only (no codegen)**: Loses type safety for GraphQL operations

### References

- [GraphQL Code Generator Documentation](https://the-guild.dev/graphql/codegen)
- [AniList GraphQL Schema](https://github.com/AniList/ApiV2-GraphQL-Docs)

---

## 3. Accessibility Patterns for Modals (WCAG AA)

### Decision

Use shadcn/ui Dialog component (built on Radix UI) with proper focus trap, keyboard navigation, and ARIA attributes.

### Rationale

- Radix UI Dialog implements WCAG AA requirements out-of-the-box
- Automatic focus management (focus trap when open, restore focus on close)
- Keyboard support (ESC to close, Tab cycles within modal)
- ARIA attributes (role="dialog", aria-modal="true", aria-labelledby, aria-describedby)

### Implementation Approach

```typescript
// components/MediaModal.tsx
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent>
    <DialogTitle>{media.title.english || media.title.native}</DialogTitle>
    <DialogDescription>{/* Sanitized description */}</DialogDescription>
    {/* Modal content */}
  </DialogContent>
</Dialog>;
```

### Key Accessibility Features

- Focus trap: Users cannot Tab outside modal while open
- Keyboard navigation: ESC closes, Tab cycles through interactive elements
- Screen reader support: Announces dialog role and content
- Overlay click: Closes modal (configurable)
- Focus restoration: Returns focus to trigger element on close

### Alternatives Considered

- **Custom modal implementation**: High risk of accessibility bugs
- **React Modal**: Good but shadcn/ui provides better Next.js integration
- **Headless UI**: Similar quality but shadcn/ui already chosen for project

### References

- [Radix UI Dialog Documentation](https://www.radix-ui.com/docs/primitives/components/dialog)
- [WCAG 2.1 Modal Dialog Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
- [shadcn/ui Dialog Component](https://ui.shadcn.com/docs/components/dialog)

---

## 4. localStorage with SSR Safety in Next.js

### Decision

Create a storage utility that checks for `window` availability before accessing localStorage. Use `useEffect` for client-side hydration of localStorage data.

### Rationale

- Next.js App Router renders components on server first (SSR)
- `localStorage` is not available on server, causes runtime errors
- Need defensive checks to prevent SSR/hydration mismatches
- Profile data only needed on client side (no SEO benefit to SSR it)

### Implementation Approach

```typescript
// lib/storage.ts
export const getProfile = (): Profile | null => {
  if (typeof window === "undefined") return null; // SSR safety

  const data = localStorage.getItem("user-profile");
  if (!data) return null;

  try {
    const parsed = JSON.parse(data);
    return ProfileSchema.parse(parsed); // Zod validation
  } catch {
    return null;
  }
};

// components/ProfileForm.tsx - usage in component
const [profile, setProfile] = useState<Profile | null>(null);

useEffect(() => {
  setProfile(getProfile()); // Client-side only
}, []);
```

### Alternatives Considered

- **Cookies**: Unnecessary server-side transmission, larger payload
- **IndexedDB**: Overkill for simple key-value storage
- **sessionStorage**: Data lost on tab close (requirement is persistence)

### References

- [Next.js SSR Considerations](https://nextjs.org/docs/messages/react-hydration-error)
- [Web Storage API Best Practices](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API)

---

## 5. HTML Sanitization for AniList Descriptions

### Decision

Use DOMPurify library to sanitize HTML from AniList API before rendering. Request `description(asHtml: false)` to get plain text when possible.

### Rationale

- AniList descriptions may contain HTML markup (rare but possible)
- XSS prevention is a constitutional requirement
- DOMPurify is industry-standard, well-maintained, and lightweight
- Requesting plain text reduces need for sanitization in most cases

### Implementation Approach

```typescript
import DOMPurify from "isomorphic-dompurify"; // Works in SSR and client

// lib/utils/sanitize.ts
export const sanitizeHTML = (html: string): string => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ["b", "i", "em", "strong", "br", "p"],
    ALLOWED_ATTR: [],
  });
};

// components/MediaModal.tsx - usage
<DialogDescription>{sanitizeHTML(media.description)}</DialogDescription>;
```

### Alternatives Considered

- **Plain text only**: Loses legitimate formatting (bold, italics)
- **React dangerouslySetInnerHTML without sanitization**: Security vulnerability
- **Manual regex sanitization**: Error-prone, incomplete coverage

### References

- [DOMPurify Documentation](https://github.com/cure53/DOMPurify)
- [OWASP XSS Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)

---

## 6. Rate Limiting and Retry Strategy for AniList API

### Decision

Configure Apollo Link with exponential backoff retry logic for 429 (rate limit) and 5xx errors. Implement retry delays: 250ms → 500ms → 1s (max 3 attempts).

### Rationale

- AniList API has 90 requests/min limit (public endpoints)
- Transient failures (network issues, API hiccups) should retry automatically
- Exponential backoff prevents overwhelming the API during outages
- User experience improved with transparent retry (no error for temporary issues)

### Implementation Approach

```typescript
import { RetryLink } from "@apollo/client/link/retry";
import { onError } from "@apollo/client/link/error";

const retryLink = new RetryLink({
  delay: {
    initial: 250,
    max: 1000,
    jitter: true,
  },
  attempts: {
    max: 3,
    retryIf: (error, _operation) => {
      // Retry on network errors or rate limits
      return !!error && (error.statusCode === 429 || error.statusCode >= 500);
    },
  },
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    // Log for debugging
  }
  if (networkError) {
    // Show user-friendly error message
  }
});
```

### Alternatives Considered

- **No retry logic**: Poor UX on transient failures
- **Fixed delay retry**: Less efficient than exponential backoff
- **Immediate retry**: Can trigger rate limits faster

### References

- [Apollo Client Error Handling](https://www.apollographql.com/docs/react/data/error-handling/)
- [AniList API Rate Limiting](https://anilist.gitbook.io/anilist-apiv2-docs/overview/rate-limiting)

---

## 7. Pagination Strategy with URL Synchronization

### Decision

Use Next.js `useSearchParams` and `useRouter` to sync pagination state with URL query parameters. Apollo cache handles data caching per page.

### Rationale

- Deep linking requirement mandates URL reflects current page
- Browser back/forward navigation works correctly
- Shareable URLs for specific pages
- Next.js provides built-in hooks for query parameter management

### Implementation Approach

```typescript
// lib/hooks/usePagination.ts
import { useSearchParams, useRouter } from "next/navigation";

export const usePagination = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    router.push(`/information?${params.toString()}`);
  };

  return { currentPage, goToPage };
};
```

### Alternatives Considered

- **React state only**: No deep linking, URLs not shareable
- **Hash routing (#page=5)**: Works but query params are more semantic
- **Manual history.pushState**: More complex than Next.js hooks

### References

- [Next.js useSearchParams](https://nextjs.org/docs/app/api-reference/functions/use-search-params)
- [URL Query Parameters Best Practices](https://www.nngroup.com/articles/query-parameters/)

---

## 8. Responsive Grid Layout Strategy

### Decision

Use Tailwind CSS grid utilities with responsive breakpoints: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4` for MediaGrid component.

### Rationale

- Mobile-first approach (1 column by default)
- Tailwind breakpoints align with common device sizes
- CSS Grid provides flexible, responsive layouts without JavaScript
- Automatic reflow on window resize

### Implementation Approach

```tsx
// components/MediaGrid.tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
  {mediaItems.map((item) => (
    <MediaCard key={item.id} media={item} />
  ))}
</div>
```

### Breakpoints

- Mobile: < 768px → 1 column
- Tablet: 768px-1023px → 2 columns
- Desktop: 1024px-1279px → 3 columns
- Large desktop: ≥ 1280px → 4 columns

### Alternatives Considered

- **Flexbox**: Less predictable column behavior
- **Custom media queries**: More verbose than Tailwind utilities
- **Fixed grid (no responsiveness)**: Fails mobile requirement

### References

- [Tailwind CSS Grid](https://tailwindcss.com/docs/grid-template-columns)
- [CSS Grid Layout Guide](https://css-tricks.com/snippets/css/complete-guide-grid/)

---

## 9. Image Optimization with Next.js Image Component

### Decision

Use Next.js `<Image>` component with `fill` or fixed dimensions for cover images. Enable lazy loading for off-screen images.

### Rationale

- Automatic image optimization (WebP, responsive sizes)
- Lazy loading reduces initial page load time
- CLS prevention with explicit dimensions
- CDN integration (Vercel's image optimization service)

### Implementation Approach

```tsx
// components/MediaCard.tsx
import Image from "next/image";

<div className="relative h-64 w-full">
  <Image
    src={media.imageMedium}
    alt={media.engTitle || media.nativeTitle}
    fill
    className="object-cover rounded-lg"
    loading="lazy"
    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
  />
</div>;
```

### Alternatives Considered

- **Standard `<img>` tag**: No optimization, no lazy loading
- **Manual lazy loading**: More complex, less efficient
- **Third-party image CDN**: Unnecessary with Vercel deployment

### References

- [Next.js Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)
- [Web.dev Image Best Practices](https://web.dev/fast/#optimize-your-images)

---

## 10. Testing Strategy

### Decision

Three-tier testing approach:

1. **Unit tests** (Vitest): Storage utils, Zod schemas, data transformations
2. **Component tests** (RTL + Vitest): All React components in isolation
3. **E2E tests** (Playwright): Critical user journeys (profile → data → pagination)

### Rationale

- Unit tests catch logic errors early (fast feedback)
- Component tests verify rendering and interactions
- E2E tests ensure complete user flows work end-to-end
- Constitution requires comprehensive test coverage

### Implementation Approach

```typescript
// tests/unit/storage.test.ts
describe("getProfile", () => {
  it("returns null when localStorage is empty", () => {
    expect(getProfile()).toBeNull();
  });

  it("validates profile data with Zod", () => {
    localStorage.setItem("user-profile", JSON.stringify({ username: "test" }));
    expect(getProfile()).toBeNull(); // Missing jobTitle
  });
});

// tests/components/ProfileForm.test.tsx
describe("ProfileForm", () => {
  it("shows validation errors on empty submit", () => {
    render(<ProfileForm />);
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));
    expect(screen.getByText(/username is required/i)).toBeInTheDocument();
  });
});

// e2e/profile-gate.spec.ts
test("blocks access until profile submitted", async ({ page }) => {
  await page.goto("/information");
  await expect(page).toHaveURL("/"); // Redirected to gate

  await page.fill('[name="username"]', "TestUser");
  await page.fill('[name="jobTitle"]', "Developer");
  await page.click('button[type="submit"]');

  await expect(page).toHaveURL("/information?page=1");
});
```

### Alternatives Considered

- **Jest instead of Vitest**: Vitest is faster and better integrated with Vite/Next.js
- **Cypress instead of Playwright**: Playwright has better TypeScript support
- **No E2E tests**: Fails to validate complete user journeys

### References

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)

---

## Summary

All technical decisions align with the project constitution and resolve implementation uncertainties. No blocking clarifications remain. Ready to proceed to Phase 1 (data model, contracts, quickstart documentation).
