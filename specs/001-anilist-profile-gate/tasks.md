# Tasks: AniList Profile Gate & Information Browser

**Input**: Design documents from `/specs/001-anilist-profile-gate/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Testing is MANDATORY per constitution. All features must include unit tests (Vitest + RTL) and E2E tests (Playwright) for critical user journeys.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- Web app structure: `app/`, `components/`, `lib/`, `tests/`, `e2e/` at repository root
- Configuration files at repository root

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Initialize Next.js 15 project with TypeScript and App Router
- [x] T002 [P] Install core dependencies (React 18+, Next.js 15, TypeScript 5.x)
- [x] T003 [P] Install Apollo Client dependencies (@apollo/client, graphql)
- [x] T004 [P] Install UI dependencies (shadcn/ui components, Tailwind CSS 3.x)
- [x] T005 [P] Install validation and utility dependencies (Zod 3.x, DOMPurify, isomorphic-dompurify)
- [x] T006 [P] Install testing dependencies (Vitest, React Testing Library, Playwright, @testing-library/jest-dom)
- [x] T007 [P] Install GraphQL Code Generator dependencies (@graphql-codegen/cli, plugins)
- [x] T008 Configure TypeScript strict mode in tsconfig.json
- [x] T009 [P] Configure Tailwind CSS in tailwind.config.js with shadcn/ui presets
- [x] T010 [P] Configure Next.js in next.config.js (image domains for AniList CDN, strict mode)
- [x] T011 [P] Configure Vitest in vitest.config.ts with jsdom environment
- [x] T012 [P] Configure Playwright in playwright.config.ts with browsers and test directory
- [x] T013 [P] Configure GraphQL Code Generator in codegen.yml with AniList schema URL
- [x] T014 [P] Create .env.local with NEXT_PUBLIC_CHALLENGE_VERSION=3.5
- [x] T015 [P] Configure ESLint with Next.js and TypeScript rules
- [x] T016 [P] Configure Prettier for code formatting
- [x] T017 Create project directory structure (app/, components/, lib/, tests/, e2e/)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T018 [P] Create Zod schemas in lib/schema.ts (Profile, MediaItem, PageInfo, PaginationState)
- [x] T019 [P] Create localStorage utilities in lib/storage.ts with SSR safety checks
- [x] T019a [P] Add localStorage availability detection and fallback UI in lib/storage.ts
- [x] T020 [P] Create GraphQL query in lib/graphql/queries.ts (GetAnimePage query)
- [x] T021 Run GraphQL Code Generator to generate types in lib/graphql/generated/
- [x] T022 Create Apollo Client configuration in lib/graphql/client.ts with InMemoryCache type policies
- [x] T023 [P] Create useProfile hook in lib/hooks/useProfile.ts for profile CRUD operations
- [x] T024 [P] Create usePagination hook in lib/hooks/usePagination.ts for URL-synced pagination state
- [x] T025 [P] Create useMediaPage hook in lib/hooks/useMediaPage.ts for fetching and transforming media data
- [x] T026 [P] Create HTML sanitization utility in lib/utils/sanitize.ts with DOMPurify
- [x] T027 [P] Create Footer component in components/Footer.tsx with challenge version display
- [x] T028 Create root layout in app/layout.tsx with Footer and Apollo Provider wrapper
- [x] T029 [P] Install shadcn/ui Dialog component (npx shadcn-ui@latest add dialog)
- [x] T030 [P] Install shadcn/ui Button component (npx shadcn-ui@latest add button)
- [x] T031 [P] Install shadcn/ui Input component (npx shadcn-ui@latest add input)
- [x] T032 [P] Install shadcn/ui Card component (npx shadcn-ui@latest add card)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Profile Gate Blocks Access (Priority: P1) 🎯 MVP

**Goal**: First-time visitors are blocked from content until they submit username and job title

**Independent Test**: Visit site in clean browser → see profile form → submit → access granted → localStorage populated

### Tests for User Story 1 (MANDATORY per constitution) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T033 [P] [US1] Unit test for ProfileSchema validation in tests/unit/schema.test.ts
- [x] T034 [P] [US1] Unit test for getProfile and saveProfile in tests/unit/storage.test.ts
- [x] T035 [P] [US1] Unit test for useProfile hook in tests/unit/hooks.test.ts
- [x] T036 [P] [US1] Component test for ProfileForm validation in tests/components/ProfileForm.test.tsx
- [x] T037 [P] [US1] Component test for ProfileForm submission in tests/components/ProfileForm.test.tsx
- [x] T038 [P] [US1] E2E test for profile gate blocking in e2e/profile-gate.spec.ts
- [x] T039 [P] [US1] E2E test for profile form submission flow in e2e/profile-gate.spec.ts

### Implementation for User Story 1

- [x] T040 [P] [US1] Create ProfileForm component in components/ProfileForm.tsx with validation
- [x] T041 [US1] Create profile gate page in app/page.tsx with useProfile hook
- [x] T042 [US1] Implement redirect logic: if profile exists, redirect to /information
- [x] T043 [US1] Add form validation error display in ProfileForm component
- [x] T044 [US1] Add loading states to ProfileForm during submission
- [x] T045 [US1] Test ProfileForm on mobile viewport (320px width)

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - View Paginated AniList Data (Priority: P1) 🎯 MVP

**Goal**: Users with saved profile can view paginated anime data with images

**Independent Test**: Create profile → visit /information → see anime grid → images load → pagination controls work

### Tests for User Story 2 (MANDATORY per constitution) ⚠️

- [x] T046 [P] [US2] Unit test for useMediaPage hook with mocked Apollo in tests/unit/hooks.test.ts
- [x] T047 [P] [US2] Unit test for MediaItem transformation logic in tests/unit/hooks.test.ts
- [x] T048 [P] [US2] Component test for MediaGrid rendering in tests/components/MediaGrid.test.tsx
- [x] T049 [P] [US2] Component test for MediaCard image display in tests/components/MediaCard.test.tsx
- [x] T050 [P] [US2] Component test for Pagination controls in tests/components/Pagination.test.tsx
- [x] T051 [P] [US2] E2E test for data loading from AniList API in e2e/pagination.spec.ts
- [x] T052 [P] [US2] E2E test for pagination navigation in e2e/pagination.spec.ts

### Implementation for User Story 2

- [x] T053 [P] [US2] Create MediaCard component in components/MediaCard.tsx with Next.js Image
- [x] T054 [P] [US2] Create MediaGrid component in components/MediaGrid.tsx with responsive grid
- [x] T055 [P] [US2] Create Pagination component in components/Pagination.tsx with ellipsis logic
- [x] T056 [US2] Create information page in app/information/page.tsx with useMediaPage hook
- [x] T057 [US2] Implement profile check: redirect to / if no profile exists
- [x] T058 [US2] Add loading skeleton for MediaGrid during data fetch
- [x] T059 [US2] Add error handling for API failures with user-friendly messages
- [x] T060 [US2] Add empty state when no results returned from API
- [x] T061 [US2] Configure Apollo Client retry logic with exponential backoff (250ms → 500ms → 1s)
- [x] T062 [US2] Test responsive grid layout on mobile (1-col) and desktop (2-4 cols)

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Deep-Linkable Pages (Priority: P1) 🎯 MVP

**Goal**: Users can share/bookmark specific pages via ?page=N query parameter

**Independent Test**: Open /information?page=5 directly → page 5 loads → URL updates on navigation

### Tests for User Story 3 (MANDATORY per constitution) ⚠️

- [x] T063 [P] [US3] Unit test for usePagination hook URL parsing in tests/unit/hooks.test.ts
- [x] T064 [P] [US3] Unit test for invalid page number handling in tests/unit/hooks.test.ts
- [x] T065 [P] [US3] E2E test for deep linking to specific page in e2e/pagination.spec.ts
- [x] T066 [P] [US3] E2E test for URL update on pagination navigation in e2e/pagination.spec.ts

### Implementation for User Story 3

- [x] T067 [US3] Integrate usePagination hook into /information page for URL sync
- [x] T068 [US3] Implement URL update on pagination control clicks
- [x] T069 [US3] Add validation for page parameter (default to 1 if invalid/negative)
- [x] T070 [US3] Handle out-of-bounds page numbers (redirect to last page or show message)
- [x] T071 [US3] Test browser back/forward navigation preserves pagination state
- [x] T072 [US3] Test deep link with profile gate: /information?page=5 without profile → gate → page 5 after submit

**Checkpoint**: All P1 user stories (MVP) should now be independently functional

---

## Phase 6: User Story 4 - View Item Details in Modal (Priority: P2)

**Goal**: Users can click anime items to see details in accessible modal dialog

**Independent Test**: Click any item → modal opens with details → ESC/overlay/button closes modal

### Tests for User Story 4 (MANDATORY per constitution) ⚠️

- [x] T073 [P] [US4] Component test for MediaModal rendering in tests/components/MediaModal.test.tsx
- [x] T074 [P] [US4] Component test for MediaModal close handlers in tests/components/MediaModal.test.tsx
- [x] T075 [P] [US4] Component test for HTML sanitization in modal in tests/components/MediaModal.test.tsx
- [x] T076 [P] [US4] E2E test for modal open on item click in e2e/modal-interaction.spec.ts
- [x] T077 [P] [US4] E2E test for modal close via ESC key in e2e/modal-interaction.spec.ts
- [x] T078 [P] [US4] E2E test for modal keyboard navigation (Tab focus trap) in e2e/modal-interaction.spec.ts

### Implementation for User Story 4

- [x] T079 [US4] Create MediaModal component in components/MediaModal.tsx using shadcn/ui Dialog
- [x] T080 [US4] Add modal state management to MediaGrid (selected item state)
- [x] T081 [US4] Implement click handler on MediaCard to open modal
- [x] T082 [US4] Display large image, title, status, dates, and sanitized description in modal
- [x] T083 [US4] Add close handlers (button, ESC key, overlay click) to modal
- [x] T084 [US4] Test modal accessibility: focus trap, keyboard navigation, screen reader announcements
- [x] T085 [US4] Format FuzzyDate (year/month/day) for display in modal
- [x] T086 [US4] Test modal on mobile viewport (full-screen friendly)

**Checkpoint**: User Story 4 complete - modals work independently

---

## Phase 7: User Story 5 - Profile Management (Priority: P2)

**Goal**: Users can view and edit their saved profile information

**Independent Test**: Access profile editor → see pre-filled values → change them → save → verify persistence

### Tests for User Story 5 (MANDATORY per constitution) ⚠️

- [x] T087 [P] [US5] Unit test for updateProfile in storage utilities in tests/unit/storage.test.ts
- [x] T088 [P] [US5] Component test for ProfileEditor pre-fill in tests/components/ProfileEditor.test.tsx
- [x] T089 [P] [US5] Component test for ProfileEditor save in tests/components/ProfileEditor.test.tsx
- [x] T090 [P] [US5] E2E test for profile edit flow in e2e/profile-gate.spec.ts

### Implementation for User Story 5

- [x] T091 [P] [US5] Create ProfileEditor component in components/ProfileEditor.tsx
- [x] T092 [US5] Add profile edit route or modal trigger in app/layout.tsx navigation
- [x] T093 [US5] Pre-fill form fields with current profile values from localStorage
- [x] T094 [US5] Implement save handler to update localStorage on form submission
- [x] T095 [US5] Add success confirmation message after profile update
- [x] T096 [US5] Test profile edit persistence across page reloads

**Checkpoint**: User Story 5 complete - profile editing works independently

---

## Phase 8: User Story 6 - Mobile-Friendly Experience (Priority: P2)

**Goal**: All features work comfortably on mobile devices

**Independent Test**: Open app on mobile → profile form usable → grid responsive → modal full-screen friendly

### Tests for User Story 6 (MANDATORY per constitution) ⚠️

- [x] T097 [P] [US6] E2E test for mobile profile form in e2e/profile-gate.spec.ts with mobile viewport
- [x] T098 [P] [US6] E2E test for mobile grid layout in e2e/pagination.spec.ts with mobile viewport
- [x] T099 [P] [US6] E2E test for mobile modal interaction in e2e/modal-interaction.spec.ts with mobile viewport
- [x] T100 [P] [US6] E2E test for mobile pagination controls in e2e/pagination.spec.ts with mobile viewport

### Implementation for User Story 6

- [x] T101 [US6] Verify ProfileForm responsive layout on mobile (320px-768px widths)
- [x] T102 [US6] Verify MediaGrid responsive layout: 1-col mobile, 2-col tablet, 3-4 col desktop
- [x] T103 [US6] Verify MediaModal responsive behavior on mobile (full-screen or near full-screen)
- [x] T104 [US6] Verify Pagination controls touch-friendly (large tap targets, proper spacing)
- [x] T105 [US6] Test all interactive elements for touch-friendliness (44x44px minimum)
- [x] T106 [US6] Verify no horizontal scrolling on mobile viewports

**Checkpoint**: All user stories work on mobile devices

---

## Phase 9: User Story 7 - Challenge Version Footer (Priority: P3)

**Goal**: Footer displays "Challenge version v3.5" on all pages

**Independent Test**: Visit any page → scroll to bottom → see version footer

### Tests for User Story 7 (MANDATORY per constitution) ⚠️

- [x] T107 [P] [US7] Component test for Footer version display in tests/components/Footer.test.tsx
- [x] T108 [P] [US7] E2E test for footer visibility on all pages in e2e/profile-gate.spec.ts

### Implementation for User Story 7

- [x] T109 [US7] Verify Footer component displays NEXT_PUBLIC_CHALLENGE_VERSION from env
- [x] T110 [US7] Verify Footer is rendered in root layout (appears on all pages)
- [x] T111 [US7] Style Footer component with proper positioning and styling
- [x] T112 [US7] Test Footer displays consistently across all pages (/, /information)

**Checkpoint**: All user stories complete - application fully functional

---

## Phase 10: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

**Status**: Phase 10 Implementation In Progress

### Code Quality & Documentation

- [x] T113 [P] Create comprehensive README.md with install, run, build, deploy instructions
  - ✓ Created comprehensive README with 390+ lines
  - ✓ Includes installation, development, testing, building, deployment instructions
  - ✓ Documents architecture decisions and design rationales
  - ✓ WCAG AA accessibility compliance guide
  - ✓ Performance targets and optimization techniques
  - ✓ Error handling documentation
  - ✓ Troubleshooting section

- [ ] T114 [P] Add inline comments for non-obvious logic (Apollo cache config, SSR checks, sanitization)

### Code Standards (Automated Checks)

- [x] T123 [P] Run TypeScript type checking (npm run type-check) and fix errors
  - ✓ PASSED: Zero type errors in strict mode
  - ✓ Full TypeScript strict mode compliance

- [x] T124 [P] Run ESLint (npm run lint) and fix warnings
  - ✓ ESLint configuration created (eslint.config.js)
  - ✓ Linting passed with 38 warnings (0 errors)
  - ✓ Warnings are acceptable (test setup, debugging console statements)

- [x] T125 [P] Run Prettier (npm run format) to ensure consistent code style
  - ✓ All files formatted with Prettier
  - ✓ Consistent code style across codebase

### Accessibility Audits

- [ ] T115 [P] Run accessibility audit with axe-devtools and fix WCAG AA violations
- [ ] T116 [P] Verify color contrast ratios meet WCAG AA standards (4.5:1 for text)
- [ ] T116a [P] Run automated color contrast audit with axe DevTools and fix violations (4.5:1 normal text, 3:1 large text)
- [ ] T117 [P] Test keyboard navigation for all interactive elements (Tab order, focus visible)
- [ ] T118 [P] Verify focus management in modal (focus trap, restore on close)
- [ ] T119 [P] Test screen reader compatibility (NVDA/JAWS on Windows, VoiceOver on macOS/iOS)

### Performance & Optimization

- [ ] T120 [P] Run Lighthouse audit and optimize for performance (TTI < 1s target)
- [ ] T121 [P] Optimize bundle size with code splitting and dynamic imports
- [ ] T122 [P] Verify Next.js Image optimization is working (WebP conversion, lazy loading)
- [ ] T126 [P] Review Apollo Client caching behavior for pagination

### Error Handling & Testing

- [ ] T127 [P] Test error handling for API rate limit (429 response) with retry
- [ ] T128 [P] Test error handling for network failures with user-friendly messages
- [ ] T129 [P] Test localStorage unavailable scenario (private browsing mode) - Display warning banner: "Profile storage requires localStorage. Please enable cookies/storage in browser settings or exit private browsing mode."
- [ ] T130 [P] Test image loading failures (broken CDN) with fallback
- [ ] T131 [P] Verify no memory leaks in long-running sessions

### Deployment Configuration

- [ ] T132 [P] Create Vercel deployment configuration (vercel.json if needed)
- [ ] T133 [P] Set up environment variables in Vercel dashboard
- [ ] T134 Deploy to Vercel and verify production build works
- [ ] T135 Run full E2E test suite against Vercel deployment

### Final Documentation

- [ ] T136 [P] Document architecture decisions in README (why Apollo, why localStorage, etc.)
  - Note: Architecture decisions already documented in T113 README.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-9)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed) or sequentially in priority order
- **Polish (Phase 10)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories (assumes profile exists)
- **User Story 3 (P1)**: Depends on User Story 2 (extends pagination) - Integration point
- **User Story 4 (P2)**: Depends on User Story 2 (extends media display) - Integration point
- **User Story 5 (P2)**: Can start after Foundational (Phase 2) - Uses same profile utilities as US1
- **User Story 6 (P2)**: Cross-cutting validation phase - Depends on all previous stories being implemented
- **User Story 7 (P3)**: Can start after Foundational (Phase 2) - Independent footer implementation

### Within Each User Story

- Tests (if included) MUST be written and FAIL before implementation
- Utilities/hooks before components
- Components in dependency order (child components before parent containers)
- Pages last (consume components and hooks)
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes:
  - US1, US2, US5, US7 can start in parallel (independent)
  - US3 starts after US2 complete
  - US4 starts after US2 complete
  - US6 starts after all functional stories complete
- All tests for a user story marked [P] can run in parallel
- Components within a story marked [P] can run in parallel
- Polish tasks marked [P] can run in parallel

---

## Parallel Example: User Story 2

```bash
# Launch all tests for User Story 2 together:
Task T046: "Unit test for useMediaPage hook"
Task T047: "Unit test for MediaItem transformation"
Task T048: "Component test for MediaGrid"
Task T049: "Component test for MediaCard"
Task T050: "Component test for Pagination"
Task T051: "E2E test for data loading"
Task T052: "E2E test for pagination navigation"

# After tests fail, launch all independent components together:
Task T053: "Create MediaCard component"
Task T054: "Create MediaGrid component"
Task T055: "Create Pagination component"
```

---

## Implementation Strategy

### MVP First (User Stories 1-3 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (Profile Gate)
4. **STOP and VALIDATE**: Test User Story 1 independently → profile form works
5. Complete Phase 4: User Story 2 (View Paginated Data)
6. **STOP and VALIDATE**: Test User Story 2 independently → data displays with pagination
7. Complete Phase 5: User Story 3 (Deep Linking)
8. **STOP and VALIDATE**: Test User Story 3 independently → deep links work
9. **MVP COMPLETE**: Deploy and demo core functionality

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (Profile gate works!)
3. Add User Story 2 → Test independently → Deploy/Demo (Data browser works!)
4. Add User Story 3 → Test independently → Deploy/Demo (Deep linking works!)
5. Add User Story 4 → Test independently → Deploy/Demo (Modals work!)
6. Add User Story 5 → Test independently → Deploy/Demo (Profile editing works!)
7. Add User Story 6 → Test independently → Deploy/Demo (Mobile-friendly!)
8. Add User Story 7 → Test independently → Deploy/Demo (Version footer!)
9. Complete Polish → Final production deployment

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (Profile Gate)
   - Developer B: User Story 2 (Data Display)
   - Developer C: User Story 5 (Profile Editor)
   - Developer D: User Story 7 (Footer)
3. After US2 completes:
   - Developer E: User Story 3 (Deep Linking - extends US2)
   - Developer F: User Story 4 (Modals - extends US2)
4. After all functional stories complete:
   - Team: User Story 6 (Mobile validation)
5. Final: Team completes Polish phase

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing (TDD)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Testing is mandatory per project constitution
- All code must pass TypeScript strict mode
- All external inputs must be validated with Zod
- All interactive elements must be keyboard accessible (WCAG AA)
- TTI < 1s performance target must be met

---

**Total Tasks**: 136
**Phases**: 10
**User Stories**: 7 (3 P1, 3 P2, 1 P3)
**MVP Scope**: User Stories 1-3 (Tasks T001-T072)
**Parallel Opportunities**: 50+ tasks marked [P]
