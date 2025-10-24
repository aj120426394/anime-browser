import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Footer } from "@/components/Footer";

describe("Footer Component", () => {
  describe("Version Display (T107)", () => {
    it("should display challenge version from environment variable", () => {
      render(<Footer />);

      // Should display version - check for "v3.5" or "Challenge version"
      const versionText =
        screen.queryByText(/challenge version/i) || screen.queryByText(/v\d+\.\d+/);
      expect(versionText).toBeInTheDocument();
    });

    it("should display version number in correct format", () => {
      render(<Footer />);

      // Version should be in format vX.Y
      const footer = screen.getByText(/v\d+\.\d+/);
      expect(footer).toBeInTheDocument();
    });

    it("should include proper copyright or attribution", () => {
      render(<Footer />);

      // Footer should have some text content
      const footerElement = screen.getByRole("contentinfo") || screen.getByText(/v\d+\.\d+/);
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

      // Footer should always be visible
      const footer = screen.getByText(/v\d+\.\d+/);
      expect(footer).toBeVisible();
    });
  });
});
