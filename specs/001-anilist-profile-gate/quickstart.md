# Quickstart Guide: AniList Profile Gate & Information Browser

**Feature**: 001-anilist-profile-gate
**Last Updated**: 2025-10-24

## Overview

This guide provides step-by-step instructions to install, run, test, build, and deploy the AniList Profile Gate application.

---

## Prerequisites

### Required

- **Node.js**: v18.17 or later (v20 LTS recommended)
- **npm**: v9 or later (comes with Node.js)
- **Git**: For version control
- **Modern browser**: Chrome 90+, Firefox 88+, Safari 14+, or Edge 90+

### Optional

- **Vercel CLI**: For local deployment simulation (`npm i -g vercel`)
- **VS Code**: Recommended editor with ESLint and Tailwind CSS IntelliSense extensions

---

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd leonardo-web-challenge
git checkout 001-anilist-profile-gate
```

### 2. Install Dependencies

```bash
npm install
```

This installs:

- Next.js 15 (framework)
- React 18+ (UI library)
- Apollo Client (GraphQL client)
- shadcn/ui components (UI components)
- Tailwind CSS (styling)
- Zod (runtime validation)
- Vitest + React Testing Library (unit/component testing)
- Playwright (E2E testing)
- GraphQL Code Generator (type generation)
- DOMPurify (HTML sanitization)

### 3. Generate GraphQL Types

```bash
npm run codegen
```

This introspects the AniList API schema and generates TypeScript types and hooks in `lib/graphql/generated/`.

### 4. Set Up Environment Variables

Create a `.env.local` file in the project root:

```bash
# .env.local
NEXT_PUBLIC_CHALLENGE_VERSION=3.5
```

---

## Running the Application

### Development Mode

```bash
npm run dev
```

- Application runs at `http://localhost:3000`
- Hot reload enabled for code changes
- Development tools available (React DevTools, Apollo DevTools)

### Access the Application

1. Open `http://localhost:3000` in your browser
2. You'll see the profile gate form (no profile exists yet)
3. Enter username and job title, then click submit
4. You'll be redirected to `/information?page=1` with anime data

### Test Profile Gate Behavior

To test the gate again:

1. Open browser DevTools (F12)
2. Navigate to Application/Storage → Local Storage
3. Delete the `user-profile` key
4. Refresh the page - you'll see the profile form again

---

## Testing

### Run All Tests

```bash
npm test
```

This runs unit, component, and integration tests with Vitest.

### Run Tests in Watch Mode

```bash
npm run test:watch
```

Automatically re-runs tests on file changes (useful during development).

### Run E2E Tests

```bash
# Install Playwright browsers (first time only)
npx playwright install

# Run E2E tests
npm run test:e2e
```

E2E tests cover:

- Profile gate blocking access
- Form submission and localStorage persistence
- Data loading from AniList API
- Pagination navigation
- Modal interactions
- Deep linking (/information?page=5)

### Run E2E Tests in UI Mode (Interactive)

```bash
npm run test:e2e:ui
```

Opens Playwright UI for debugging tests visually.

### Test Coverage Report

```bash
npm run test:coverage
```

Generates coverage report in `coverage/` directory.

---

## Building for Production

### Create Production Build

```bash
npm run build
```

This:

1. Runs TypeScript type checking
2. Runs ESLint
3. Builds Next.js application with optimizations
4. Outputs to `.next/` directory

### Preview Production Build Locally

```bash
npm run start
```

Serves the production build at `http://localhost:3000`. Use this to verify production behavior before deploying.

---

## Deployment

### Deploy to Vercel (Recommended)

#### Option 1: Vercel Dashboard (Easiest)

1. Push your code to GitHub/GitLab/Bitbucket
2. Visit [vercel.com](https://vercel.com) and sign in
3. Click "New Project" and import your repository
4. Vercel auto-detects Next.js configuration
5. Add environment variable: `NEXT_PUBLIC_CHALLENGE_VERSION=3.5`
6. Click "Deploy"

Vercel provides:

- Automatic deployments on git push
- Preview deployments for pull requests
- Global CDN distribution
- Image optimization
- Analytics

#### Option 2: Vercel CLI

```bash
# Install Vercel CLI globally (if not already)
npm i -g vercel

# Login to Vercel
vercel login

# Deploy (follow prompts)
vercel

# Deploy to production
vercel --prod
```

### Deploy to Other Platforms

The application is a standard Next.js app and can be deployed to:

- **Netlify**: Use `next export` or Netlify adapter
- **AWS Amplify**: Point to repository and use Next.js preset
- **Docker**: Use official Next.js Docker example
- **Self-hosted**: Run `npm run build && npm run start` on a server

### Environment Variables for Production

Ensure these are set in your deployment platform:

```
NEXT_PUBLIC_CHALLENGE_VERSION=3.5
```

---

## Architecture Overview

### Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (strict mode)
- **UI**: React 18 + shadcn/ui + Tailwind CSS
- **Data Fetching**: Apollo Client (GraphQL)
- **Validation**: Zod (runtime type checking)
- **Testing**: Vitest + RTL + Playwright
- **Deployment**: Vercel

### Directory Structure

```
app/
├── layout.tsx           # Root layout with Footer
├── page.tsx             # Profile gate (/)
└── information/
    └── page.tsx         # Information page (/information?page=N)

components/
├── ProfileForm.tsx      # Profile collection form
├── ProfileEditor.tsx    # Profile edit interface
├── MediaGrid.tsx        # Responsive grid of media items
├── MediaCard.tsx        # Individual media item card
├── MediaModal.tsx       # Modal dialog for item details
├── Pagination.tsx       # Pagination controls
└── Footer.tsx           # Global footer

lib/
├── schema.ts            # Zod validation schemas
├── storage.ts           # localStorage utilities (SSR-safe)
├── graphql/
│   ├── client.ts        # Apollo Client setup
│   ├── queries.ts       # GraphQL queries
│   └── generated/       # Auto-generated types and hooks
└── hooks/
    ├── useProfile.ts    # Profile CRUD operations
    ├── useMediaPage.ts  # Media data fetching and transformation
    └── usePagination.ts # Pagination state with URL sync
```

### Key Architectural Decisions

1. **Profile Gate**: Implemented as a blocking form on `/` route. Checks localStorage on mount, redirects to `/information` if profile exists.

2. **Data Flow**: Profile (localStorage) → Unblock → Apollo Client → AniList API → Transform → Render

3. **Pagination**: URL query parameter `?page=N` is source of truth. Apollo fetches data based on URL parameter. Pagination controls update URL.

4. **SSR Safety**: localStorage access wrapped in `typeof window !== 'undefined'` checks. Profile loaded in `useEffect` on client side only.

5. **Type Safety**: GraphQL Code Generator creates TypeScript types from AniList schema at build time. Zod validates runtime data.

6. **Accessibility**: shadcn/ui Dialog component (Radix UI) provides WCAG AA compliant modals. Keyboard navigation tested in E2E tests.

7. **Performance**:
   - Next.js Image component for automatic optimization
   - Apollo InMemoryCache for pagination caching
   - Code splitting with dynamic imports
   - Lazy loading for off-screen images

---

## Development Workflow

### 1. Start Development Server

```bash
npm run dev
```

### 2. Make Changes

- Edit components in `components/`
- Update GraphQL queries in `lib/graphql/queries.ts`
- Modify Zod schemas in `lib/schema.ts`
- Add/update tests in `tests/` and `e2e/`

### 3. Run Tests

```bash
npm test                # Unit/component tests
npm run test:e2e       # E2E tests
```

### 4. Type Check

```bash
npm run type-check
```

### 5. Lint Code

```bash
npm run lint
```

### 6. Format Code

```bash
npm run format
```

### 7. Commit Changes

```bash
git add .
git commit -m "feat: add new feature"
git push
```

---

## Troubleshooting

### Issue: GraphQL queries fail with network error

**Solution**: Verify AniList API is accessible at `https://graphql.anilist.co`. Check browser console for CORS errors.

### Issue: Profile gate doesn't redirect after form submission

**Solution**: Check browser console for localStorage errors. Verify Zod validation passes. Clear localStorage and try again.

### Issue: Images don't load on information page

**Solution**: Verify Next.js Image component is configured correctly. Check `next.config.js` for `remotePatterns` allowing AniList CDN.

### Issue: Tests fail with "window is not defined"

**Solution**: Ensure localStorage utilities check for `typeof window !== 'undefined'`. Use `jsdom` environment for Vitest tests.

### Issue: E2E tests timeout

**Solution**: Increase timeout in `playwright.config.ts`. Verify development server is running before E2E tests. Check network tab for slow API responses.

### Issue: Build fails with TypeScript errors

**Solution**: Run `npm run codegen` to regenerate GraphQL types. Verify all imports resolve correctly. Check `tsconfig.json` is using strict mode.

### Issue: Deployment fails on Vercel

**Solution**: Verify environment variables are set. Check build logs for specific errors. Ensure `package.json` has correct `engines` field.

---

## Useful Commands

| Command                 | Description                        |
| ----------------------- | ---------------------------------- |
| `npm run dev`           | Start development server           |
| `npm run build`         | Create production build            |
| `npm run start`         | Serve production build             |
| `npm test`              | Run unit and component tests       |
| `npm run test:watch`    | Run tests in watch mode            |
| `npm run test:e2e`      | Run E2E tests with Playwright      |
| `npm run test:e2e:ui`   | Run E2E tests in UI mode           |
| `npm run test:coverage` | Generate test coverage report      |
| `npm run lint`          | Lint code with ESLint              |
| `npm run format`        | Format code with Prettier          |
| `npm run type-check`    | Run TypeScript type checking       |
| `npm run codegen`       | Generate GraphQL types from schema |

---

## Additional Resources

- [Next.js 15 Documentation](https://nextjs.org/docs)
- [Apollo Client Documentation](https://www.apollographql.com/docs/react/)
- [AniList API Documentation](https://anilist.gitbook.io/anilist-apiv2-docs/)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Zod Validation](https://zod.dev/)
- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)

---

## Support

For issues or questions:

1. Check this quickstart guide
2. Review spec.md and plan.md in `specs/001-anilist-profile-gate/`
3. Check inline code comments for non-obvious logic
4. Review test files for usage examples
5. Consult the project constitution at `.specify/memory/constitution.md`
