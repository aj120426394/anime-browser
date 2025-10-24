import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

/**
 * Apollo Client Configuration
 * Connects to AniList GraphQL API with optimized caching for pagination
 */

// HTTP link configuration for AniList GraphQL endpoint with error handling
// credentials: "same-origin" - Only include credentials for same-origin requests (avoids CORS issues)
// mode: "cors" - Explicitly enable CORS for cross-origin requests
const httpLink = new HttpLink({
  uri: "https://graphql.anilist.co",
  credentials: "same-origin",
  fetchOptions: {
    mode: "cors",
  },
  // Enhanced error handling for network requests
  fetch: async (uri, options) => {
    let retries = 0;
    const maxRetries = 3;
    const retryDelay = 1000; // Start with 1 second delay

    while (retries < maxRetries) {
      try {
        const response = await fetch(uri, options);

        // Handle rate limiting (429 Too Many Requests)
        if (response.status === 429) {
          const retryAfter = parseInt(response.headers.get("Retry-After") || "60", 10);
          const waitTime = retryAfter * 1000;

          if (retries < maxRetries - 1) {
            // Wait before retrying
            await new Promise((resolve) => setTimeout(resolve, waitTime));
            retries++;
            continue;
          }

          // Return 429 response to be handled by Apollo error policy
          return response;
        }

        // Handle other network errors with exponential backoff
        if (!response.ok && response.status >= 500) {
          if (retries < maxRetries - 1) {
            const delay = retryDelay * Math.pow(2, retries); // Exponential backoff
            await new Promise((resolve) => setTimeout(resolve, delay));
            retries++;
            continue;
          }
        }

        return response;
      } catch (error) {
        // Network error - retry with exponential backoff
        if (retries < maxRetries - 1) {
          const delay = retryDelay * Math.pow(2, retries);
          await new Promise((resolve) => setTimeout(resolve, delay));
          retries++;
          continue;
        }

        // Final attempt failed - throw error
        throw error;
      }
    }

    // Should not reach here, but fallback to final fetch attempt
    return fetch(uri, options);
  },
});

// In-memory cache with type policies for optimized pagination
// Implements field-level caching to avoid duplicate API calls when navigating pages
export const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        // Page field caching: keyed by page number to store separate responses per page
        // This enables efficient deep linking - can jump to any page without re-fetching
        Page: {
          keyArgs: ["page", "perPage"], // Cache key includes both page and perPage params
          merge(existing = {}, incoming) {
            // Merge incoming page data with existing cache
            return { ...existing, ...incoming };
          },
        },
      },
    },
  },
});

// Initialize Apollo Client with cache and HTTP link
// SSR-safe: Apollo Client is only instantiated in browser environment
const apolloClient = new ApolloClient({
  ssrMode: typeof window === "undefined", // Enable SSR mode if running on server
  link: httpLink,
  cache,
  connectToDevTools: true, // Enable Apollo DevTools for debugging
});

export default apolloClient;
