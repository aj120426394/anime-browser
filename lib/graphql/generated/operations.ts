import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  CountryCode: { input: any; output: any; }
  FuzzyDateInt: { input: any; output: any; }
  Json: { input: any; output: any; }
};

/** Activity sort enums */
export type ActivitySort =
  | 'ID'
  | 'ID_DESC'
  | 'PINNED';

/** Activity type enum. */
export type ActivityType =
  /** A anime list update activity */
  | 'ANIME_LIST'
  /** A manga list update activity */
  | 'MANGA_LIST'
  /** Anime & Manga list update, only used in query arguments */
  | 'MEDIA_LIST'
  /** A text message activity sent to another user */
  | 'MESSAGE'
  /** A text activity */
  | 'TEXT';

export type AiringScheduleInput = {
  airingAt?: InputMaybe<Scalars['Int']['input']>;
  episode?: InputMaybe<Scalars['Int']['input']>;
  timeUntilAiring?: InputMaybe<Scalars['Int']['input']>;
};

/** Airing schedule sort enums */
export type AiringSort =
  | 'EPISODE'
  | 'EPISODE_DESC'
  | 'ID'
  | 'ID_DESC'
  | 'MEDIA_ID'
  | 'MEDIA_ID_DESC'
  | 'TIME'
  | 'TIME_DESC';

export type AniChartHighlightInput = {
  highlight?: InputMaybe<Scalars['String']['input']>;
  mediaId?: InputMaybe<Scalars['Int']['input']>;
};

/** The names of the character */
export type CharacterNameInput = {
  /** Other names the character might be referred by */
  alternative?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  /** Other names the character might be referred to as but are spoilers */
  alternativeSpoiler?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  /** The character's given name */
  first?: InputMaybe<Scalars['String']['input']>;
  /** The character's surname */
  last?: InputMaybe<Scalars['String']['input']>;
  /** The character's middle name */
  middle?: InputMaybe<Scalars['String']['input']>;
  /** The character's full name in their native language */
  native?: InputMaybe<Scalars['String']['input']>;
};

/** The role the character plays in the media */
export type CharacterRole =
  /** A background character in the media */
  | 'BACKGROUND'
  /** A primary character role in the media */
  | 'MAIN'
  /** A supporting character role in the media */
  | 'SUPPORTING';

/** Character sort enums */
export type CharacterSort =
  | 'FAVOURITES'
  | 'FAVOURITES_DESC'
  | 'ID'
  | 'ID_DESC'
  /** Order manually decided by moderators */
  | 'RELEVANCE'
  | 'ROLE'
  | 'ROLE_DESC'
  | 'SEARCH_MATCH';

export type ExternalLinkMediaType =
  | 'ANIME'
  | 'MANGA'
  | 'STAFF';

export type ExternalLinkType =
  | 'INFO'
  | 'SOCIAL'
  | 'STREAMING';

/** Date object that allows for incomplete date values (fuzzy) */
export type FuzzyDateInput = {
  /** Numeric Day (24) */
  day?: InputMaybe<Scalars['Int']['input']>;
  /** Numeric Month (3) */
  month?: InputMaybe<Scalars['Int']['input']>;
  /** Numeric Year (2017) */
  year?: InputMaybe<Scalars['Int']['input']>;
};

/** Types that can be liked */
export type LikeableType =
  | 'ACTIVITY'
  | 'ACTIVITY_REPLY'
  | 'THREAD'
  | 'THREAD_COMMENT';

export type ListActivityOptionInput = {
  disabled?: InputMaybe<Scalars['Boolean']['input']>;
  type?: InputMaybe<MediaListStatus>;
};

/** An external link to another site related to the media */
export type MediaExternalLinkInput = {
  /** The id of the external link */
  id: Scalars['Int']['input'];
  /** The site location of the external link */
  site: Scalars['String']['input'];
  /** The url of the external link */
  url: Scalars['String']['input'];
};

/** The format the media was released in */
export type MediaFormat =
  /** Professionally published manga with more than one chapter */
  | 'MANGA'
  /** Anime movies with a theatrical release */
  | 'MOVIE'
  /** Short anime released as a music video */
  | 'MUSIC'
  /** Written books released as a series of light novels */
  | 'NOVEL'
  /** (Original Net Animation) Anime that have been originally released online or are only available through streaming services. */
  | 'ONA'
  /** Manga with just one chapter */
  | 'ONE_SHOT'
  /** (Original Video Animation) Anime that have been released directly on DVD/Blu-ray without originally going through a theatrical release or television broadcast */
  | 'OVA'
  /** Special episodes that have been included in DVD/Blu-ray releases, picture dramas, pilots, etc */
  | 'SPECIAL'
  /** Anime broadcast on television */
  | 'TV'
  /** Anime which are under 15 minutes in length and broadcast on television */
  | 'TV_SHORT';

/** A user's list options for anime or manga lists */
export type MediaListOptionsInput = {
  /** The names of the user's advanced scoring sections */
  advancedScoring?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  /** If advanced scoring is enabled */
  advancedScoringEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  /** The names of the user's custom lists */
  customLists?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  /** The order each list should be displayed in */
  sectionOrder?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  /** If the completed sections of the list should be separated by format */
  splitCompletedSectionByFormat?: InputMaybe<Scalars['Boolean']['input']>;
  /** list theme */
  theme?: InputMaybe<Scalars['String']['input']>;
};

/** Media list sort enums */
export type MediaListSort =
  | 'ADDED_TIME'
  | 'ADDED_TIME_DESC'
  | 'FINISHED_ON'
  | 'FINISHED_ON_DESC'
  | 'MEDIA_ID'
  | 'MEDIA_ID_DESC'
  | 'MEDIA_POPULARITY'
  | 'MEDIA_POPULARITY_DESC'
  | 'MEDIA_TITLE_ENGLISH'
  | 'MEDIA_TITLE_ENGLISH_DESC'
  | 'MEDIA_TITLE_NATIVE'
  | 'MEDIA_TITLE_NATIVE_DESC'
  | 'MEDIA_TITLE_ROMAJI'
  | 'MEDIA_TITLE_ROMAJI_DESC'
  | 'PRIORITY'
  | 'PRIORITY_DESC'
  | 'PROGRESS'
  | 'PROGRESS_DESC'
  | 'PROGRESS_VOLUMES'
  | 'PROGRESS_VOLUMES_DESC'
  | 'REPEAT'
  | 'REPEAT_DESC'
  | 'SCORE'
  | 'SCORE_DESC'
  | 'STARTED_ON'
  | 'STARTED_ON_DESC'
  | 'STATUS'
  | 'STATUS_DESC'
  | 'UPDATED_TIME'
  | 'UPDATED_TIME_DESC';

/** Media list watching/reading status enum. */
export type MediaListStatus =
  /** Finished watching/reading */
  | 'COMPLETED'
  /** Currently watching/reading */
  | 'CURRENT'
  /** Stopped watching/reading before completing */
  | 'DROPPED'
  /** Paused watching/reading */
  | 'PAUSED'
  /** Planning to watch/read */
  | 'PLANNING'
  /** Re-watching/reading */
  | 'REPEATING';

/** The type of ranking */
export type MediaRankType =
  /** Ranking is based on the media's popularity */
  | 'POPULAR'
  /** Ranking is based on the media's ratings/score */
  | 'RATED';

/** Type of relation media has to its parent. */
export type MediaRelation =
  /** An adaption of this media into a different format */
  | 'ADAPTATION'
  /** An alternative version of the same media */
  | 'ALTERNATIVE'
  /** Shares at least 1 character */
  | 'CHARACTER'
  /** Version 2 only. */
  | 'COMPILATION'
  /** Version 2 only. */
  | 'CONTAINS'
  /** Other */
  | 'OTHER'
  /** The media a side story is from */
  | 'PARENT'
  /** Released before the relation */
  | 'PREQUEL'
  /** Released after the relation */
  | 'SEQUEL'
  /** A side story of the parent media */
  | 'SIDE_STORY'
  /** Version 2 only. The source material the media was adapted from */
  | 'SOURCE'
  /** An alternative version of the media with a different primary focus */
  | 'SPIN_OFF'
  /** A shortened and summarized version */
  | 'SUMMARY';

export type MediaSeason =
  /** Months September to November */
  | 'FALL'
  /** Months March to May */
  | 'SPRING'
  /** Months June to August */
  | 'SUMMER'
  /** Months December to February */
  | 'WINTER';

/** Media sort enums */
export type MediaSort =
  | 'CHAPTERS'
  | 'CHAPTERS_DESC'
  | 'DURATION'
  | 'DURATION_DESC'
  | 'END_DATE'
  | 'END_DATE_DESC'
  | 'EPISODES'
  | 'EPISODES_DESC'
  | 'FAVOURITES'
  | 'FAVOURITES_DESC'
  | 'FORMAT'
  | 'FORMAT_DESC'
  | 'ID'
  | 'ID_DESC'
  | 'POPULARITY'
  | 'POPULARITY_DESC'
  | 'SCORE'
  | 'SCORE_DESC'
  | 'SEARCH_MATCH'
  | 'START_DATE'
  | 'START_DATE_DESC'
  | 'STATUS'
  | 'STATUS_DESC'
  | 'TITLE_ENGLISH'
  | 'TITLE_ENGLISH_DESC'
  | 'TITLE_NATIVE'
  | 'TITLE_NATIVE_DESC'
  | 'TITLE_ROMAJI'
  | 'TITLE_ROMAJI_DESC'
  | 'TRENDING'
  | 'TRENDING_DESC'
  | 'TYPE'
  | 'TYPE_DESC'
  | 'UPDATED_AT'
  | 'UPDATED_AT_DESC'
  | 'VOLUMES'
  | 'VOLUMES_DESC';

/** Source type the media was adapted from */
export type MediaSource =
  /** Version 2+ only. Japanese Anime */
  | 'ANIME'
  /** Version 3 only. Comics excluding manga */
  | 'COMIC'
  /** Version 2+ only. Self-published works */
  | 'DOUJINSHI'
  /** Version 3 only. Games excluding video games */
  | 'GAME'
  /** Written work published in volumes */
  | 'LIGHT_NOVEL'
  /** Version 3 only. Live action media such as movies or TV show */
  | 'LIVE_ACTION'
  /** Asian comic book */
  | 'MANGA'
  /** Version 3 only. Multimedia project */
  | 'MULTIMEDIA_PROJECT'
  /** Version 2+ only. Written works not published in volumes */
  | 'NOVEL'
  /** An original production not based of another work */
  | 'ORIGINAL'
  /** Other */
  | 'OTHER'
  /** Version 3 only. Picture book */
  | 'PICTURE_BOOK'
  /** Video game */
  | 'VIDEO_GAME'
  /** Video game driven primary by text and narrative */
  | 'VISUAL_NOVEL'
  /** Version 3 only. Written works published online */
  | 'WEB_NOVEL';

/** The current releasing status of the media */
export type MediaStatus =
  /** Ended before the work could be finished */
  | 'CANCELLED'
  /** Has completed and is no longer being released */
  | 'FINISHED'
  /** Version 2 only. Is currently paused from releasing and will resume at a later date */
  | 'HIATUS'
  /** To be released at a later date */
  | 'NOT_YET_RELEASED'
  /** Currently releasing */
  | 'RELEASING';

/** The official titles of the media in various languages */
export type MediaTitleInput = {
  /** The official english title */
  english?: InputMaybe<Scalars['String']['input']>;
  /** Official title in it's native language */
  native?: InputMaybe<Scalars['String']['input']>;
  /** The romanization of the native language title */
  romaji?: InputMaybe<Scalars['String']['input']>;
};

/** Media trend sort enums */
export type MediaTrendSort =
  | 'DATE'
  | 'DATE_DESC'
  | 'EPISODE'
  | 'EPISODE_DESC'
  | 'ID'
  | 'ID_DESC'
  | 'MEDIA_ID'
  | 'MEDIA_ID_DESC'
  | 'POPULARITY'
  | 'POPULARITY_DESC'
  | 'SCORE'
  | 'SCORE_DESC'
  | 'TRENDING'
  | 'TRENDING_DESC';

/** Media type enum, anime or manga. */
export type MediaType =
  /** Japanese Anime */
  | 'ANIME'
  /** Asian comic */
  | 'MANGA';

export type ModActionType =
  | 'ANON'
  | 'BAN'
  | 'DELETE'
  | 'EDIT'
  | 'EXPIRE'
  | 'NOTE'
  | 'REPORT'
  | 'RESET';

/** Mod role enums */
export type ModRole =
  /** An AniList administrator */
  | 'ADMIN'
  /** An anime data moderator */
  | 'ANIME_DATA'
  /** A character data moderator */
  | 'CHARACTER_DATA'
  /** A community moderator */
  | 'COMMUNITY'
  /** An AniList developer */
  | 'DEVELOPER'
  /** A discord community moderator */
  | 'DISCORD_COMMUNITY'
  /** A lead anime data moderator */
  | 'LEAD_ANIME_DATA'
  /** A lead community moderator */
  | 'LEAD_COMMUNITY'
  /** A head developer of AniList */
  | 'LEAD_DEVELOPER'
  /** A lead manga data moderator */
  | 'LEAD_MANGA_DATA'
  /** A lead social media moderator */
  | 'LEAD_SOCIAL_MEDIA'
  /** A manga data moderator */
  | 'MANGA_DATA'
  /** A retired moderator */
  | 'RETIRED'
  /** A social media moderator */
  | 'SOCIAL_MEDIA'
  /** A staff data moderator */
  | 'STAFF_DATA';

/** Notification option input */
export type NotificationOptionInput = {
  /** Whether this type of notification is enabled */
  enabled?: InputMaybe<Scalars['Boolean']['input']>;
  /** The type of notification */
  type?: InputMaybe<NotificationType>;
};

/** Notification type enum */
export type NotificationType =
  /** A user has liked your activity */
  | 'ACTIVITY_LIKE'
  /** A user has mentioned you in their activity */
  | 'ACTIVITY_MENTION'
  /** A user has sent you message */
  | 'ACTIVITY_MESSAGE'
  /** A user has replied to your activity */
  | 'ACTIVITY_REPLY'
  /** A user has liked your activity reply */
  | 'ACTIVITY_REPLY_LIKE'
  /** A user has replied to activity you have also replied to */
  | 'ACTIVITY_REPLY_SUBSCRIBED'
  /** An anime you are currently watching has aired */
  | 'AIRING'
  /** A user has followed you */
  | 'FOLLOWING'
  /** An anime or manga has had a data change that affects how a user may track it in their lists */
  | 'MEDIA_DATA_CHANGE'
  /** An anime or manga on the user's list has been deleted from the site */
  | 'MEDIA_DELETION'
  /** Anime or manga entries on the user's list have been merged into a single entry */
  | 'MEDIA_MERGE'
  /** A new anime or manga has been added to the site where its related media is on the user's list */
  | 'RELATED_MEDIA_ADDITION'
  /** A user has liked your forum comment */
  | 'THREAD_COMMENT_LIKE'
  /** A user has mentioned you in a forum comment */
  | 'THREAD_COMMENT_MENTION'
  /** A user has replied to your forum comment */
  | 'THREAD_COMMENT_REPLY'
  /** A user has liked your forum thread */
  | 'THREAD_LIKE'
  /** A user has commented in one of your subscribed forum threads */
  | 'THREAD_SUBSCRIBED';

/** Recommendation rating enums */
export type RecommendationRating =
  | 'NO_RATING'
  | 'RATE_DOWN'
  | 'RATE_UP';

/** Recommendation sort enums */
export type RecommendationSort =
  | 'ID'
  | 'ID_DESC'
  | 'RATING'
  | 'RATING_DESC';

/** Review rating enums */
export type ReviewRating =
  | 'DOWN_VOTE'
  | 'NO_VOTE'
  | 'UP_VOTE';

/** Review sort enums */
export type ReviewSort =
  | 'CREATED_AT'
  | 'CREATED_AT_DESC'
  | 'ID'
  | 'ID_DESC'
  | 'RATING'
  | 'RATING_DESC'
  | 'SCORE'
  | 'SCORE_DESC'
  | 'UPDATED_AT'
  | 'UPDATED_AT_DESC';

/** Revision history actions */
export type RevisionHistoryAction =
  | 'CREATE'
  | 'EDIT';

/** Media list scoring type */
export type ScoreFormat =
  /** An integer from 0-3. Should be represented in Smileys. 0 => No Score, 1 => :(, 2 => :|, 3 => :) */
  | 'POINT_3'
  /** An integer from 0-5. Should be represented in Stars */
  | 'POINT_5'
  /** An integer from 0-10 */
  | 'POINT_10'
  /** A float from 0-10 with 1 decimal place */
  | 'POINT_10_DECIMAL'
  /** An integer from 0-100 */
  | 'POINT_100';

/** Site trend sort enums */
export type SiteTrendSort =
  | 'CHANGE'
  | 'CHANGE_DESC'
  | 'COUNT'
  | 'COUNT_DESC'
  | 'DATE'
  | 'DATE_DESC';

/** The primary language of the voice actor */
export type StaffLanguage =
  /** English */
  | 'ENGLISH'
  /** French */
  | 'FRENCH'
  /** German */
  | 'GERMAN'
  /** Hebrew */
  | 'HEBREW'
  /** Hungarian */
  | 'HUNGARIAN'
  /** Italian */
  | 'ITALIAN'
  /** Japanese */
  | 'JAPANESE'
  /** Korean */
  | 'KOREAN'
  /** Portuguese */
  | 'PORTUGUESE'
  /** Spanish */
  | 'SPANISH';

/** The names of the staff member */
export type StaffNameInput = {
  /** Other names the character might be referred by */
  alternative?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  /** The person's given name */
  first?: InputMaybe<Scalars['String']['input']>;
  /** The person's surname */
  last?: InputMaybe<Scalars['String']['input']>;
  /** The person's middle name */
  middle?: InputMaybe<Scalars['String']['input']>;
  /** The person's full name in their native language */
  native?: InputMaybe<Scalars['String']['input']>;
};

/** Staff sort enums */
export type StaffSort =
  | 'FAVOURITES'
  | 'FAVOURITES_DESC'
  | 'ID'
  | 'ID_DESC'
  | 'LANGUAGE'
  | 'LANGUAGE_DESC'
  /** Order manually decided by moderators */
  | 'RELEVANCE'
  | 'ROLE'
  | 'ROLE_DESC'
  | 'SEARCH_MATCH';

/** Studio sort enums */
export type StudioSort =
  | 'FAVOURITES'
  | 'FAVOURITES_DESC'
  | 'ID'
  | 'ID_DESC'
  | 'NAME'
  | 'NAME_DESC'
  | 'SEARCH_MATCH';

/** Submission sort enums */
export type SubmissionSort =
  | 'ID'
  | 'ID_DESC';

/** Submission status */
export type SubmissionStatus =
  | 'ACCEPTED'
  | 'PARTIALLY_ACCEPTED'
  | 'PENDING'
  | 'REJECTED';

/** Thread comments sort enums */
export type ThreadCommentSort =
  | 'ID'
  | 'ID_DESC';

/** Thread sort enums */
export type ThreadSort =
  | 'CREATED_AT'
  | 'CREATED_AT_DESC'
  | 'ID'
  | 'ID_DESC'
  | 'IS_STICKY'
  | 'REPLIED_AT'
  | 'REPLIED_AT_DESC'
  | 'REPLY_COUNT'
  | 'REPLY_COUNT_DESC'
  | 'SEARCH_MATCH'
  | 'TITLE'
  | 'TITLE_DESC'
  | 'UPDATED_AT'
  | 'UPDATED_AT_DESC'
  | 'VIEW_COUNT'
  | 'VIEW_COUNT_DESC';

/** User sort enums */
export type UserSort =
  | 'CHAPTERS_READ'
  | 'CHAPTERS_READ_DESC'
  | 'ID'
  | 'ID_DESC'
  | 'SEARCH_MATCH'
  | 'USERNAME'
  | 'USERNAME_DESC'
  | 'WATCHED_TIME'
  | 'WATCHED_TIME_DESC';

/** The language the user wants to see staff and character names in */
export type UserStaffNameLanguage =
  /** The staff or character's name in their native language */
  | 'NATIVE'
  /** The romanization of the staff or character's native name */
  | 'ROMAJI'
  /** The romanization of the staff or character's native name, with western name ordering */
  | 'ROMAJI_WESTERN';

/** User statistics sort enum */
export type UserStatisticsSort =
  | 'COUNT'
  | 'COUNT_DESC'
  | 'ID'
  | 'ID_DESC'
  | 'MEAN_SCORE'
  | 'MEAN_SCORE_DESC'
  | 'PROGRESS'
  | 'PROGRESS_DESC';

/** The language the user wants to see media titles in */
export type UserTitleLanguage =
  /** The official english title */
  | 'ENGLISH'
  /** The official english title, stylised by media creator */
  | 'ENGLISH_STYLISED'
  /** Official title in it's native language */
  | 'NATIVE'
  /** Official title in it's native language, stylised by media creator */
  | 'NATIVE_STYLISED'
  /** The romanization of the native language title */
  | 'ROMAJI'
  /** The romanization of the native language title, stylised by media creator */
  | 'ROMAJI_STYLISED';

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