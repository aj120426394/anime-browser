import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;

export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };

export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type MediaStatus =
  | 'CANCELLED'
  | 'FINISHED'
  | 'NOT_YET_RELEASED'
  | 'RELEASING';

export type MediaType =
  | 'ANIME'
  | 'MANGA';

export type GetAnimePageQueryVariables = Exact<{
  page: Scalars['Int']['input'];
  perPage: Scalars['Int']['input'];
}>;

export type GetAnimePageQuery = { __typename?: 'Query', Page?: { __typename?: 'Page', pageInfo?: { __typename?: 'PageInfo', currentPage?: number | null, hasNextPage?: boolean | null, perPage?: number | null } | null, media?: Array<{ __typename?: 'Media', id: number, status?: MediaStatus | null, type?: MediaType | null, description?: string | null, title?: { __typename?: 'MediaTitle', english?: string | null, native?: string | null } | null, startDate?: { __typename?: 'FuzzyDate', year?: number | null, month?: number | null, day?: number | null } | null, endDate?: { __typename?: 'FuzzyDate', year?: number | null, month?: number | null, day?: number | null } | null, coverImage?: { __typename?: 'MediaCoverImage', large?: string | null, medium?: string | null } | null } | null> | null } | null };

export const GetAnimePageDocument = gql`
    query GetAnimePage($page: Int!, $perPage: Int!) {
  Page(page: $page, perPage: $perPage) {
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
      type
      startDate {
        year
        month
        day
      }
      endDate {
        year
        month
        day
      }
      description(asHtml: false)
      coverImage {
        large
        medium
      }
    }
  }
}
    `;

/**
 * __useGetAnimePageQuery__
 *
 * To run a query within a React component, call `useGetAnimePageQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAnimePageQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAnimePageQuery({
 *   variables: {
 *      page: // value for 'page'
 *      perPage: // value for 'perPage'
 *   },
 * });
 */
export function useGetAnimePageQuery(baseOptions: Apollo.QueryHookOptions<GetAnimePageQuery, GetAnimePageQueryVariables> & ({ variables: GetAnimePageQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAnimePageQuery, GetAnimePageQueryVariables>(GetAnimePageDocument, options);
      }
export function useGetAnimePageLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAnimePageQuery, GetAnimePageQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAnimePageQuery, GetAnimePageQueryVariables>(GetAnimePageDocument, options);
        }
export function useGetAnimePageSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAnimePageQuery, GetAnimePageQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAnimePageQuery, GetAnimePageQueryVariables>(GetAnimePageDocument, options);
        }
export type GetAnimePageQueryHookResult = ReturnType<typeof useGetAnimePageQuery>;
export type GetAnimePageLazyQueryHookResult = ReturnType<typeof useGetAnimePageLazyQuery>;
export type GetAnimePageSuspenseQueryHookResult = ReturnType<typeof useGetAnimePageSuspenseQuery>;
export type GetAnimePageQueryResult = Apollo.QueryResult<GetAnimePageQuery, GetAnimePageQueryVariables>;
