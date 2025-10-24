"use client";

import { useState, useEffect } from "react";
import { Profile, ProfileSchema } from "@/lib/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ProfileEditorProps {
  profile: Profile;
  onSave: (profile: Profile) => Promise<void> | void;
}

/**
 * ProfileEditor Component - Allows users to edit their profile information
 * Provides form with pre-filled current values, validation, and save functionality
 */
export function ProfileEditor({ profile, onSave }: ProfileEditorProps) {
  const [username, setUsername] = useState(profile.username);
  const [jobTitle, setJobTitle] = useState(profile.jobTitle);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Sync form state when profile prop changes
  useEffect(() => {
    setUsername(profile.username);
    setJobTitle(profile.jobTitle);
    setErrors({});
    setSuccessMessage("");
  }, [profile]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!username.trim()) {
      newErrors.username = "Username is required";
    } else if (username.length > 50) {
      newErrors.username = "Username must be 50 characters or less";
    }

    if (!jobTitle.trim()) {
      newErrors.jobTitle = "Job title is required";
    } else if (jobTitle.length > 100) {
      newErrors.jobTitle = "Job title must be 100 characters or less";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage("");

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const updatedProfile: Profile = {
        username: username.trim(),
        jobTitle: jobTitle.trim(),
      };

      // Validate with Zod schema
      const result = ProfileSchema.safeParse(updatedProfile);
      if (!result.success) {
        const fieldErrors: Record<string, string> = {};
        result.error.errors.forEach((error) => {
          const path = error.path[0];
          if (path) {
            fieldErrors[path] = error.message;
          }
        });
        setErrors(fieldErrors);
        return;
      }

      // Call onSave callback
      await onSave(updatedProfile);

      setSuccessMessage("Profile updated successfully!");

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      setErrors({
        submit: error instanceof Error ? error.message : "Failed to save profile",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Update your profile information</p>
      </div>

      {/* Username Field */}
      <div className="space-y-2">
        <label htmlFor="username" className="text-sm font-semibold">
          Username
        </label>
        <Input
          id="username"
          name="username"
          type="text"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            if (errors.username) {
              setErrors({ ...errors, username: "" });
            }
          }}
          placeholder="Enter your username"
          maxLength={50}
          disabled={isSubmitting}
          className={errors.username ? "border-destructive" : ""}
          aria-invalid={!!errors.username}
          aria-describedby={errors.username ? "username-error" : undefined}
        />
        {errors.username && (
          <div id="username-error" className="flex items-center gap-2 text-sm text-destructive">
            <span className="text-lg">⚠️</span>
            {errors.username}
          </div>
        )}
      </div>

      {/* Job Title Field */}
      <div className="space-y-2">
        <label htmlFor="jobTitle" className="text-sm font-semibold">
          Job Title
        </label>
        <Input
          id="jobTitle"
          name="jobTitle"
          type="text"
          value={jobTitle}
          onChange={(e) => {
            setJobTitle(e.target.value);
            if (errors.jobTitle) {
              setErrors({ ...errors, jobTitle: "" });
            }
          }}
          placeholder="Enter your job title"
          maxLength={100}
          disabled={isSubmitting}
          className={errors.jobTitle ? "border-destructive" : ""}
          aria-invalid={!!errors.jobTitle}
          aria-describedby={errors.jobTitle ? "jobTitle-error" : undefined}
        />
        {errors.jobTitle && (
          <div id="jobTitle-error" className="flex items-center gap-2 text-sm text-destructive">
            <span className="text-lg">⚠️</span>
            {errors.jobTitle}
          </div>
        )}
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="flex items-center gap-2 rounded-md bg-green-50 p-3 text-sm text-green-700 dark:bg-green-900/20 dark:text-green-400">
          <span className="text-lg">✓</span>
          {successMessage}
        </div>
      )}

      {/* Submit Error */}
      {errors.submit && (
        <div className="flex items-center gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          <span className="text-lg">⚠️</span>
          {errors.submit}
        </div>
      )}

      {/* Submit Button */}
      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
}
