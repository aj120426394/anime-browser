# AniList Profile Gate & Information Browser

A modern web application that demonstrates a profile gate, data browsing from AniList API, and responsive design with accessibility best practices.

## Features

- **Profile Gate**: First-time visitors must create a profile (username + job title) before accessing content
- **Anime Browser**: Browse paginated anime data from AniList GraphQL API
- **Deep Linking**: Shareable URLs with pagination state (`?page=N`)
- **Profile Editing**: Edit and update saved profile information
- **Modal Details**: Click on anime cards to view detailed information
- **Responsive Design**: Mobile-first approach with touch-friendly controls (44px minimum touch targets)
- **Accessibility**: WCAG AA compliant with keyboard navigation and screen reader support
- **Modern Stack**: Next.js 15, React 18, TypeScript, Tailwind CSS, Apollo Client

## Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript 5
- **UI**: Tailwind CSS, shadcn/ui components
- **API**: Apollo Client, AniList GraphQL API
- **Data**: localStorage (client-side), Zod validation
- **Testing**: Vitest, React Testing Library, Playwright E2E
- **Performance**: Next.js Image optimization, Code splitting, Bundle analysis

## Prerequisites

- Node.js 18+ or 20+
- npm or yarn or pnpm
- Git

## Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/leonardo-web-challenge.git
cd leonardo-web-challenge
```

2. **Install dependencies**

```bash
npm install
```

3. **Generate GraphQL types**

Before running the app, generate TypeScript types from AniList GraphQL schema:

```bash
npm run codegen
```

This generates `lib/graphql/generated/operations.ts` with all query types and React hooks.
These generated files are automatically excluded from git (see `.gitignore`).

## Development

### Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Code generation

Generate TypeScript types from AniList GraphQL schema:

```bash
npm run codegen
```

**Important**: Always run `npm run codegen` after:

- Modifying GraphQL query files (`lib/graphql/queries/*.graphql`)
- Updating `codegen.yml` configuration
- Cloning the repository for the first time

This generates:

- `lib/graphql/generated/operations.ts` - Query types, variables, and React hooks
- Fully typed `useGetAnimePageQuery()` hook with Apollo Client integration

### Testing

**Unit & Component Tests (Vitest + React Testing Library)**

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch
```

**End-to-End Tests (Playwright)**

```bash
# Run E2E tests
npm run e2e

# Run E2E tests with UI
npm run e2e:ui
```

### Code Quality

**Type Checking**

```bash
npm run type-check
```

**Linting**

```bash
npm run lint

# Fix fixable issues
npm run lint:fix
```

**Code Formatting**

```bash
npm run format
```

## Build

### Production build

```bash
npm run build
```

### Start production server

```bash
npm run start
```

## Architecture

### Project Structure

```
├── app/                    # Next.js app router pages
│   ├── layout.tsx         # Root layout with Apollo + Footer
│   ├── page.tsx           # Profile gate (homepage)
│   └── information/       # Anime browser page
├── components/            # React components
│   ├── ProfileForm.tsx    # Profile creation form
│   ├── ProfileEditor.tsx  # Profile editing form
│   ├── MediaCard.tsx      # Anime card component
│   ├── MediaGrid.tsx      # Grid of anime cards
│   ├── Pagination.tsx     # Pagination controls
│   ├── MediaModal.tsx     # Anime detail modal
│   ├── Footer.tsx         # App footer
│   ├── ApolloWrapper.tsx  # Apollo Client provider
│   └── ui/                # shadcn/ui components
├── lib/
│   ├── schema.ts          # Zod validation schemas
│   ├── storage.ts         # localStorage utilities
│   ├── utils/             # Helper functions
│   ├── hooks/             # Custom React hooks
│   │   ├── useProfile.ts  # Profile CRUD
│   │   ├── usePagination.ts # URL pagination state
│   │   └── useMediaPage.ts # AniList data fetching
│   └── graphql/           # Apollo Client + queries
├── tests/                 # Unit & component tests
│   ├── unit/              # Hook and utility tests
│   └── components/        # Component tests
├── e2e/                   # End-to-end tests (Playwright)
└── specs/                 # Feature specifications
```

### Key Design Decisions

1. **Apollo Client Caching**: Using InMemoryCache with type policies for optimized pagination
   - Implements field-level caching to avoid duplicate API calls
   - Supports deep linking with URL-synced pagination state

2. **localStorage for Profile**: Client-side persistence
   - Enables offline profile retention
   - SSR-safe checks prevent errors in server environments
   - Fallback UI for private browsing mode

3. **Zod Validation**: Schema-based validation for all data
   - Ensures type safety across API responses and form inputs
   - Centralized error messages for consistent UX

4. **shadcn/ui Components**: Unstyled, accessible component library
   - Built on Radix UI primitives (better a11y)
   - Fully customizable with Tailwind CSS
   - Automatic focus management for modals

5. **Responsive Images**: Next.js Image optimization
   - Automatic WebP conversion for modern browsers
   - Lazy loading and LQIP (Low Quality Image Placeholder)
   - CDN integration with AniList media endpoints

## Accessibility

The application meets **WCAG 2.1 Level AA** standards:

- ✅ **Keyboard Navigation**: All interactive elements accessible via Tab/Shift+Tab
- ✅ **Focus Management**: Focus trap in modals, visible focus indicators
- ✅ **Screen Readers**: Proper ARIA labels and semantic HTML
- ✅ **Color Contrast**: 4.5:1 for normal text, 3:1 for large text
- ✅ **Touch Targets**: Minimum 44×44px for mobile interactions
- ✅ **Form Labels**: All inputs properly associated with labels

### Testing Accessibility

```bash
# Manual testing with axe DevTools browser extension
# Automated testing with axe-core in Playwright

# Keyboard navigation test
npm run e2e -- profile-gate.spec.ts -k "keyboard"

# Screen reader testing (manual)
- macOS: VoiceOver (Cmd+F5)
- Windows: NVDA (free) or JAWS
- iOS: VoiceOver (Settings > Accessibility)
```

## Performance

### Performance Targets

- **TTI (Time to Interactive)**: < 1s
- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1

### Optimization Techniques

- Dynamic imports for code splitting
- Image optimization with Next.js Image component
- Apollo Client caching to minimize API calls
- Bundle analysis to identify large dependencies

### Running Lighthouse Audit

```bash
npm run build && npm run start
# Open DevTools > Lighthouse > Generate report
```

## 🚀 Deployment

### Vercel Deployment (Recommended)

This project is optimized for deployment on [Vercel](https://vercel.com), the creators of Next.js.

#### Prerequisites

- Vercel account (free tier available at https://vercel.com/signup)
- GitHub account (for connecting repository)
- Git setup locally

#### Quick Start (Automatic Deployment)

1. **Push code to GitHub repository**

   ```bash
   git push origin main
   ```

2. **Connect to Vercel**
   - Visit https://vercel.com/new
   - Select "Import Git Repository"
   - Search for your GitHub repository: `leonardo-web-challenge`
   - Click "Import"

3. **Deploy**
   - Vercel will automatically:
     - Build the project using `npm run build`
     - Run type checking and linting
     - Generate static pages
     - Deploy to Vercel CDN globally
   - Your project will be live at `https://your-project.vercel.app`

#### Manual Deployment Steps

If you prefer manual control:

1. **Install Vercel CLI**

   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**

   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel --prod
   ```
   This will:
   - Ask for project setup (use defaults recommended)
   - Build and upload your project
   - Provide your production URL

#### Verification After Deployment

After deployment, verify:

1. **Site loads**: Visit your Vercel URL
2. **Profile form works**: Submit a test profile (e.g., username: "TestUser", job: "QA")
3. **Anime loads**: Navigate to /information after submission
4. **Pagination works**: Click page buttons, verify URL changes
5. **Modal works**: Click an anime item, verify modal opens
6. **Footer displays**: Scroll to bottom, verify "Challenge version v3.5"
7. **Mobile responsive**: Test on mobile viewport (< 768px)

#### Deployment Verification with E2E Tests (T135)

After production deployment, run E2E tests against it:

```bash
# Set your Vercel URL
export PLAYWRIGHT_BASE_URL=https://your-project.vercel.app

# Run E2E tests
npm run test:e2e
```

Expected results:

- ✅ Profile gate test passes
- ✅ Pagination test passes
- ✅ Modal interaction test passes
- ✅ Mobile viewport tests pass

#### References

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment on Vercel](https://nextjs.org/learn/basics/deploying-nextjs-app/deploy)
- [Environment Variables in Vercel](https://vercel.com/docs/concepts/projects/environment-variables)

## Error Handling

The application gracefully handles:

- **Network Failures**: User-friendly error messages, retry capability
- **API Rate Limits**: 429 responses trigger exponential backoff retry
- **localStorage Unavailable**: Warning banner in private browsing mode
- **Image Loading Failures**: Fallback placeholder from AniList CDN
- **Apollo Errors**: Detailed logging with error boundaries

## Testing Strategy

### Test Coverage

- **Unit Tests**: Schemas, hooks, utilities (Vitest)
- **Component Tests**: Interactive components, form validation (RTL)
- **E2E Tests**: Critical user journeys, deep linking, pagination (Playwright)

### Test Execution Order

1. Profile form validation and submission
2. Profile gate blocking access
3. Data loading and pagination
4. Deep linking with URL parameters
5. Modal interaction and keyboard navigation
6. Profile editing and persistence
7. Mobile responsiveness and touch targets

### Running All Tests

```bash
npm run test                # Unit + component tests
npm run test:e2e            # E2E tests
```

## Troubleshooting

### Port Already in Use

```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>

# Or use different port
PORT=3001 npm run dev
```

### TypeScript Errors

```bash
npm run type-check

# Rebuild type definitions
npm run codegen
```

### localStorage Not Available

- Check if browser has cookies enabled
- Exit private browsing mode
- Check browser console for specific errors

### Image CDN Issues

- AniList CDN occasionally experiences downtime
- Fallback placeholder is displayed
- Try clearing Apollo cache: localStorage.clear()

## Contributing

1. Create feature branch: `git checkout -b feature/feature-name`
2. Commit changes: `git commit -m "feat: description"`
3. Push to branch: `git push origin feature/feature-name`
4. Open Pull Request

### Code Standards

- TypeScript strict mode required
- Zod validation for all external data
- Unit tests for utilities and hooks
- E2E tests for user journeys
- WCAG AA accessibility compliance

## License

MIT

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Apollo Client Docs](https://www.apollographql.com/docs/react)
- [AniList GraphQL API](https://anilist.gitbook.io/anilist-apiv2-docs)
- [shadcn/ui Components](https://ui.shadcn.com)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref)
- [Playwright Documentation](https://playwright.dev)
