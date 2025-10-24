# Vercel Deployment Guide

## Overview

This guide walks through deploying the **leonardo-web-challenge** project to Vercel and covers:
- **T133**: Setting up environment variables in Vercel dashboard
- **T134**: Deploying to Vercel and verifying production build

## Prerequisites

- ✅ Local build passes: `npm run build` (verified)
- GitHub account with repository access
- Vercel account (free tier available)
- Git CLI installed locally

## Task T133: Environment Variables Setup

### Step 1: Create Vercel Project

**Option A: Automatic (Recommended)**
1. Visit https://vercel.com/new
2. Click "Import Git Repository"
3. Search for and select your repository
4. Click "Import"
5. Vercel will auto-detect Next.js configuration

**Option B: Manual**
1. Install Vercel CLI: `npm install -g vercel`
2. From project root: `vercel link`
3. Follow prompts to create project

### Step 2: Add Environment Variables

Once project is created in Vercel:

1. **Navigate to Project Settings**
   - Go to https://vercel.com/dashboard
   - Select your project: `leonardo-web-challenge`
   - Click "Settings" tab

2. **Add Environment Variable**
   - Select "Environment Variables" in left sidebar
   - Click "Add New"
   - Fill in:
     ```
     Name:  NEXT_PUBLIC_CHALLENGE_VERSION
     Value: 3.5
     ```
   - Select "Production" checkbox (must be in production environment)
   - Click "Save"

3. **Verify Addition**
   - You should see the variable listed with checkmark next to "Production"
   - Value is masked but should display as `NEXT_PUBLIC_CHALLENGE_VERSION: 3.5`

### Environment Variables Explained

| Variable | Purpose | Type | Value |
|----------|---------|------|-------|
| `NEXT_PUBLIC_CHALLENGE_VERSION` | Displayed in footer | Public | `3.5` |

**Key Points:**
- Variables prefixed with `NEXT_PUBLIC_` are available in browser (not secret)
- Must be set in Vercel for production deployments
- Local development uses `.env.local` (already configured)
- Change requires redeploy to take effect

## Task T134: Deploy and Verify Production Build

### Step 3: Deploy to Production

**Option A: Git Push (Automatic)**
1. Make sure code is pushed to GitHub main branch:
   ```bash
   git push origin main
   ```
2. Vercel automatically deploys on push
3. Watch deployment in Vercel dashboard
4. Once complete, you'll see ✓ Production Ready

**Option B: Manual Deployment**
1. From project root:
   ```bash
   vercel --prod
   ```
2. Follow prompts (usually accept defaults)
3. Deployment will start automatically
4. You'll receive production URL when complete

### Step 4: Verify Production Build

After deployment completes, Vercel will show your project URL (typically `https://leonardo-web-challenge.vercel.app` or similar).

#### Quick Smoke Tests

1. **Page Loads**
   - Visit your Vercel URL
   - Should see profile form immediately
   - No JavaScript errors in console

2. **Profile Form**
   - Enter username: `TestUser`
   - Enter job title: `QA Engineer`
   - Click "Submit"
   - Should redirect to `/information`

3. **Anime Data**
   - After redirect, should see anime grid loading
   - Images should load from AniList CDN
   - Should show pagination controls

4. **Pagination**
   - Click "Next" button (or page 2)
   - URL should change to `?page=2`
   - Grid should update with new data
   - Should work on all page transitions

5. **Item Modal**
   - Click any anime item
   - Modal should open with:
     - Large image
     - Title, status, dates
     - Description
   - Press ESC or click outside to close

6. **Footer**
   - Scroll to bottom of page
   - Should see: "Challenge version v3.5"

7. **Mobile Responsive**
   - Resize browser to 375px width
   - Form should reflow (single column)
   - Grid should show 1 column
   - All buttons should be touch-friendly

#### Detailed Verification Checklist

```
Production URL: ______________________________

GENERAL
[ ] Site loads without JavaScript errors
[ ] No 404 or 500 errors
[ ] Page loads in < 3 seconds

PROFILE GATE (/)
[ ] Form displays correctly
[ ] Form labels visible
[ ] Input fields responsive
[ ] Submit button enabled
[ ] Form validation works (try empty fields)

ANIME DATA (/information)
[ ] Redirects automatically after profile submit
[ ] Anime grid renders with items
[ ] Images load (should be WebP optimized)
[ ] No image loading errors
[ ] Grid is responsive

PAGINATION
[ ] Pagination controls visible
[ ] Can navigate between pages
[ ] URL updates on navigation (?page=N)
[ ] Deep link works: /information?page=3
[ ] No broken links

MODAL
[ ] Click anime item opens modal
[ ] Modal shows title, image, description
[ ] Close button works
[ ] ESC key closes modal
[ ] Click outside closes modal
[ ] Focus trap works (Tab stays in modal)

RESPONSIVE
[ ] Mobile (375px): Single column layout
[ ] Tablet (768px): 2-column layout
[ ] Desktop (1024px): 3-4 column layout
[ ] No horizontal scrolling
[ ] Touch targets ≥44px

FOOTER
[ ] Footer visible on all pages
[ ] Displays "Challenge version v3.5"
[ ] Consistent styling

PERFORMANCE
[ ] First Load: < 3s
[ ] Image load: < 1s (WebP format)
[ ] Navigation: < 500ms
[ ] No console errors/warnings
```

### Step 5: Monitor Deployment

In Vercel Dashboard:

1. **Deployments Tab**
   - Shows all deployment history
   - Current production version marked with checkmark
   - Can rollback to previous versions

2. **Analytics Tab** (if available)
   - Tracks Web Vitals
   - Shows performance metrics
   - Displays traffic and errors

3. **Settings Tab**
   - Verify environment variables are set
   - Check build & dev commands
   - Review deployment regions

## Troubleshooting

### Issue: Build Fails

**Error: "useSearchParams() should be wrapped in Suspense"**
- ✅ Already fixed in codebase
- This error was fixed by wrapping page content with Suspense boundary
- If you see this, ensure you have the latest code

**Error: GraphQL Code Generation Failed**
- Run locally first: `npm run generate`
- Commit generated files before deploying

**Error: Type Checking Failed**
- Run locally: `npm run type-check`
- Fix any TypeScript errors
- ESLint warnings are acceptable

### Issue: Environment Variable Not Working

**Footer shows "Challenge version undefined"**

Steps to fix:
1. Verify variable is set in Vercel dashboard
2. Check variable name: Must be exactly `NEXT_PUBLIC_CHALLENGE_VERSION`
3. Redeploy: `git push origin main` or `vercel --prod`
4. Clear browser cache: Ctrl+Shift+Delete
5. Check DevTools Network tab for environment validation

### Issue: Images Not Loading

**Broken image placeholders showing**

1. Check Network tab in DevTools:
   - Should see WebP images loading from `anilist.co`
   - Status should be 200 OK
2. Verify `next.config.js` has:
   ```javascript
   images: {
     remotePatterns: [
       { protocol: 'https', hostname: 'anilist.co' }
     ]
   }
   ```
3. If issue persists, clear Next.js cache: `rm -rf .next`

### Issue: Slow Performance

**Page takes > 3 seconds to load**

1. Check Vercel Analytics for bottlenecks
2. Verify images are in WebP format (DevTools Network tab)
3. Check Apollo cache hits vs misses
4. Lighthouse audit: https://web.dev/measure/

### Issue: Mobile Layout Broken

**Grid or form not responsive**

1. Check viewport meta tag in layout.tsx
2. Verify Tailwind responsive classes are compiled
3. Test with mobile DevTools (F12 → Toggle Device Toolbar)
4. Check for horizontal scrolling: `overflow-x: hidden`

## Rollback Procedure

If production has issues:

1. **Vercel Dashboard**
   - Go to Deployments tab
   - Find previous stable version
   - Click "..."  → "Promote to Production"
   - Confirm

2. **Git Revert**
   ```bash
   git revert <commit-hash>
   git push origin main
   # Vercel redeploys automatically
   ```

## Performance Targets

Target metrics for production deployment:

| Metric | Target | Check With |
|--------|--------|-----------|
| First Load | < 3s | DevTools Network tab |
| Time to Interactive (TTI) | < 1s | Lighthouse audit |
| Largest Contentful Paint (LCP) | < 2.5s | Lighthouse audit |
| Cumulative Layout Shift (CLS) | < 0.1 | Lighthouse audit |
| Image format | WebP | DevTools Network tab |

## Next Steps (T135)

After successful production deployment:

```bash
# Set production URL
export PLAYWRIGHT_BASE_URL=https://your-project.vercel.app

# Run full E2E test suite
npm run test:e2e
```

All E2E tests should pass against production.

## Quick Reference

```bash
# Local verification before deployment
npm run build           # Builds production bundle
npm run start          # Runs production locally
npm run lint           # Checks code quality
npm run type-check     # Type checking

# Deployment commands
git push origin main   # Triggers Vercel auto-deploy
vercel --prod          # Manual Vercel deployment
vercel rollback        # Rollback to previous version

# Verification after deployment
export PLAYWRIGHT_BASE_URL=https://your-url.vercel.app
npm run test:e2e       # Run E2E tests on production
```

## Support & Resources

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Deployment**: https://nextjs.org/learn/basics/deploying-nextjs-app
- **Environment Variables**: https://vercel.com/docs/concepts/projects/environment-variables
- **Troubleshooting**: https://vercel.com/docs/platform/frequently-asked-questions

---

**Deployment Status**: Ready for T133-T134 Implementation
- ✅ Local build verified
- ✅ vercel.json configured
- ✅ .env.local configured
- ⏳ T133: Environment variables in Vercel dashboard (manual)
- ⏳ T134: Deploy to Vercel (manual)
- ⏳ T135: E2E test verification (after deployment)
