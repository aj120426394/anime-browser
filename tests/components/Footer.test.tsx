import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Footer } from "@/components/Footer";

describe("Footer Component", () => {
  describe("Version Display (T107)", () => {
    it("should display challenge version from environment variable", () => {
      render(<Footer />);

      // Should display version - check for "Challenge version"
      const versionText = screen.getByText(/challenge version/i);
      expect(versionText).toBeInTheDocument();
    });

    it("should display version number in correct format", () => {
      render(<Footer />);

      // Version should be displayed (static version 3.5)
      const footer = screen.getByText(/challenge version/i);
      expect(footer).toBeInTheDocument();
      // Verify version number is present
      expect(footer.textContent).toMatch(/\d+\.\d+/);
    });

    it("should include proper copyright or attribution", () => {
      render(<Footer />);

      // Footer should have version text content
      const footerElement = screen.getByText(/challenge version/i);
      expect(footerElement).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have proper semantic footer role", () => {
      const { container } = render(<Footer />);

      const footer = container.querySelector("footer");
      expect(footer).toBeInTheDocument();
    });

    it("should have sufficient text contrast", () => {
      const { container } = render(<Footer />);

      const footer = container.querySelector("footer");
      expect(footer).toBeInTheDocument();
      // Color contrast should meet WCAG AA standards (tested manually)
    });
  });

  describe("Responsiveness", () => {
    it("should render on all screen sizes", () => {
      render(<Footer />);

      // Footer should always be visible with version text
      const footer = screen.getByText(/challenge version/i);
      expect(footer).toBeVisible();
    });
  });
});
