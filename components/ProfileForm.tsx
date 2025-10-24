"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProfileSchema } from "@/lib/schema";
import type { Profile } from "@/lib/schema";

interface ProfileFormProps {
  onSubmit: (profile: Profile) => void;
  isLoading?: boolean;
}

interface FormErrors {
  username?: string;
  jobTitle?: string;
}

/**
 * ProfileForm Component
 * Renders a form for users to enter their profile information (username and job title).
 * Validates input and calls onSubmit with valid profile data.
 *
 * @param onSubmit - Callback function when form is submitted with valid data
 * @param isLoading - Optional boolean to show loading state during submission
 */
export function ProfileForm({ onSubmit, isLoading = false }: ProfileFormProps) {
  const [username, setUsername] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<{ username?: boolean; jobTitle?: boolean }>({});

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTouched({ username: true, jobTitle: true });

    // Validate using Zod schema
    const result = ProfileSchema.safeParse({
      username: username.trim(),
      jobTitle: jobTitle.trim(),
    });

    if (!result.success) {
      // Extract field-level errors
      const newErrors: FormErrors = {};
      result.error.errors.forEach((error) => {
        if (error.path[0]) {
          newErrors[error.path[0] as keyof FormErrors] = error.message;
        }
      });
      setErrors(newErrors);
      return;
    }

    // Clear errors and call onSubmit
    setErrors({});
    onSubmit(result.data);
  };

  const handleBlur = (field: "username" | "jobTitle") => {
    setTouched((prev) => ({ ...prev, [field]: true }));

    // Validate individual field
    const fieldValue = field === "username" ? username : jobTitle;
    if (!fieldValue.trim()) {
      setErrors((prev) => ({
        ...prev,
        [field]: field === "username" ? "Username is required" : "Job title is required",
      }));
    } else {
      // Try parsing just this field to check for length errors
      const testData = {
        username: field === "username" ? fieldValue.trim() : "test",
        jobTitle: field === "jobTitle" ? fieldValue.trim() : "test",
      };
      const result = ProfileSchema.safeParse(testData);
      if (!result.success) {
        const fieldErrors = result.error.errors.filter((e) => e.path[0] === field);
        if (fieldErrors.length > 0) {
          setErrors((prev) => ({
            ...prev,
            [field]: fieldErrors[0].message,
          }));
        } else {
          setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors[field];
            return newErrors;
          });
        }
      } else {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
      }
    }
  };

  return (
    <div className="w-full max-w-md mx-auto px-4">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-6">Create Your Profile</h1>
        </div>

        {/* Username Field */}
        <div className="space-y-2">
          <label htmlFor="username" className="block text-sm font-medium">
            Username
          </label>
          <Input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onBlur={() => handleBlur("username")}
            placeholder="Enter your username"
            disabled={isLoading}
            className={errors.username && touched.username ? "border-red-500" : ""}
            maxLength={50}
          />
          {errors.username && touched.username && (
            <p className="text-sm text-red-600" role="alert">
              {errors.username}
            </p>
          )}
          <p className="text-xs text-muted-foreground">{username.length}/50 characters</p>
        </div>

        {/* Job Title Field */}
        <div className="space-y-2">
          <label htmlFor="jobTitle" className="block text-sm font-medium">
            Job Title
          </label>
          <Input
            id="jobTitle"
            type="text"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            onBlur={() => handleBlur("jobTitle")}
            placeholder="Enter your job title"
            disabled={isLoading}
            className={errors.jobTitle && touched.jobTitle ? "border-red-500" : ""}
            maxLength={100}
          />
          {errors.jobTitle && touched.jobTitle && (
            <p className="text-sm text-red-600" role="alert">
              {errors.jobTitle}
            </p>
          )}
          <p className="text-xs text-muted-foreground">{jobTitle.length}/100 characters</p>
        </div>

        {/* Submit Button */}
        <Button type="submit" disabled={isLoading} className="w-full" size="lg">
          {isLoading ? "Saving..." : "Save Profile"}
        </Button>
      </form>
    </div>
  );
}
