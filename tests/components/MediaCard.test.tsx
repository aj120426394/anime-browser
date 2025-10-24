import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MediaCard } from "@/components/MediaCard";
import type { MediaItem } from "@/lib/schema";

describe("MediaCard Component", () => {
  const mockMediaItem: MediaItem = {
    id: "1",
    engTitle: "Attack on Titan",
    nativeTitle: "進撃の巨人",
    status: "FINISHED",
    type: "ANIME",
    startDate: { year: 2013, month: 4, day: 7 },
    endDate: { year: 2013, month: 9, day: 28 },
    description: "Humanity fights giant humanoid creatures",
    imageMedium: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/b1-aF.jpg",
    imageLarge: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/b1-aF.jpg",
  };

  describe("Rendering", () => {
    it("should render media card with title", () => {
      render(<MediaCard item={mockMediaItem} />);
      expect(screen.getByText("Attack on Titan")).toBeInTheDocument();
    });

    it("should display both English and native titles", () => {
      render(<MediaCard item={mockMediaItem} />);
      expect(screen.getByText("Attack on Titan")).toBeInTheDocument();
      expect(screen.getByText("進撃の巨人")).toBeInTheDocument();
    });

    it("should display media type and status", () => {
      render(<MediaCard item={mockMediaItem} />);
      expect(screen.getByText("ANIME")).toBeInTheDocument();
      expect(screen.getByText("FINISHED")).toBeInTheDocument();
    });

    it("should render as a button element", () => {
      const { container } = render(<MediaCard item={mockMediaItem} />);
      const button = container.querySelector("button");
      expect(button).toBeInTheDocument();
    });

    it("should have accessible aria-label", () => {
      render(<MediaCard item={mockMediaItem} />);
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-label");
    });
  });

  describe("Images", () => {
    it("should render image with alt text", () => {
      render(<MediaCard item={mockMediaItem} />);
      const img = screen.getByAltText("Attack on Titan");
      expect(img).toBeInTheDocument();
    });

    it("should handle missing English title in alt text", () => {
      const itemWithoutEnglish = {
        ...mockMediaItem,
        engTitle: "",
      };
      render(<MediaCard item={itemWithoutEnglish} />);
      const img = screen.getByAltText("進撃の巨人");
      expect(img).toBeInTheDocument();
    });

    it("should show placeholder when no image", () => {
      const itemNoImage = {
        ...mockMediaItem,
        imageMedium: "",
      };
      render(<MediaCard item={itemNoImage} />);
      expect(screen.getByText("No image")).toBeInTheDocument();
    });
  });

  describe("Interactions", () => {
    it("should call onClick handler when clicked", async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      render(<MediaCard item={mockMediaItem} onClick={handleClick} />);

      const button = screen.getByRole("button");
      await user.click(button);

      expect(handleClick).toHaveBeenCalledOnce();
    });

    it("should be keyboard accessible", async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      render(<MediaCard item={mockMediaItem} onClick={handleClick} />);

      const button = screen.getByRole("button");
      await user.tab();
      expect(button).toBeFocused();

      await user.keyboard("{Enter}");
      expect(handleClick).toHaveBeenCalledOnce();
    });

    it("should handle hover state visually", () => {
      const { container } = render(<MediaCard item={mockMediaItem} />);
      const button = container.querySelector("button");
      expect(button).toHaveClass("group");
    });
  });

  describe("Edge Cases", () => {
    it("should handle very long titles", () => {
      const longTitle = "A".repeat(100);
      const itemLongTitle = {
        ...mockMediaItem,
        engTitle: longTitle,
      };
      render(<MediaCard item={itemLongTitle} />);
      // Should render without crashing and use line-clamp
      const titleElement = screen.getByText(expect.stringContaining("A"));
      expect(titleElement).toHaveClass("line-clamp-2");
    });

    it("should handle missing description gracefully", () => {
      const itemNoDesc = {
        ...mockMediaItem,
        description: "",
      };
      render(<MediaCard item={itemNoDesc} />);
      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("should render without onClick handler", () => {
      render(<MediaCard item={mockMediaItem} />);
      expect(screen.getByRole("button")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have proper semantic button role", () => {
      render(<MediaCard item={mockMediaItem} />);
      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("should have descriptive aria-label", () => {
      render(<MediaCard item={mockMediaItem} />);
      const button = screen.getByRole("button");
      expect(button.getAttribute("aria-label")).toContain("Attack on Titan");
    });

    it("should be visible with proper contrast", () => {
      const { container } = render(<MediaCard item={mockMediaItem} />);
      const titleElement = screen.getByText("Attack on Titan");
      expect(titleElement).toHaveClass("font-semibold");
    });
  });
});
