"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useProfile } from "@/lib/hooks/useProfile";
import { usePagination } from "@/lib/hooks/usePagination";
import { useMediaPage } from "@/lib/hooks/useMediaPage";
import { MediaGrid } from "@/components/MediaGrid";
import { Pagination } from "@/components/Pagination";

/**
 * Information Page (/information)
 * Displays paginated anime data from AniList.
 * Requires user profile (gate redirects to / if no profile).
 * Supports deep linking via ?page=N query parameter.
 */
export default function InformationPage() {
  const router = useRouter();
  const { profile, isStorageAvailable } = useProfile();
  const { currentPage, goToPage } = usePagination();
  const { mediaItems, pageInfo, loading, error } = useMediaPage(currentPage, 20);
  const [storageChecked, setStorageChecked] = useState(false);

  // Check if profile exists, redirect to gate if not
  useEffect(() => {
    setStorageChecked(true);
    if (isStorageAvailable && !profile) {
      router.push("/");
    }
  }, [profile, isStorageAvailable, router]);

  // Show loading while checking storage
  if (!storageChecked) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border sticky top-0 z-10 bg-background/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Anime Browser</h1>
            {profile && (
              <p className="text-sm text-muted-foreground">
                Welcome, <span className="font-semibold">{profile.username}</span> ({profile.jobTitle})
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Error State */}
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 text-destructive">
            <p className="font-semibold">Error loading anime</p>
            <p className="text-sm mt-1">{error.message}</p>
            <p className="text-xs mt-2 text-destructive/80">
              Check your internet connection and try refreshing the page.
            </p>
          </div>
        )}

        {/* Media Grid */}
        <div>
          {loading && mediaItems.length === 0 ? (
            <MediaGrid items={[]} isLoading={true} />
          ) : (
            <MediaGrid
              items={mediaItems}
              onItemClick={(item) => {
                // TODO: Open modal with item details
                console.log("Clicked item:", item);
              }}
            />
          )}
        </div>

        {/* Pagination */}
        {pageInfo && !loading && mediaItems.length > 0 && (
          <Pagination
            currentPage={pageInfo.currentPage}
            hasNextPage={pageInfo.hasNextPage}
            onPageChange={goToPage}
            isLoading={loading}
          />
        )}

        {/* Loading indicator for page changes */}
        {loading && mediaItems.length > 0 && (
          <div className="text-center py-4 text-muted-foreground">
            <p>Loading page {currentPage}...</p>
          </div>
        )}
      </div>
    </div>
  );
}
