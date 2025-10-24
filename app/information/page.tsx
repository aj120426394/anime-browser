"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useProfile } from "@/lib/hooks/useProfile";
import { usePagination } from "@/lib/hooks/usePagination";
import { useMediaPage } from "@/lib/hooks/useMediaPage";
import { MediaGrid } from "@/components/MediaGrid";
import { Pagination } from "@/components/Pagination";
import { MediaModal } from "@/components/MediaModal";
import { ProfileEditor } from "@/components/ProfileEditor";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { MediaItem } from "@/lib/schema";

/**
 * Information Page (/information)
 * Displays paginated anime data from AniList.
 * Requires user profile (gate redirects to / if no profile).
 * Supports deep linking via ?page=N query parameter.
 * Allows clicking items to view details in a modal.
 */
export default function InformationPage() {
  const router = useRouter();
  const { profile, isStorageAvailable, saveProfile } = useProfile();
  const { currentPage, goToPage } = usePagination();
  const { mediaItems, pageInfo, loading, error } = useMediaPage(currentPage, 20);
  const [storageChecked, setStorageChecked] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  // Check if profile exists, redirect to gate if not
  useEffect(() => {
    setStorageChecked(true);
    if (isStorageAvailable && !profile) {
      router.push("/");
    }
  }, [profile, isStorageAvailable, router]);

  // Handle item click to open modal
  const handleItemClick = (item: MediaItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  // Handle modal close
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  // Handle profile save
  const handleProfileSave = (updatedProfile: any) => {
    saveProfile(updatedProfile);
    setIsEditProfileOpen(false);
  };

  // Handle keyboard navigation (Escape to close modal)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (isModalOpen) {
          handleCloseModal();
        } else if (isEditProfileOpen) {
          setIsEditProfileOpen(false);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen, isEditProfileOpen]);

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
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">Anime Browser</h1>
              {profile && (
                <Button variant="outline" size="sm" onClick={() => setIsEditProfileOpen(true)}>
                  Edit Profile
                </Button>
              )}
            </div>
            {profile && (
              <p className="text-sm text-muted-foreground">
                Welcome, <span className="font-semibold">{profile.username}</span> (
                {profile.jobTitle})
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
            <p className="text-sm mt-1">
              {error.message.includes("429")
                ? "Too many requests. The AniList API rate limit has been reached. Please wait a moment before trying again."
                : error.message.includes("Failed to fetch")
                  ? "Network connection failed. Please check your internet connection and try again."
                  : error.message}
            </p>
            <p className="text-xs mt-2 text-destructive/80">
              If this persists, try refreshing the page or contact support.
            </p>
          </div>
        )}

        {/* Media Grid */}
        <div>
          {loading && mediaItems.length === 0 ? (
            <MediaGrid items={[]} isLoading={true} />
          ) : (
            <MediaGrid items={mediaItems} onItemClick={handleItemClick} />
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
          <div className="text-center py-4 text-muted-foreground" role="status" aria-live="polite">
            <p>Loading page {currentPage}...</p>
          </div>
        )}
      </div>

      {/* Media Modal */}
      <MediaModal isOpen={isModalOpen} item={selectedItem} onClose={handleCloseModal} />

      {/* Profile Edit Dialog */}
      {profile && (
        <Dialog open={isEditProfileOpen} onOpenChange={setIsEditProfileOpen}>
          <DialogContent className="max-w-md">
            <DialogTitle className="text-lg font-semibold">Edit Profile</DialogTitle>
            <div className="space-y-4">
              <ProfileEditor profile={profile} onSave={handleProfileSave} />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
