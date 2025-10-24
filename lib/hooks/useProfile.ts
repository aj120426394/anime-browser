import { useEffect, useState } from "react";
import { Profile } from "@/lib/schema";
import {
  getProfile,
  saveProfile,
  updateProfile,
  deleteProfile,
  isLocalStorageAvailable,
} from "@/lib/storage";

interface UseProfileReturn {
  profile: Profile | null;
  loading: boolean;
  isStorageAvailable: boolean;
  saveProfile: (profile: Profile) => boolean;
  updateProfile: (profile: Partial<Profile>) => boolean;
  deleteProfile: () => boolean;
  hasProfile: boolean;
}

/**
 * Hook to manage user profile stored in localStorage
 * Handles loading, saving, updating, and deleting profile
 */
export function useProfile(): UseProfileReturn {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isStorageAvailable, setIsStorageAvailable] = useState(false);

  // Load profile on mount
  useEffect(() => {
    setIsStorageAvailable(isLocalStorageAvailable());
    const loadedProfile = getProfile();
    setProfile(loadedProfile);
    setLoading(false);
  }, []);

  // Save profile to localStorage
  const handleSaveProfile = (newProfile: Profile): boolean => {
    const success = saveProfile(newProfile);
    if (success) {
      setProfile(newProfile);
    }
    return success;
  };

  // Update profile in localStorage
  const handleUpdateProfile = (updates: Partial<Profile>): boolean => {
    const success = updateProfile(updates);
    if (success) {
      const updated = getProfile();
      setProfile(updated);
    }
    return success;
  };

  // Delete profile from localStorage
  const handleDeleteProfile = (): boolean => {
    const success = deleteProfile();
    if (success) {
      setProfile(null);
    }
    return success;
  };

  return {
    profile,
    loading,
    isStorageAvailable,
    saveProfile: handleSaveProfile,
    updateProfile: handleUpdateProfile,
    deleteProfile: handleDeleteProfile,
    hasProfile: profile !== null,
  };
}
