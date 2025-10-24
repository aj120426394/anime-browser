# Troubleshooting Guide

## Issue: `[Network error]: TypeError: Failed to fetch` on Information Page

### ✅ Fixed In Commit: 4286e2a

### Root Causes

The error was caused by **3 interconnected issues**:

#### 1. **Incorrect Credentials Setting**

**Problem**: `credentials: "include"` in HttpLink

```typescript
// ❌ WRONG - causes CORS issues
const httpLink = new HttpLink({
  uri: "https://graphql.anilist.co",
  credentials: "include", // AniList doesn't require cookies
});
```

**Solution**: Changed to `same-origin`

```typescript
// ✅ CORRECT
const httpLink = new HttpLink({
  uri: "https://graphql.anilist.co",
  credentials: "same-origin", // Proper CORS handling
  fetchOptions: {
    mode: "cors", // Explicit CORS mode
  },
});
```

**Why**: AniList GraphQL API doesn't send cookies, so requesting `include` credentials causes unnecessary CORS headers that the server may reject.

---

#### 2. **Missing Error Policy**

**Problem**: Apollo Query was strict about errors

```typescript
// ❌ Missing errorPolicy - fails on any error
const { data, loading, error } = useGetAnimePageQuery({
  variables: { page, perPage },
});
```

**Solution**: Added `errorPolicy: "all"`

```typescript
// ✅ Better error handling
const { data, loading, error } = useGetAnimePageQuery({
  variables: { page, perPage },
  errorPolicy: "all", // Continue even on partial errors
});
```

**Why**: Some GraphQL errors are partial (partial data returned). `errorPolicy: "all"` allows rendering what was received.

---

#### 3. **Insufficient Error Logging**

**Problem**: Error messages were generic

```javascript
console.error(`[Network error]: ${networkError}`); // Not detailed enough
```

**Solution**: Added structured error logging

```typescript
if (error) {
  console.error("Apollo Query Error:", {
    message: error.message,
    networkError: error.networkError,
    graphQLErrors: error.graphQLErrors,
  });
}
```

**Why**: Better error details help with debugging network vs GraphQL errors.

---

### How to Test the Fix

#### **Local Development**

```bash
# Start the dev server
npm run dev

# Navigate to http://localhost:3000
# Submit a profile
# Check /information page

# Expected: Data loads or clean error message
# Check browser console for detailed error logs
```

#### **Check Network in Browser**

1. Open DevTools (F12)
2. Go to Network tab
3. Visit /information page
4. Look for graphql.anilist.co requests
5. Check:
   - Status code (should be 200)
   - Response headers (look for CORS headers)
   - Response body (check for data or GraphQL errors)

#### **Check Console Logs**

```javascript
// Should see detailed error info if there's an issue:
Apollo Query Error: {
  message: "...",
  networkError: { ... },
  graphQLErrors: [ ... ]
}
```

---

### Common Remaining Issues & Solutions

#### **Still Getting Network Errors?**

**1. Check Internet Connection**

```bash
curl https://graphql.anilist.co -I
# Should return HTTP/2 200 or similar success code
```

**2. Check AniList API Status**

- Visit https://anilist.co (should load)
- If down, AniList API is temporarily unavailable

**3. CORS Issues (if still happening)**

- Browser console should show CORS error details
- Verify fetchOptions are set correctly
- Try using `fetch` directly to test:

```javascript
fetch("https://graphql.anilist.co", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    query: `query { Page(page: 1, perPage: 1) { pageInfo { currentPage } } }`,
  }),
})
  .then((r) => r.json())
  .then(console.log);
```

#### **4. Rate Limiting**

- AniList may rate-limit rapid requests
- Apollo retry logic handles this (429 errors)
- Check error message for rate limit info

---

### Performance Tips

1. **First Load is Slow?**
   - Apollo Client uses `cache-first` strategy
   - First request hits network, then cached
   - Subsequent page changes use cache

2. **Images Not Loading?**
   - Check image URLs in Network tab
   - Verify `next.config.js` has AniList domains

3. **Pagination Slow?**
   - Each page is a separate network request
   - Expected ~500ms-1s per page load
   - Apollo retry adds max 3s on network errors

---

### Debugging Checklist

- [ ] Check browser console for error details
- [ ] Verify internet connection
- [ ] Check AniList API status (visit anilist.co)
- [ ] Look at Network tab requests
- [ ] Verify error message details
- [ ] Check if error is network or GraphQL
- [ ] Try page reload
- [ ] Try incognito/private mode (clear cache)
- [ ] Check browser DevTools Network → graphql request response

---

### Related Files Modified

- `lib/graphql/client.ts` - Fixed credentials & CORS
- `lib/hooks/useMediaPage.ts` - Added error logging
- `app/information/page.tsx` - Improved error message

### Commit Reference

**Commit**: 4286e2a  
**Message**: fix: resolve 'Failed to fetch' network error

---

**If issue persists after these fixes:**

1. Open DevTools (F12)
2. Go to Network tab
3. Reload page
4. Click on `graphql.anilist.co` request
5. Copy Response body
6. Check for:
   - GraphQL errors in response
   - CORS error details
   - Actual API error message

Then provide that information for further debugging!
