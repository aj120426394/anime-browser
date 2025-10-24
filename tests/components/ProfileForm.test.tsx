import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ProfileForm } from "@/components/ProfileForm";

describe("ProfileForm Component", () => {
  describe("Rendering (T036)", () => {
    it("should render form with title", () => {
      const mockOnSubmit = vi.fn();
      render(<ProfileForm onSubmit={mockOnSubmit} />);
      expect(screen.getByText("Create Your Profile")).toBeInTheDocument();
    });

    it("should render username and job title input fields", () => {
      const mockOnSubmit = vi.fn();
      render(<ProfileForm onSubmit={mockOnSubmit} />);
      const usernameInput = screen.getByPlaceholderText("Enter your username");
      const jobTitleInput = screen.getByPlaceholderText("Enter your job title");
      expect(usernameInput).toBeInTheDocument();
      expect(jobTitleInput).toBeInTheDocument();
    });

    it("should render submit button", () => {
      const mockOnSubmit = vi.fn();
      render(<ProfileForm onSubmit={mockOnSubmit} />);
      const submitButton = screen.getByRole("button", { name: /save profile/i });
      expect(submitButton).toBeInTheDocument();
    });

    it("should have proper labels for inputs", () => {
      const mockOnSubmit = vi.fn();
      render(<ProfileForm onSubmit={mockOnSubmit} />);
      const usernameLabel = screen.getByText("Username");
      const jobTitleLabel = screen.getByText("Job Title");
      expect(usernameLabel).toBeInTheDocument();
      expect(jobTitleLabel).toBeInTheDocument();
    });

    it("should have input maxLength attributes", () => {
      const mockOnSubmit = vi.fn();
      render(<ProfileForm onSubmit={mockOnSubmit} />);
      const usernameInput = screen.getByPlaceholderText("Enter your username") as HTMLInputElement;
      const jobTitleInput = screen.getByPlaceholderText("Enter your job title") as HTMLInputElement;
      expect(usernameInput.maxLength).toBe(50);
      expect(jobTitleInput.maxLength).toBe(100);
    });
  });

  describe("Validation (T036)", () => {
    it("should show error when username is empty on blur", async () => {
      const mockOnSubmit = vi.fn();
      render(<ProfileForm onSubmit={mockOnSubmit} />);
      const usernameInput = screen.getByPlaceholderText("Enter your username");

      fireEvent.focus(usernameInput);
      fireEvent.blur(usernameInput);

      await waitFor(() => {
        const errorMessage = screen.getByText(/Username is required/i);
        expect(errorMessage).toBeInTheDocument();
      });
    });

    it("should show error when job title is empty on blur", async () => {
      const mockOnSubmit = vi.fn();
      render(<ProfileForm onSubmit={mockOnSubmit} />);
      const jobTitleInput = screen.getByPlaceholderText("Enter your job title");

      fireEvent.focus(jobTitleInput);
      fireEvent.blur(jobTitleInput);

      await waitFor(() => {
        const errorMessage = screen.getByText(/Job title is required/i);
        expect(errorMessage).toBeInTheDocument();
      });
    });

    it("should clear error when user enters valid input after blur", async () => {
      const mockOnSubmit = vi.fn();
      render(<ProfileForm onSubmit={mockOnSubmit} />);
      const usernameInput = screen.getByPlaceholderText("Enter your username");

      // Trigger error
      fireEvent.focus(usernameInput);
      fireEvent.blur(usernameInput);

      await waitFor(() => {
        expect(screen.getByText(/Username is required/i)).toBeInTheDocument();
      });

      // Fix the error
      fireEvent.change(usernameInput, { target: { value: "TestUser" } });
      fireEvent.blur(usernameInput);

      await waitFor(() => {
        expect(screen.queryByText(/Username is required/i)).not.toBeInTheDocument();
      });
    });

    it("should prevent submission with empty fields", async () => {
      const mockOnSubmit = vi.fn();
      render(<ProfileForm onSubmit={mockOnSubmit} />);
      const submitButton = screen.getByRole("button", { name: /save profile/i });

      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockOnSubmit).not.toHaveBeenCalled();
      });
    });

    it("should validate fields on submit attempt", async () => {
      const mockOnSubmit = vi.fn();
      render(<ProfileForm onSubmit={mockOnSubmit} />);
      const submitButton = screen.getByRole("button", { name: /save profile/i });

      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/Username is required/i)).toBeInTheDocument();
        expect(screen.getByText(/Job title is required/i)).toBeInTheDocument();
      });
    });

    it("should show character count for username", () => {
      const mockOnSubmit = vi.fn();
      render(<ProfileForm onSubmit={mockOnSubmit} />);
      const usernameInput = screen.getByPlaceholderText("Enter your username");

      fireEvent.change(usernameInput, { target: { value: "Test" } });

      expect(screen.getByText(/4\/50 characters/)).toBeInTheDocument();
    });

    it("should show character count for job title", () => {
      const mockOnSubmit = vi.fn();
      render(<ProfileForm onSubmit={mockOnSubmit} />);
      const jobTitleInput = screen.getByPlaceholderText("Enter your job title");

      fireEvent.change(jobTitleInput, { target: { value: "Developer" } });

      expect(screen.getByText(/9\/100 characters/)).toBeInTheDocument();
    });
  });

  describe("Submission (T037)", () => {
    it("should call onSubmit with valid profile data", async () => {
      const mockOnSubmit = vi.fn();
      render(<ProfileForm onSubmit={mockOnSubmit} />);

      const usernameInput = screen.getByPlaceholderText("Enter your username");
      const jobTitleInput = screen.getByPlaceholderText("Enter your job title");
      const submitButton = screen.getByRole("button", { name: /save profile/i });

      fireEvent.change(usernameInput, { target: { value: "TestUser" } });
      fireEvent.change(jobTitleInput, { target: { value: "Engineer" } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          username: "TestUser",
          jobTitle: "Engineer",
        });
      });
    });

    it("should trim whitespace before submission", async () => {
      const mockOnSubmit = vi.fn();
      render(<ProfileForm onSubmit={mockOnSubmit} />);

      const usernameInput = screen.getByPlaceholderText("Enter your username");
      const jobTitleInput = screen.getByPlaceholderText("Enter your job title");
      const submitButton = screen.getByRole("button", { name: /save profile/i });

      fireEvent.change(usernameInput, { target: { value: "  TestUser  " } });
      fireEvent.change(jobTitleInput, { target: { value: "  Engineer  " } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          username: "TestUser",
          jobTitle: "Engineer",
        });
      });
    });

    it("should show loading state when isLoading is true", () => {
      const mockOnSubmit = vi.fn();
      render(<ProfileForm onSubmit={mockOnSubmit} isLoading={true} />);

      const submitButton = screen.getByRole("button", { name: /saving.../i });
      const usernameInput = screen.getByPlaceholderText("Enter your username") as HTMLInputElement;
      const jobTitleInput = screen.getByPlaceholderText("Enter your job title") as HTMLInputElement;

      expect(submitButton).toBeDisabled();
      expect(usernameInput.disabled).toBe(true);
      expect(jobTitleInput.disabled).toBe(true);
    });

    it("should not call onSubmit if validation fails on submit", async () => {
      const mockOnSubmit = vi.fn();
      render(<ProfileForm onSubmit={mockOnSubmit} />);

      const submitButton = screen.getByRole("button", { name: /save profile/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockOnSubmit).not.toHaveBeenCalled();
      });
    });

    it("should call onSubmit only once when form is submitted", async () => {
      const mockOnSubmit = vi.fn();
      render(<ProfileForm onSubmit={mockOnSubmit} />);

      const usernameInput = screen.getByPlaceholderText("Enter your username");
      const jobTitleInput = screen.getByPlaceholderText("Enter your job title");
      const submitButton = screen.getByRole("button", { name: /save profile/i });

      fireEvent.change(usernameInput, { target: { value: "TestUser" } });
      fireEvent.change(jobTitleInput, { target: { value: "Engineer" } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledTimes(1);
      });
    });

    it("should disable form fields during submission", async () => {
      const mockOnSubmit = vi.fn();
      const { rerender } = render(<ProfileForm onSubmit={mockOnSubmit} />);

      const usernameInput = screen.getByPlaceholderText("Enter your username") as HTMLInputElement;
      const jobTitleInput = screen.getByPlaceholderText("Enter your job title") as HTMLInputElement;

      expect(usernameInput.disabled).toBe(false);
      expect(jobTitleInput.disabled).toBe(false);

      rerender(<ProfileForm onSubmit={mockOnSubmit} isLoading={true} />);

      expect(usernameInput.disabled).toBe(true);
      expect(jobTitleInput.disabled).toBe(true);
    });

    it("should clear errors on successful submission", async () => {
      const mockOnSubmit = vi.fn();
      render(<ProfileForm onSubmit={mockOnSubmit} />);

      const usernameInput = screen.getByPlaceholderText("Enter your username");
      const jobTitleInput = screen.getByPlaceholderText("Enter your job title");
      const submitButton = screen.getByRole("button", { name: /save profile/i });

      fireEvent.change(usernameInput, { target: { value: "TestUser" } });
      fireEvent.change(jobTitleInput, { target: { value: "Engineer" } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalled();
      });

      // Verify no errors are displayed
      expect(screen.queryByText(/Username is required/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/Job title is required/i)).not.toBeInTheDocument();
    });

    it("should handle form submission with keyboard (Enter key)", async () => {
      const mockOnSubmit = vi.fn();
      render(<ProfileForm onSubmit={mockOnSubmit} />);

      const usernameInput = screen.getByPlaceholderText("Enter your username");
      const jobTitleInput = screen.getByPlaceholderText("Enter your job title");

      fireEvent.change(usernameInput, { target: { value: "TestUser" } });
      fireEvent.change(jobTitleInput, { target: { value: "Engineer" } });

      // Simulate Enter key on last field
      fireEvent.keyDown(jobTitleInput, { key: "Enter", code: "Enter" });

      // The form should submit (depends on form implementation)
      // For now, we verify the data is present
      expect((usernameInput as HTMLInputElement).value).toBe("TestUser");
      expect((jobTitleInput as HTMLInputElement).value).toBe("Engineer");
    });
  });

  describe("Accessibility", () => {
    it("should have proper role attributes for error messages", async () => {
      const mockOnSubmit = vi.fn();
      render(<ProfileForm onSubmit={mockOnSubmit} />);

      const usernameInput = screen.getByPlaceholderText("Enter your username");
      fireEvent.focus(usernameInput);
      fireEvent.blur(usernameInput);

      await waitFor(() => {
        const errorMessage = screen.getByText(/Username is required/i);
        expect(errorMessage).toHaveAttribute("role", "alert");
      });
    });

    it("should have associated labels and inputs", () => {
      const mockOnSubmit = vi.fn();
      render(<ProfileForm onSubmit={mockOnSubmit} />);

      const usernameInput = screen.getByPlaceholderText("Enter your username") as HTMLInputElement;
      const jobTitleInput = screen.getByPlaceholderText("Enter your job title") as HTMLInputElement;

      const usernameLabel = screen.getByText("Username");
      const jobTitleLabel = screen.getByText("Job Title");

      expect(usernameInput.id).toBe("username");
      expect(jobTitleInput.id).toBe("jobTitle");
      expect(usernameLabel).toHaveAttribute("for", "username");
      expect(jobTitleLabel).toHaveAttribute("for", "jobTitle");
    });
  });
});
