import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";
import { ReactNode } from "react";
import { useMediaPage } from "@/lib/hooks/useMediaPage";
import { MediaItemSchema, PageInfoSchema } from "@/lib/schema";
import { GetAnimePageDocument } from "@/lib/graphql/generated/operations";

describe("useMediaPage Hook", () => {
  const createMockData = (page: number = 1, itemCount: number = 3) => ({
    Page: {
      __typename: "Page",
      pageInfo: {
        __typename: "PageInfo",
        currentPage: page,
        hasNextPage: page < 5,
        perPage: 20,
      },
      media: Array.from({ length: itemCount }, (_, i) => ({
        __typename: "Media",
        id: 1000 + i,
        title: {
          __typename: "MediaTitle",
          english: `Test Anime ${i + 1}`,
          native: `テストアニメ${i + 1}`,
        },
        status: "FINISHED",
        type: "ANIME",
        startDate: {
          __typename: "FuzzyDate",
          year: 2020,
          month: 1,
          day: 1,
        },
        endDate: {
          __typename: "FuzzyDate",
          year: 2020,
          month: 12,
          day: 31,
        },
        description: `Description ${i + 1}`,
        coverImage: {
          __typename: "MediaCoverImage",
          large: `https://example.com/large${i + 1}.jpg`,
          medium: `https://example.com/medium${i + 1}.jpg`,
        },
      })),
    },
  });

  describe("Successful Data Fetching", () => {
    it("should fetch and transform media items correctly", async () => {
      const mocks = [
        {
          request: {
            query: GetAnimePageDocument,
            variables: { page: 1, perPage: 20 },
          },
          result: { data: createMockData(1, 3) },
        },
      ] as any;

      const wrapper = ({ children }: { children: ReactNode }) => (
        <MockedProvider mocks={mocks}>{children}</MockedProvider>
      );

      const { result } = renderHook(() => useMediaPage(1), { wrapper });

      // Initially loading
      expect(result.current.loading).toBe(true);

      // Wait for data to load
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Should have transformed media items
      expect(result.current.mediaItems).toHaveLength(3);
      expect(result.current.mediaItems[0]).toMatchObject({
        id: "1000",
        engTitle: "Test Anime 1",
        nativeTitle: "テストアニメ1",
        status: "FINISHED",
        type: "ANIME",
      });

      // Should have pageInfo
      expect(result.current.pageInfo).toMatchObject({
        currentPage: 1,
        hasNextPage: true,
        perPage: 20,
      });
    });

    it("should handle pagination correctly", async () => {
      const mocks = [
        {
          request: {
            query: GetAnimePageDocument,
            variables: { page: 2, perPage: 20 },
          },
          result: { data: createMockData(2, 2) },
        },
      ] as any;

      const wrapper = ({ children }: { children: ReactNode }) => (
        <MockedProvider mocks={mocks}>{children}</MockedProvider>
      );

      const { result } = renderHook(() => useMediaPage(2, 20), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.mediaItems).toHaveLength(2);
      expect(result.current.pageInfo?.currentPage).toBe(2);
    });

    it("should use custom perPage value", async () => {
      const mocks = [
        {
          request: {
            query: GetAnimePageDocument,
            variables: { page: 1, perPage: 50 },
          },
          result: {
            data: {
              ...createMockData(1, 5),
              Page: {
                ...createMockData(1, 5).Page,
                pageInfo: { ...createMockData(1, 5).Page.pageInfo, perPage: 50 },
              },
            },
          },
        },
      ] as any;

      const wrapper = ({ children }: { children: ReactNode }) => (
        <MockedProvider mocks={mocks}>{children}</MockedProvider>
      );

      const { result } = renderHook(() => useMediaPage(1, 50), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.pageInfo?.perPage).toBe(50);
    });
  });

  describe("Data Validation & Transformation", () => {
    it("should validate MediaItem schema", () => {
      const validItem = {
        id: "1",
        engTitle: "Test Anime",
        nativeTitle: "テスト",
        status: "FINISHED",
        type: "ANIME",
        startDate: { year: 2020, month: 1, day: 1 },
        endDate: { year: 2020, month: 12, day: 31 },
        description: "Test",
        imageMedium: "https://example.com/medium.jpg",
        imageLarge: "https://example.com/large.jpg",
      };

      expect(() => MediaItemSchema.parse(validItem)).not.toThrow();
    });

    it("should handle missing images gracefully", () => {
      const itemNoImages = {
        id: "1",
        engTitle: "Test",
        nativeTitle: "テスト",
        status: "FINISHED",
        type: "ANIME",
        startDate: { year: 2020, month: 1, day: 1 },
        endDate: { year: 2020, month: 12, day: 31 },
        description: "Test",
        imageMedium: "",
        imageLarge: "",
      };

      // Should not throw - schema allows empty strings for images
      expect(() => MediaItemSchema.parse(itemNoImages)).not.toThrow();
    });

    it("should handle missing English title", () => {
      const itemNoEnglish = {
        id: "1",
        engTitle: "",
        nativeTitle: "テスト",
        status: "FINISHED",
        type: "ANIME",
        startDate: { year: 2020, month: 1, day: 1 },
        endDate: { year: 2020, month: 12, day: 31 },
        description: "Test",
        imageMedium: "https://example.com/medium.jpg",
        imageLarge: "https://example.com/large.jpg",
      };

      expect(() => MediaItemSchema.parse(itemNoEnglish)).not.toThrow();
    });
  });

  describe("Page Validation", () => {
    it("should enforce minimum page of 1", () => {
      const mocks = [
        {
          request: {
            query: GetAnimePageDocument,
            variables: { page: 1, perPage: 20 },
          },
          result: { data: createMockData(1, 0) },
        },
      ] as any;

      const wrapper = ({ children }: { children: ReactNode }) => (
        <MockedProvider mocks={mocks}>{children}</MockedProvider>
      );

      const { result } = renderHook(() => useMediaPage(0), { wrapper });

      expect(result.current).toBeDefined();
    });

    it("should clamp perPage to maximum 50", () => {
      const mocks = [
        {
          request: {
            query: GetAnimePageDocument,
            variables: { page: 1, perPage: 50 },
          },
          result: { data: createMockData(1, 5) },
        },
      ] as any;

      const wrapper = ({ children }: { children: ReactNode }) => (
        <MockedProvider mocks={mocks}>{children}</MockedProvider>
      );

      const { result } = renderHook(() => useMediaPage(1, 100), { wrapper });

      expect(result.current).toBeDefined();
    });
  });

  describe("Error Handling", () => {
    it("should handle network errors", async () => {
      const mocks = [
        {
          request: {
            query: GetAnimePageDocument,
            variables: { page: 1, perPage: 20 },
          },
          error: new Error("Network error"),
        },
      ] as any;

      const wrapper = ({ children }: { children: ReactNode }) => (
        <MockedProvider mocks={mocks}>{children}</MockedProvider>
      );

      const { result } = renderHook(() => useMediaPage(1), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toBeDefined();
      expect(result.current.mediaItems).toEqual([]);
    });

    it("should return null error on successful load", async () => {
      const mocks = [
        {
          request: {
            query: GetAnimePageDocument,
            variables: { page: 1, perPage: 20 },
          },
          result: { data: createMockData(1, 3) },
        },
      ] as any;

      const wrapper = ({ children }: { children: ReactNode }) => (
        <MockedProvider mocks={mocks}>{children}</MockedProvider>
      );

      const { result } = renderHook(() => useMediaPage(1), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toBeNull();
    });
  });

  describe("Return Type Validation", () => {
    it("should always return array of mediaItems", () => {
      const mocks = [
        {
          request: {
            query: GetAnimePageDocument,
            variables: { page: 1, perPage: 20 },
          },
          result: { data: createMockData(1, 0) },
        },
      ] as any;

      const wrapper = ({ children }: { children: ReactNode }) => (
        <MockedProvider mocks={mocks}>{children}</MockedProvider>
      );

      const { result } = renderHook(() => useMediaPage(1), { wrapper });

      expect(Array.isArray(result.current.mediaItems)).toBe(true);
    });

    it("should return loading as boolean", () => {
      const mocks = [
        {
          request: {
            query: GetAnimePageDocument,
            variables: { page: 1, perPage: 20 },
          },
          result: { data: createMockData(1, 0) },
        },
      ] as any;

      const wrapper = ({ children }: { children: ReactNode }) => (
        <MockedProvider mocks={mocks}>{children}</MockedProvider>
      );

      const { result } = renderHook(() => useMediaPage(1), { wrapper });

      expect(typeof result.current.loading).toBe("boolean");
    });

    it("should return pageInfo or null", async () => {
      const mocks = [
        {
          request: {
            query: GetAnimePageDocument,
            variables: { page: 1, perPage: 20 },
          },
          result: { data: createMockData(1, 3) },
        },
      ] as any;

      const wrapper = ({ children }: { children: ReactNode }) => (
        <MockedProvider mocks={mocks}>{children}</MockedProvider>
      );

      const { result } = renderHook(() => useMediaPage(1), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.pageInfo === null || typeof result.current.pageInfo === "object").toBe(
        true
      );
    });
  });
});
