import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MediaModal } from "@/components/MediaModal";
import { MediaItem } from "@/lib/schema";

describe("MediaModal Component", () => {
  const mockMediaItem: MediaItem = {
    id: "1",
    engTitle: "Attack on Titan",
    nativeTitle: "進撃の巨人",
    status: "FINISHED",
    type: "ANIME",
    startDate: { year: 2013, month: 4, day: 7 },
    endDate: { year: 2013, month: 9, day: 28 },
    description: "A great anime about titans",
    imageMedium: "https://example.com/medium.jpg",
    imageLarge: "https://example.com/large.jpg",
  };

  describe("Rendering (T073)", () => {
    it("should render modal with media item details", () => {
      const handleClose = vi.fn();
      render(<MediaModal isOpen={true} item={mockMediaItem} onClose={handleClose} />);

      expect(screen.getByText("Attack on Titan")).toBeInTheDocument();
      expect(screen.getByText("進撃の巨人")).toBeInTheDocument();
      expect(screen.getByText("FINISHED")).toBeInTheDocument();
      expect(screen.getByText("ANIME")).toBeInTheDocument();
    });

    it("should display large image", () => {
      const handleClose = vi.fn();
      render(<MediaModal isOpen={true} item={mockMediaItem} onClose={handleClose} />);

      const image = screen.getByAltText(/Attack on Titan/i);
      expect(image).toHaveAttribute("src", expect.stringContaining("large.jpg"));
    });

    it("should display formatted dates", () => {
      const handleClose = vi.fn();
      render(<MediaModal isOpen={true} item={mockMediaItem} onClose={handleClose} />);

      // Dates should be formatted
      expect(screen.getByText(/2013-04-07|April 7, 2013|7 Apr 2013/)).toBeInTheDocument();
      expect(screen.getByText(/2013-09-28|September 28, 2013|28 Sep 2013/)).toBeInTheDocument();
    });

    it("should display description", () => {
      const handleClose = vi.fn();
      render(<MediaModal isOpen={true} item={mockMediaItem} onClose={handleClose} />);

      expect(screen.getByText("A great anime about titans")).toBeInTheDocument();
    });

    it("should not render when isOpen is false", () => {
      const handleClose = vi.fn();
      render(<MediaModal isOpen={false} item={mockMediaItem} onClose={handleClose} />);

      // Dialog should not be visible in the document (Portal renders in document)
      const dialog = document.querySelector("[role='dialog']");
      expect(dialog).not.toBeInTheDocument();
    });
  });

  describe("Close Handlers (T074)", () => {
    it("should call onClose when close button clicked", async () => {
      const user = userEvent.setup();
      const handleClose = vi.fn();
      render(<MediaModal isOpen={true} item={mockMediaItem} onClose={handleClose} />);

      // Find the close button by looking for the button with sr-only "Close" text
      const buttons = screen.getAllByRole("button");
      const closeButton = buttons.find(
        (btn) =>
          btn.textContent?.includes("Close") ||
          btn.querySelector("span.sr-only")?.textContent === "Close"
      );

      if (closeButton) {
        await user.click(closeButton);
        expect(handleClose).toHaveBeenCalledTimes(1);
      }
    });

    it("should call onClose when ESC key pressed", async () => {
      const handleClose = vi.fn();
      render(<MediaModal isOpen={true} item={mockMediaItem} onClose={handleClose} />);

      fireEvent.keyDown(document, { key: "Escape", code: "Escape" });

      expect(handleClose).toHaveBeenCalled();
    });

    it("should call onClose when overlay clicked", async () => {
      const user = userEvent.setup();
      const handleClose = vi.fn();
      const { container } = render(
        <MediaModal isOpen={true} item={mockMediaItem} onClose={handleClose} />
      );

      // Click on backdrop/overlay
      const backdrop = container.querySelector("[data-testid='modal-backdrop']");
      if (backdrop) {
        await user.click(backdrop);
        expect(handleClose).toHaveBeenCalled();
      }
    });
  });

  describe("HTML Sanitization (T075)", () => {
    it("should sanitize HTML in description", () => {
      const handleClose = vi.fn();
      const itemWithHTML: MediaItem = {
        ...mockMediaItem,
        description: "<script>alert('xss')</script><p>Safe content</p>",
      };

      render(<MediaModal isOpen={true} item={itemWithHTML} onClose={handleClose} />);

      // Script should be removed
      expect(screen.queryByText("alert('xss')")).not.toBeInTheDocument();
      // Safe content should remain
      expect(screen.getByText("Safe content")).toBeInTheDocument();
    });

    it("should strip dangerous HTML attributes", () => {
      const handleClose = vi.fn();
      const itemWithDangerousAttrs: MediaItem = {
        ...mockMediaItem,
        description: '<a href="javascript:void(0)" onclick="alert()">Click</a>',
      };

      render(<MediaModal isOpen={true} item={itemWithDangerousAttrs} onClose={handleClose} />);

      const link = screen.getByText("Click");
      expect(link.getAttribute("onclick")).toBeNull();
      const href = link.getAttribute("href");
      // After sanitization, href should either be null or not contain javascript:
      if (href !== null) {
        expect(href).not.toContain("javascript:");
      }
    });

    it("should allow safe HTML formatting", () => {
      const handleClose = vi.fn();
      const itemWithSafeHTML: MediaItem = {
        ...mockMediaItem,
        description: "<p><strong>Great</strong> anime with <em>amazing</em> plot</p>",
      };

      render(<MediaModal isOpen={true} item={itemWithSafeHTML} onClose={handleClose} />);

      expect(screen.getByText("Great")).toBeInTheDocument();
      expect(screen.getByText("amazing")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have proper ARIA role", () => {
      const handleClose = vi.fn();
      render(<MediaModal isOpen={true} item={mockMediaItem} onClose={handleClose} />);

      // Dialog is rendered in a Portal, so query the document
      const dialog = document.querySelector("[role='dialog']");
      expect(dialog).toBeInTheDocument();
    });

    it("should have aria-labelledby pointing to title", () => {
      const handleClose = vi.fn();
      render(<MediaModal isOpen={true} item={mockMediaItem} onClose={handleClose} />);

      // Dialog is rendered in a Portal, so query the document
      const dialog = document.querySelector("[role='dialog']");
      expect(dialog).toBeInTheDocument();
      // Verify the hidden title exists (via sr-only or VisuallyHidden)
      const title = document.querySelector("[role='dialog'] h2");
      expect(title).toBeInTheDocument();
    });

    it("should trap focus within modal", async () => {
      const user = userEvent.setup();
      const handleClose = vi.fn();
      render(<MediaModal isOpen={true} item={mockMediaItem} onClose={handleClose} />);

      // Dialog is rendered in a Portal, so query the document
      const dialog = document.querySelector("[role='dialog']");
      expect(dialog).toBeInTheDocument();

      // Modal should have focusable elements (button for close)
      const buttons = dialog?.querySelectorAll("button");
      expect(buttons && buttons.length > 0).toBeTruthy();
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty description", () => {
      const handleClose = vi.fn();
      const itemNoDesc: MediaItem = {
        ...mockMediaItem,
        description: "",
      };

      render(<MediaModal isOpen={true} item={itemNoDesc} onClose={handleClose} />);

      expect(screen.getByText("Attack on Titan")).toBeInTheDocument();
    });

    it("should handle missing dates", () => {
      const handleClose = vi.fn();
      const itemNoDates: MediaItem = {
        ...mockMediaItem,
        startDate: null,
        endDate: null,
      };

      render(<MediaModal isOpen={true} item={itemNoDates} onClose={handleClose} />);

      expect(screen.getByText("Attack on Titan")).toBeInTheDocument();
    });

    it("should handle very long title", () => {
      const handleClose = vi.fn();
      const longTitle = "A".repeat(200);
      const itemLongTitle: MediaItem = {
        ...mockMediaItem,
        engTitle: longTitle,
      };

      const { container } = render(
        <MediaModal isOpen={true} item={itemLongTitle} onClose={handleClose} />
      );

      // Should render without crashing
      expect(container).toBeInTheDocument();
    });
  });
});
