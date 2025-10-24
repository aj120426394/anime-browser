import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Pagination } from "@/components/Pagination";

describe("Pagination Component", () => {
  const defaultProps = {
    currentPage: 1,
    hasNextPage: true,
    onPageChange: vi.fn(),
  };

  describe("Navigation Buttons", () => {
    it("should render Previous and Next buttons", () => {
      render(<Pagination {...defaultProps} />);
      expect(screen.getByText("Previous")).toBeInTheDocument();
      expect(screen.getByText("Next")).toBeInTheDocument();
    });

    it("should disable Previous button on first page", () => {
      render(<Pagination {...defaultProps} currentPage={1} />);
      const prevButton = screen.getByText("Previous");
      expect(prevButton).toBeDisabled();
    });

    it("should enable Previous button on pages > 1", () => {
      render(<Pagination {...defaultProps} currentPage={5} />);
      const prevButton = screen.getByText("Previous");
      expect(prevButton).not.toBeDisabled();
    });

    it("should disable Next button when no next page", () => {
      render(<Pagination {...defaultProps} hasNextPage={false} />);
      const nextButton = screen.getByText("Next");
      expect(nextButton).toBeDisabled();
    });

    it("should enable Next button when next page exists", () => {
      render(<Pagination {...defaultProps} hasNextPage={true} />);
      const nextButton = screen.getByText("Next");
      expect(nextButton).not.toBeDisabled();
    });
  });

  describe("Page Number Display", () => {
    it("should show current page number", () => {
      render(<Pagination {...defaultProps} currentPage={3} />);
      expect(screen.getByText("3")).toBeInTheDocument();
    });

    it("should highlight current page", () => {
      render(<Pagination {...defaultProps} currentPage={2} />);
      const currentPageButton = screen.getByRole("button", { name: /Go to page 2/ });
      expect(currentPageButton).toHaveClass("bg-primary", "text-primary-foreground");
    });

    it("should show page 1 always", () => {
      render(<Pagination {...defaultProps} currentPage={10} />);
      expect(screen.getByText("1")).toBeInTheDocument();
    });

    it("should show ellipsis when pages are not consecutive", () => {
      render(<Pagination {...defaultProps} currentPage={10} />);
      const ellipsis = screen.queryAllByText("...");
      expect(ellipsis.length).toBeGreaterThan(0);
    });
  });

  describe("Page Range Logic", () => {
    it("should show consecutive pages around current page", () => {
      render(<Pagination {...defaultProps} currentPage={5} />);
      expect(screen.getByText("4")).toBeInTheDocument();
      expect(screen.getByText("5")).toBeInTheDocument();
      expect(screen.getByText("6")).toBeInTheDocument();
    });

    it("should show fewer pages on start", () => {
      render(<Pagination {...defaultProps} currentPage={1} />);
      const numbers = screen.getAllByRole("button").filter((btn) => {
        const text = btn.textContent || "";
        return /^\d+$/.test(text);
      });
      expect(numbers.length).toBeGreaterThan(0);
      expect(numbers.length).toBeLessThan(10);
    });

    it("should handle large page numbers", () => {
      render(<Pagination {...defaultProps} currentPage={100} />);
      // Check for the page summary text instead of a button
      expect(screen.getByText(/Page 100/)).toBeInTheDocument();
    });
  });

  describe("Click Handlers", () => {
    it("should call onPageChange when Previous clicked", async () => {
      const user = userEvent.setup();
      const handlePageChange = vi.fn();
      render(<Pagination {...defaultProps} currentPage={3} onPageChange={handlePageChange} />);

      const prevButton = screen.getByText("Previous");
      await user.click(prevButton);

      expect(handlePageChange).toHaveBeenCalledWith(2);
    });

    it("should call onPageChange when Next clicked", async () => {
      const user = userEvent.setup();
      const handlePageChange = vi.fn();
      render(<Pagination {...defaultProps} currentPage={1} onPageChange={handlePageChange} />);

      const nextButton = screen.getByText("Next");
      await user.click(nextButton);

      expect(handlePageChange).toHaveBeenCalledWith(2);
    });

    it("should call onPageChange with correct page when number clicked", async () => {
      const user = userEvent.setup();
      const handlePageChange = vi.fn();
      render(<Pagination {...defaultProps} currentPage={1} onPageChange={handlePageChange} />);

      const pageButton = screen.getByRole("button", { name: /Go to page 3/ });
      await user.click(pageButton);

      expect(handlePageChange).toHaveBeenCalledWith(3);
    });

    it("should not call onPageChange when disabled button clicked", async () => {
      const user = userEvent.setup();
      const handlePageChange = vi.fn();
      render(<Pagination {...defaultProps} currentPage={1} onPageChange={handlePageChange} />);

      const prevButton = screen.getByText("Previous");
      await user.click(prevButton);

      expect(handlePageChange).not.toHaveBeenCalled();
    });
  });

  describe("Loading State", () => {
    it("should disable all buttons when loading", () => {
      render(<Pagination {...defaultProps} currentPage={2} isLoading={true} />);

      expect(screen.getByText("Previous")).toBeDisabled();
      expect(screen.getByText("Next")).toBeDisabled();
    });

    it("should show normal state when not loading", () => {
      render(<Pagination {...defaultProps} currentPage={2} isLoading={false} />);

      const prevButton = screen.getByText("Previous");
      expect(prevButton).not.toBeDisabled();
    });
  });

  describe("Keyboard Navigation", () => {
    it("should be keyboard accessible", async () => {
      const user = userEvent.setup();
      const handlePageChange = vi.fn();
      render(<Pagination {...defaultProps} currentPage={1} onPageChange={handlePageChange} />);

      // Tab to first focusable button (in tab order)
      await user.tab();
      const page1Button = screen.getByRole("button", { name: /Go to page 1/ });
      expect(page1Button).toHaveFocus();
    });

    it("should activate button with Enter key", async () => {
      const user = userEvent.setup();
      const handlePageChange = vi.fn();
      render(<Pagination {...defaultProps} currentPage={1} onPageChange={handlePageChange} />);

      const nextButton = screen.getByText("Next");
      await user.tab();
      await user.keyboard("{Enter}");

      expect(handlePageChange).toHaveBeenCalled();
    });
  });

  describe("Accessibility", () => {
    it("should have proper button roles", () => {
      render(<Pagination {...defaultProps} />);
      const buttons = screen.getAllByRole("button");
      expect(buttons.length).toBeGreaterThan(0);
    });

    it("should show aria-label for navigation buttons", () => {
      render(<Pagination {...defaultProps} currentPage={1} />);
      const prevButton = screen.getByText("Previous");
      const nextButton = screen.getByText("Next");

      expect(prevButton).toHaveAttribute("aria-label");
      expect(nextButton).toHaveAttribute("aria-label");
    });

    it("should have proper ARIA attributes for current page", () => {
      render(<Pagination {...defaultProps} currentPage={3} />);
      const currentPageButton = screen.getByRole("button", { name: /Go to page 3/ });
      expect(currentPageButton).toHaveAttribute("aria-current");
    });
  });

  describe("Edge Cases", () => {
    it("should handle page 1", () => {
      render(<Pagination {...defaultProps} currentPage={1} hasNextPage={true} />);
      expect(screen.getByText("Previous")).toBeDisabled();
      expect(screen.getByText("Next")).not.toBeDisabled();
    });

    it("should handle last page without next", () => {
      render(<Pagination {...defaultProps} currentPage={100} hasNextPage={false} />);
      expect(screen.getByText("Previous")).not.toBeDisabled();
      expect(screen.getByText("Next")).toBeDisabled();
    });

    it("should handle single page", () => {
      render(<Pagination {...defaultProps} currentPage={1} hasNextPage={false} />);
      expect(screen.getByText("Previous")).toBeDisabled();
      expect(screen.getByText("Next")).toBeDisabled();
    });

    it("should handle very large current page", () => {
      render(<Pagination {...defaultProps} currentPage={999} hasNextPage={false} />);
      // Check for the page summary text instead of a button
      expect(screen.getByText(/Page 999/)).toBeInTheDocument();
    });
  });

  describe("Layout", () => {
    it("should have flex centering", () => {
      const { container } = render(<Pagination {...defaultProps} />);
      const wrapper = container.querySelector(".flex");
      expect(wrapper).toHaveClass("items-center", "justify-center");
    });

    it("should have proper gap between items", () => {
      const { container } = render(<Pagination {...defaultProps} />);
      const wrapper = container.querySelector(".flex");
      expect(wrapper).toHaveClass("gap-1");
    });
  });
});
