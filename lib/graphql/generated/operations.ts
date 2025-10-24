import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubkeyOf in K]?: Maybe<T[SubkeyOf]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubkeyOf in K]?: Maybe<T[SubkeyOf]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };

const defaultOptions = {} as const;
export type GetAnimePageQueryVariables = Exact<{
  page: InputMaybe<number>;
  perPage: InputMaybe<number>;
}>;

export type GetAnimePageQuery = {
  __typename?: 'Query';
  Page?: {
    __typename?: 'Page';
    pageInfo?: {
      __typename?: 'PageInfo';
      currentPage?: Maybe<number>;
      hasNextPage?: Maybe<boolean>;
      perPage?: Maybe<number>;
    } | null;
    media?: Array<
      {
        __typename?: 'Media';
        id: number;
        title?: {
          __typename?: 'MediaTitle';
          english?: Maybe<string>;
          native?: Maybe<string>;
        } | null;
        status?: string;
        type?: string;
        startDate?: {
          __typename?: 'FuzzyDate';
          year?: Maybe<number>;
          month?: Maybe<number>;
          day?: Maybe<number>;
        } | null;
        endDate?: {
          __typename?: 'FuzzyDate';
          year?: Maybe<number>;
          month?: Maybe<number>;
          day?: Maybe<number>;
        } | null;
        description?: Maybe<string>;
        coverImage?: {
          __typename?: 'MediaCoverImage';
          large?: Maybe<string>;
          medium?: Maybe<string>;
        } | null;
      } | null
    > | null;
  } | null;
};

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

export function useGetAnimePageQuery(baseOptions?: Apollo.QueryHookOptions<GetAnimePageQuery, GetAnimePageQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetAnimePageQuery, GetAnimePageQueryVariables>(GetAnimePageDocument, options);
}

export function useGetAnimePageLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAnimePageQuery, GetAnimePageQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetAnimePageQuery, GetAnimePageQueryVariables>(GetAnimePageDocument, options);
}

export type GetAnimePageQueryHookResult = ReturnType<typeof useGetAnimePageQuery>;
export type GetAnimePageLazyQueryHookResult = ReturnType<typeof useGetAnimePageLazyQuery>;
export type GetAnimePageQueryResult = Apollo.ApolloQueryResult<GetAnimePageQuery>;
