import { gql } from "@apollo/client";

/**
 * Query to fetch paginated anime media from AniList
 * Returns page info and media items with all necessary fields
 */
export const GET_ANIME_PAGE = gql`
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
