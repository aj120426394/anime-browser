import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MediaGrid } from "@/components/MediaGrid";
import type { MediaItem } from "@/lib/schema";

describe("MediaGrid Component", () => {
  const mockItems: MediaItem[] = Array.from({ length: 12 }, (_, i) => ({
    id: `${i + 1}`,
    engTitle: `Anime ${i + 1}`,
    nativeTitle: `アニメ${i + 1}`,
    status: "FINISHED",
    type: "ANIME",
    startDate: { year: 2020, month: 1, day: 1 },
    endDate: { year: 2020, month: 12, day: 31 },
    description: `Description ${i + 1}`,
    imageMedium: `https://example.com/image${i + 1}-medium.jpg`,
    imageLarge: `https://example.com/image${i + 1}-large.jpg`,
  }));

  describe("Grid Display", () => {
    it("should render all media items", () => {
      render(<MediaGrid items={mockItems} />);
      mockItems.forEach((item) => {
        expect(screen.getByText(item.engTitle)).toBeInTheDocument();
      });
    });

    it("should render grid container", () => {
      const { container } = render(<MediaGrid items={mockItems} />);
      const grid = container.querySelector(".grid");
      expect(grid).toBeInTheDocument();
      expect(grid).toHaveClass("grid-cols-1", "sm:grid-cols-2", "lg:grid-cols-3", "xl:grid-cols-4");
    });

    it("should have proper gap between items", () => {
      const { container } = render(<MediaGrid items={mockItems} />);
      const grid = container.querySelector(".grid");
      expect(grid).toHaveClass("gap-4");
    });
  });

  describe("Loading State", () => {
    it("should show skeleton loading state", () => {
      const { container } = render(<MediaGrid items={[]} isLoading={true} />);
      const skeletons = container.querySelectorAll(".animate-pulse");
      expect(skeletons.length).toBeGreaterThan(0);
    });

    it("should render 12 skeleton placeholders when loading", () => {
      const { container } = render(<MediaGrid items={[]} isLoading={true} />);
      const skeletons = container.querySelectorAll(".animate-pulse");
      expect(skeletons.length).toBe(12);
    });

    it("should not show skeleton when not loading", () => {
      const { container } = render(<MediaGrid items={mockItems} isLoading={false} />);
      const skeletons = container.querySelectorAll(".animate-pulse");
      expect(skeletons.length).toBe(0);
    });
  });

  describe("Empty State", () => {
    it("should show empty state message when no items", () => {
      render(<MediaGrid items={[]} isLoading={false} />);
      expect(screen.getByText("No anime found")).toBeInTheDocument();
    });

    it("should show help text in empty state", () => {
      render(<MediaGrid items={[]} isLoading={false} />);
      expect(screen.getByText("Try adjusting your search")).toBeInTheDocument();
    });

    it("should center empty state content", () => {
      const { container } = render(<MediaGrid items={[]} isLoading={false} />);
      const emptyState = container.querySelector(".flex.items-center.justify-center");
      expect(emptyState).toBeInTheDocument();
    });
  });

  describe("Item Interactions", () => {
    it("should call onItemClick when item is clicked", async () => {
      const handleItemClick = vi.fn();
      render(<MediaGrid items={mockItems} onItemClick={handleItemClick} />);

      const firstItem = screen.getByText("Anime 1");
      firstItem.closest("button")?.click();

      expect(handleItemClick).toHaveBeenCalledWith(
        expect.objectContaining({ engTitle: "Anime 1" })
      );
    });

    it("should pass correct item to onItemClick handler", async () => {
      const handleItemClick = vi.fn();
      render(<MediaGrid items={mockItems} onItemClick={handleItemClick} />);

      const item = mockItems[5];
      const itemElement = screen.getByText(item.engTitle);
      itemElement.closest("button")?.click();

      expect(handleItemClick).toHaveBeenCalledWith(item);
    });

    it("should handle multiple item clicks", async () => {
      const handleItemClick = vi.fn();
      render(<MediaGrid items={mockItems} onItemClick={handleItemClick} />);

      screen.getByText("Anime 1").closest("button")?.click();
      screen.getByText("Anime 2").closest("button")?.click();

      expect(handleItemClick).toHaveBeenCalledTimes(2);
    });
  });

  describe("Responsive Behavior", () => {
    it("should have responsive grid classes", () => {
      const { container } = render(<MediaGrid items={mockItems} />);
      const grid = container.querySelector(".grid");
      expect(grid).toHaveClass("sm:grid-cols-2", "lg:grid-cols-3", "xl:grid-cols-4");
    });

    it("should render MediaCard for each item with correct props", () => {
      render(<MediaGrid items={mockItems.slice(0, 3)} />);
      mockItems.slice(0, 3).forEach((item) => {
        expect(screen.getByText(item.engTitle)).toBeInTheDocument();
      });
    });
  });

  describe("Edge Cases", () => {
    it("should handle single item", () => {
      render(<MediaGrid items={mockItems.slice(0, 1)} />);
      expect(screen.getByText("Anime 1")).toBeInTheDocument();
    });

    it("should handle large number of items", () => {
      const manyItems = Array.from({ length: 100 }, (_, i) => ({
        ...mockItems[0],
        id: `${i + 1}`,
        engTitle: `Anime ${i + 1}`,
      }));
      render(<MediaGrid items={manyItems} />);
      expect(screen.getByText("Anime 1")).toBeInTheDocument();
      expect(screen.getByText("Anime 100")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have accessible aria labels", () => {
      render(<MediaGrid items={mockItems.slice(0, 3)} />);
      mockItems.slice(0, 3).forEach((item) => {
        const button = screen.getByText(item.engTitle).closest("button");
        expect(button).toHaveAttribute("aria-label");
      });
    });

    it("should have proper loading state ARIA labels", () => {
      const { container } = render(<MediaGrid items={[]} isLoading={true} />);
      const skeletons = container.querySelectorAll("[aria-busy]");
      expect(skeletons.length).toBeGreaterThan(0);
    });
  });
});
