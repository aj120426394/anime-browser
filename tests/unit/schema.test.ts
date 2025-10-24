import { describe, it, expect } from "vitest";
import { ProfileSchema, MediaStatusSchema, MediaTypeSchema, PageInfoSchema } from "@/lib/schema";
import { z } from "zod";

describe("ProfileSchema", () => {
  it("should validate a valid profile", () => {
    const validProfile = {
      username: "john_doe",
      jobTitle: "Software Engineer",
    };
    expect(() => ProfileSchema.parse(validProfile)).not.toThrow();
  });

  it("should fail when username is empty", () => {
    const invalidProfile = {
      username: "",
      jobTitle: "Software Engineer",
    };
    expect(() => ProfileSchema.parse(invalidProfile)).toThrow();
  });

  it("should fail when jobTitle is empty", () => {
    const invalidProfile = {
      username: "john_doe",
      jobTitle: "",
    };
    expect(() => ProfileSchema.parse(invalidProfile)).toThrow();
  });

  it("should trim whitespace from username and jobTitle", () => {
    const profile = {
      username: "  john_doe  ",
      jobTitle: "  Software Engineer  ",
    };
    const result = ProfileSchema.parse(profile);
    expect(result.username).toBe("john_doe");
    expect(result.jobTitle).toBe("Software Engineer");
  });

  it("should fail when username exceeds max length", () => {
    const invalidProfile = {
      username: "a".repeat(51),
      jobTitle: "Software Engineer",
    };
    expect(() => ProfileSchema.parse(invalidProfile)).toThrow();
  });

  it("should fail when jobTitle exceeds max length", () => {
    const invalidProfile = {
      username: "john_doe",
      jobTitle: "a".repeat(101),
    };
    expect(() => ProfileSchema.parse(invalidProfile)).toThrow();
  });

  it("should accept max length username (50 chars)", () => {
    const validProfile = {
      username: "a".repeat(50),
      jobTitle: "Software Engineer",
    };
    expect(() => ProfileSchema.parse(validProfile)).not.toThrow();
  });

  it("should accept max length jobTitle (100 chars)", () => {
    const validProfile = {
      username: "john_doe",
      jobTitle: "a".repeat(100),
    };
    expect(() => ProfileSchema.parse(validProfile)).not.toThrow();
  });
});

describe("MediaStatusSchema", () => {
  it("should accept valid media statuses", () => {
    const validStatuses = ["FINISHED", "RELEASING", "NOT_YET_RELEASED", "CANCELLED", "HIATUS"];
    validStatuses.forEach((status) => {
      expect(() => MediaStatusSchema.parse(status)).not.toThrow();
    });
  });

  it("should reject invalid media status", () => {
    expect(() => MediaStatusSchema.parse("INVALID_STATUS")).toThrow();
  });
});

describe("MediaTypeSchema", () => {
  it("should accept ANIME type", () => {
    expect(() => MediaTypeSchema.parse("ANIME")).not.toThrow();
  });

  it("should accept MANGA type", () => {
    expect(() => MediaTypeSchema.parse("MANGA")).not.toThrow();
  });

  it("should reject invalid media type", () => {
    expect(() => MediaTypeSchema.parse("INVALID_TYPE")).toThrow();
  });
});

describe("PageInfoSchema", () => {
  it("should validate valid page info", () => {
    const validPageInfo = {
      currentPage: 1,
      hasNextPage: true,
      perPage: 20,
    };
    expect(() => PageInfoSchema.parse(validPageInfo)).not.toThrow();
  });

  it("should fail when currentPage is less than 1", () => {
    const invalidPageInfo = {
      currentPage: 0,
      hasNextPage: true,
      perPage: 20,
    };
    expect(() => PageInfoSchema.parse(invalidPageInfo)).toThrow();
  });

  it("should fail when perPage exceeds 50", () => {
    const invalidPageInfo = {
      currentPage: 1,
      hasNextPage: true,
      perPage: 51,
    };
    expect(() => PageInfoSchema.parse(invalidPageInfo)).toThrow();
  });

  it("should accept max perPage of 50", () => {
    const validPageInfo = {
      currentPage: 1,
      hasNextPage: true,
      perPage: 50,
    };
    expect(() => PageInfoSchema.parse(validPageInfo)).not.toThrow();
  });
});
