# Prompt use in Spec-kit

## Constitution

```
- Document the code appropriately
- React + Next.js 15 (App Router).
- Use shadcn/ui and Tailwind CSS for UI elements and styling
- Responsive design, mobile-first
- Use Apollo client to query Graphql API
- TS strict mode; runtime validation with Zod for all external inputs.
- A11y: WCAG AA; keyboard-first interactions; reasonable color contrast
- Testing: Vitest + RTL (unit), Playwright (e2e); CI must pass lint/type/test.
- Performance: paginated fetchs, avoid fetching large pages. initial TTI <1s on mid-tier.
- Use few dependencies as possible, only use those are necessary.
- No secrets required; do not store sensitive data; sanitize any HTML from API before rendering; avoid SSR leaking localStorage-only data.
```

## Spec

```
Goal: Gate access until user provides profile (username, job title). Then show paginated AniList data with images on an “Information Page”, deep-linkable via ?page=, with item modals. Footer shows challenge version. Deploy on Vercel.

# Key user stories
1. As a first-time visitor, I must be blocked from content until I submit a username and job title.
2. As a user, I can see, edit, and persist my profile locally.
3. As a user, I can open /information?page=N directly and see that page of results once I’m unblocked.
4. As a user, I can click an item to see details in a modal.
5. As a user, I can use the app comfortably on mobile and desktop.
6. As a reviewer, I can see the challenge version in the footer on all pages.

# Non-functional
- A11y AA
- SSR friendly
- Documentation
	- Inline comments explain non-obvious logic
	- README explains install, run, build, deaploy, and architecture choices.
```

## Plan

```
Architecture
- Next.js 15 (App Router) + Typescript
- Routing:
	- Uses `/app` directory with route segemtns (`/`, `/infomration`)
- Responsiviness:
	- Infomration grid colapses to 1-col on mobile and multi-col on desktop
	- Modal adn form are usable on samll screens
- UI:
	- Global footer: shows "Challenge version v3.5"
	- Blocked:
		- Layout: 2 input filed in form, make sure user able to see the info in full after enter them
		- Key point
			- On first load, a blocking dialog/page prevents navigation/content until profile is saved.
			- Form collects username and job title, both required.
			- Persist username and job title in local storage after sumit is clicked. Make sure it's showing the persisted value when it's reload
			- Users can view their stored profile and edit it later.
	- Info page:
		- Layout: paginated table in the center
		- Key point:
			- Only start loading data when the username and job title are entered (can be loaded from localstorage). No request is issued until profile exists (skip: true or equivalent).
			- Renders a grid list with at least a dozen items per page (configurable).
			- Each list itme show medium Image, title in english and title in native
			- Visiting /information?page=N loads page N (after unblocked).
			- Invalid page defaults to 1.
			- Next/Previous controls update the page param.
			- Only show near by 4 page index (prev 2, next 2) and first page / last page in the page button. Use `...` to represent if there is more.
			- Clicking an item opens a modal with lage image, title, status, type, startDate, endDate and description (sanitized).
			- Modal is keyboard navigable and closable via ESC and overlay click.
- GraphQL
	- Use Apollo Client to query data from GraphQL API (https://graphql.anilist.co)
	- Use GraphQL Code Generator during development to perform schema introspection on AniList and generate TypeScript types and typed hooks. Avoid runtime introspection in the browser for performance and security.
	- Use AniList `Page(page, perPage)` to fetch `media`
	- Auth and Networking
		- Unauthenticated Mode: Most AniList queries are publicly accessible. Directly send POST JSON requests to `/graphql`.
	  - Rate Limiting: Respect AniList’s 90 requests/min limit. Configure Apollo Link with retry/backoff (for 429 or network errors: 250 ms → 500 ms → 1 s max). Use caching and query batching to minimize requests.
  - Caching and Pagination
	  - Enable `typePoliceis` on InMemoryCache:
  - AniList Schema
	  - Page `{pageInfo: PageInfo, media: Media}`
	  - PageInfo `{currentPage: Int, hasNextPage: Boolean, perPage: Int}`
	  - Media `{id: Int!, title: MediaTitle, description: String, type: MediaType, coverImage: MediaCoverImage, status: MediaStatus, startDate:FuzzyDate, endDate:FuzzyDate}`
	  - MediaTitle `{english:String, native:String}`
	  - MediaType `enum(ANIME, MANGA)`
	  - MediaStatus `enum(FINISHED, RELEASING, NO_YET_RELEASED, CANCELLED, HIATUS)`
	  - MediaCoverImage: `{large:string, medium:string}`
	  - FuzzyDate `{year: Int, month: Int, day: Int}`
  - AniListQuery:
```

    	Page (page: $page, perPage: $perPage) {
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
    			  startDate
    			  endData
    			  description(asHtml: false)
    			  type
    			  coverImage {
    				  large
    				  medium
    			  }
    		  }
    	  }
    	```

- Data model
  - Profile: `{username: string, jobTitle: string}` persisted in localStorage under a stable key.
  - Page: `{pageInfo: PageInfo, mediaItems: [MediaItem]}`
  - PageInfo `{curentPage: number, hasNextPage: boolean, perPage: number}`
  - MediaItem `{id: string, engTitle: string, nativeTitle: string, status: string, startDate: Date, end: Date, description: string, type: string, imageMedium: string, imageLarge: string}`

- Testing:
  - Unit
  - Component: Every component
  - e2e: enter text -> sumbit text -> load data from data source -> pagination
- Perf
  - state updates;
  - avoid re-render storms
- Directory layout:
  app/
  pages.tsx # All the page commponent sit.
  lib/
  schema.ts #zod models
  graphql/ # Anything graphQL related.
  hooks/ # Hooks that do useQuery to fetch API and tranform data to internal DTO (eg. Media -> MediaItem)
  components/ # All the components sit
  tests/ # All the unit test sit
  e2e/ # All the e2e test sit

```

```
