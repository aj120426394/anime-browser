import { Profile, ProfileSchema } from "./schema";

const PROFILE_KEY = "user-profile";

/**
 * Check if localStorage is available (SSR safe + availability detection)
 */
export function isLocalStorageAvailable(): boolean {
  if (typeof window === "undefined") {
    return false; // SSR check
  }

  try {
    const test = "__storage_test__";
    window.localStorage.setItem(test, test);
    window.localStorage.removeItem(test);
    return true;
  } catch {
    return false; // Storage disabled or quota exceeded
  }
}

/**
 * Get profile from localStorage with validation
 */
export function getProfile(): Profile | null {
  if (!isLocalStorageAvailable()) {
    return null;
  }

  try {
    const data = localStorage.getItem(PROFILE_KEY);
    if (!data) return null;

    const parsed = JSON.parse(data);
    return ProfileSchema.parse(parsed);
  } catch {
    // Validation failed or corrupted data
    return null;
  }
}

/**
 * Save profile to localStorage
 */
export function saveProfile(profile: Profile): boolean {
  if (!isLocalStorageAvailable()) {
    return false;
  }

  try {
    const validated = ProfileSchema.parse(profile);
    localStorage.setItem(PROFILE_KEY, JSON.stringify(validated));
    return true;
  } catch {
    return false;
  }
}

/**
 * Update profile in localStorage
 */
export function updateProfile(profile: Partial<Profile>): boolean {
  const current = getProfile();
  if (!current) {
    return false;
  }

  const updated = { ...current, ...profile };
  return saveProfile(updated);
}

/**
 * Delete profile from localStorage
 */
export function deleteProfile(): boolean {
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
