import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  isLocalStorageAvailable,
  getProfile,
  saveProfile,
  updateProfile,
  deleteProfile,
} from "@/lib/storage";

describe("Storage Utilities", () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe("isLocalStorageAvailable", () => {
    it("should return true when localStorage is available", () => {
      expect(isLocalStorageAvailable()).toBe(true);
    });

    it("should return false when window is undefined (SSR)", () => {
      const originalWindow = global.window;
      // @ts-ignore - intentionally removing window
      delete global.window;
      expect(isLocalStorageAvailable()).toBe(false);
      global.window = originalWindow;
    });
  });

  describe("saveProfile", () => {
    it("should save a profile to localStorage", () => {
      const profile = { username: "john_doe", jobTitle: "Developer" };
      const result = saveProfile(profile);
      expect(result).toBe(true);

      const stored = localStorage.getItem("user-profile");
      expect(stored).toBeTruthy();
      expect(JSON.parse(stored!)).toEqual(profile);
    });

    it("should return false if profile validation fails", () => {
      const invalidProfile = { username: "", jobTitle: "Developer" };
      // @ts-ignore - intentionally passing invalid data
      const result = saveProfile(invalidProfile);
      expect(result).toBe(false);
    });
  });

  describe("getProfile", () => {
    it("should retrieve a saved profile", () => {
      const profile = { username: "john_doe", jobTitle: "Developer" };
      saveProfile(profile);

      const retrieved = getProfile();
      expect(retrieved).toEqual(profile);
    });

    it("should return null if no profile is saved", () => {
      const retrieved = getProfile();
      expect(retrieved).toBeNull();
    });

    it("should return null if stored data is invalid", () => {
      localStorage.setItem("user-profile", "invalid-json");
      const retrieved = getProfile();
      expect(retrieved).toBeNull();
    });
  });

  describe("updateProfile", () => {
    it("should update an existing profile", () => {
      const initialProfile = { username: "john_doe", jobTitle: "Developer" };
      saveProfile(initialProfile);

      const updatedProfile = { username: "john_doe", jobTitle: "Senior Developer" };
      const result = updateProfile(updatedProfile);
      expect(result).toBe(true);

      const retrieved = getProfile();
      expect(retrieved?.jobTitle).toBe("Senior Developer");
    });

    it("should return false if update validation fails", () => {
      const profile = { username: "john_doe", jobTitle: "Developer" };
      saveProfile(profile);

      const invalidUpdate = { username: "", jobTitle: "Developer" };
      // @ts-ignore - intentionally passing invalid data
      const result = updateProfile(invalidUpdate);
      expect(result).toBe(false);
    });

    it("should return false if no profile exists yet", () => {
      const profile = { username: "john_doe", jobTitle: "Developer" };
      const result = updateProfile(profile);
      expect(result).toBe(false);
    });
  });

  describe("deleteProfile", () => {
    it("should delete a saved profile", () => {
      const profile = { username: "john_doe", jobTitle: "Developer" };
      saveProfile(profile);

      const result = deleteProfile();
      expect(result).toBe(true);

      const retrieved = getProfile();
      expect(retrieved).toBeNull();
    });

    it("should return true even if no profile exists", () => {
      const result = deleteProfile();
      expect(result).toBe(true);
    });
  });
});
