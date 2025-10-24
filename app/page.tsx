"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ProfileForm } from "@/components/ProfileForm";
import { useProfile } from "@/lib/hooks/useProfile";
import type { Profile } from "@/lib/schema";

/**
 * Profile Gate Page (/)
 * Displays a profile form to new users and redirects them to /information once they've saved a profile.
 * If a profile already exists in localStorage, redirects immediately to /information.
 */
export default function ProfileGatePage() {
  const router = useRouter();
  const { profile, saveProfile, isStorageAvailable } = useProfile();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [storageChecked, setStorageChecked] = useState(false);

  // Check if profile exists and redirect
  useEffect(() => {
    setStorageChecked(true);
    if (isStorageAvailable && profile) {
      // Profile exists, redirect to information page
      router.push("/information");
    }
  }, [profile, isStorageAvailable, router]);

  const handleProfileSubmit = async (profileData: Profile) => {
    setIsSubmitting(true);
    try {
      // Save profile to localStorage
      const saved = saveProfile(profileData);

      if (saved) {
        // Redirect to information page
        router.push("/information");
      } else {
        // Handle save failure
        console.error("Failed to save profile");
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Error submitting profile:", error);
      setIsSubmitting(false);
    }
  };

  // Show loading state while checking storage
  if (!storageChecked) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center flex-1 px-4 py-8 sm:py-12">
      <ProfileForm onSubmit={handleProfileSubmit} isLoading={isSubmitting} />
    </div>
  );
}
