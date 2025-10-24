import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

/**
 * Apollo Client Configuration
 * Connects to AniList GraphQL API with optimized caching for pagination
 */

// HTTP link configuration for AniList GraphQL endpoint
// credentials: "same-origin" - Only include credentials for same-origin requests (avoids CORS issues)
// mode: "cors" - Explicitly enable CORS for cross-origin requests
const httpLink = new HttpLink({
  uri: "https://graphql.anilist.co",
  credentials: "same-origin",
  fetchOptions: {
    mode: "cors",
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
