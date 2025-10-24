import { ProfileSchema, Profile } from "./schema";

const PROFILE_KEY = "user-profile";

/**
 * Storage Utilities
 * Client-side localStorage helpers with SSR safety checks
 * localStorage is not available during server-side rendering
 */

/**
 * Check if localStorage is available and accessible
 * SSR safety: Prevents "ReferenceError: localStorage is not defined" on server
 * Also handles private browsing mode where storage throws SecurityError
 */
export function isLocalStorageAvailable(): boolean {
  try {
    // Test localStorage access - private browsing may throw SecurityError
    const test = "__storage_test__";
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    // Returns false if:
    // - Code running on server (window undefined)
    // - Private browsing mode enabled
    // - Storage quota exceeded
    return false;
  }
}

/**
 * Get profile from localStorage with validation
 * Returns null if:
 * - localStorage unavailable (SSR, private browsing)
 * - No profile stored
 * - Stored data fails schema validation (corrupted)
 */
export function getProfile(): Profile | null {
  if (!isLocalStorageAvailable()) {
    return null;
  }

  try {
    const data = localStorage.getItem(PROFILE_KEY);
    if (!data) return null;

    // Parse and validate with Zod schema - ensures type safety
    const parsed = JSON.parse(data);
    return ProfileSchema.parse(parsed);
  } catch {
    // Validation failed or corrupted data
    // Don't throw - gracefully return null and let app handle
    return null;
  }
}

/**
 * Save profile to localStorage
 * Validates before saving to ensure only valid data is persisted
 * Returns false if save fails (storage unavailable, quota exceeded)
 */
export function saveProfile(profile: Profile): boolean {
  if (!isLocalStorageAvailable()) {
    return false;
  }

  try {
    // Validate profile with Zod schema before persisting
    // Prevents invalid data from being stored
    const validated = ProfileSchema.parse(profile);
    localStorage.setItem(PROFILE_KEY, JSON.stringify(validated));
    return true;
  } catch {
    // Save failed - don't throw, let caller handle failure
    return false;
  }
}

/**
 * Update profile in localStorage
 * Merges incoming data with existing profile
 * Returns false if update fails (storage unavailable, validation error)
 */
export function updateProfile(profile: Partial<Profile>): boolean {
  const current = getProfile();
  if (!current) {
    return false; // Can't update if no profile exists
  }

  // Merge current profile with incoming updates
  const merged = { ...current, ...profile };
  return saveProfile(merged);
}

/**
 * Clear profile from localStorage
 * Used for logout or clearing saved state
 * @deprecated Use clearProfile instead
 */
export function deleteProfile(): boolean {
  return clearProfile();
}

/**
 * Clear profile from localStorage
 * Used for logout or clearing saved state
 */
export function clearProfile(): boolean {
  if (!isLocalStorageAvailable()) {
    return false;
  }

  try {
    localStorage.removeItem(PROFILE_KEY);
    return true;
  } catch {
    return false;
  }
}
