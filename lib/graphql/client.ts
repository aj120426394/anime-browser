import { ApolloClient, InMemoryCache, HttpLink, from } from "@apollo/client";
import { RetryLink } from "@apollo/client/link/retry";
import { onError } from "@apollo/client/link/error";

/**
 * Create Apollo Client instance for AniList GraphQL API
 * Includes retry logic, error handling, and pagination caching
 */
export function createApolloClient() {
  // Retry link with exponential backoff for transient failures
  const retryLink = new RetryLink({
    delay: {
      initial: 250,
      max: 1000,
      jitter: true,
    },
    attempts: {
      max: 3,
      retryIf: (error) => {
        // Retry on network errors or rate limits
        return !!error && (error.statusCode === 429 || error.statusCode >= 500);
      },
    },
  });

  // Error handling link
  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      graphQLErrors.forEach(({ message, locations, path }) => {
        console.error(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
        );
      });
    }

    if (networkError) {
      console.error(`[Network error]: ${networkError}`);
    }
  });

  // HTTP link to AniList GraphQL endpoint
  const httpLink = new HttpLink({
    uri: "https://graphql.anilist.co",
    credentials: "same-origin",
    fetchOptions: {
      mode: "cors",
    },
  });

  // Combine links
  const link = from([retryLink, errorLink, httpLink]);

  // Create cache with type policies for pagination
  const cache = new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          Page: {
            keyArgs: ["page", "perPage"],
            merge(existing, incoming) {
              // Replace cache on page change
              return incoming;
            },
          },
        },
      },
    },
  });

  return new ApolloClient({
    link,
    cache,
    defaultOptions: {
      watchQuery: {
        fetchPolicy: "cache-first" as const,
      },
      query: {
        fetchPolicy: "cache-first" as const,
      },
    },
  });
}
