import { test, expect } from "@playwright/test";

test.describe("Profile Gate", () => {
  test.beforeEach(async ({ page, context }) => {
    // Clear all cookies and storage before each test
    await context.clearCookies();
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
  });

  test("should display profile form on fresh visit", async ({ page }) => {
    await page.goto("/");

    // Should see the profile form
    await expect(page.getByRole("heading", { name: /profile/i })).toBeVisible();
    await expect(page.getByLabel(/username/i)).toBeVisible();
    await expect(page.getByLabel(/job title/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /submit|save/i })).toBeVisible();
  });

  test("should validate empty fields", async ({ page }) => {
    await page.goto("/");

    // Try to submit without filling in fields
    await page.getByRole("button", { name: /submit|save/i }).click();

    // Should see validation errors
    await expect(page.getByText(/username is required/i)).toBeVisible();
    await expect(page.getByText(/job title is required/i)).toBeVisible();
  });

  test("should validate field lengths", async ({ page }) => {
    await page.goto("/");

    const usernameInput = page.getByLabel(/username/i);
    const jobTitleInput = page.getByLabel(/job title/i);

    // Type too long username (51 chars)
    await usernameInput.fill("a".repeat(51));
    await jobTitleInput.fill("Valid Job Title");

    await page.getByRole("button", { name: /submit|save/i }).click();

    // Should see length error
    await expect(page.getByText(/must be 50 characters or less/i)).toBeVisible();
  });

  test("should submit valid profile and save to localStorage", async ({ page }) => {
    await page.goto("/");

    const usernameInput = page.getByLabel(/username/i);
    const jobTitleInput = page.getByLabel(/job title/i);

    await usernameInput.fill("john_doe");
    await jobTitleInput.fill("Software Engineer");

    await page.getByRole("button", { name: /submit|save/i }).click();

    // Should save profile to localStorage
    const profileData = await page.evaluate(() => {
      return localStorage.getItem("user-profile");
    });

    expect(profileData).toBeTruthy();
    const profile = JSON.parse(profileData || "{}");
    expect(profile.username).toBe("john_doe");
    expect(profile.jobTitle).toBe("Software Engineer");
  });

  test("should redirect to /information after profile submission", async ({ page }) => {
    await page.goto("/");

    const usernameInput = page.getByLabel(/username/i);
    const jobTitleInput = page.getByLabel(/job title/i);

    await usernameInput.fill("jane_doe");
    await jobTitleInput.fill("Product Manager");

    await page.getByRole("button", { name: /submit|save/i }).click();

    // Should be redirected to information page
    await expect(page).toHaveURL(/\/information/);
  });

  test("should bypass form if profile already exists in localStorage", async ({ page, context }) => {
    // Set a profile in localStorage
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.setItem(
        "user-profile",
        JSON.stringify({ username: "existing_user", jobTitle: "Developer" })
      );
    });

    // Navigate to home page
    await page.goto("/");

    // Should be redirected to /information without showing form
    await expect(page).toHaveURL(/\/information/);
  });

  test("should be keyboard accessible", async ({ page }) => {
    await page.goto("/");

    const usernameInput = page.getByLabel(/username/i);

    // Tab to username field
    await page.keyboard.press("Tab");
    await expect(usernameInput).toBeFocused();

    // Type username
    await page.keyboard.type("john_doe");

    // Tab to job title field
    await page.keyboard.press("Tab");
    const jobTitleInput = page.getByLabel(/job title/i);
    await expect(jobTitleInput).toBeFocused();

    // Type job title
    await page.keyboard.type("Engineer");

    // Tab to submit button
    await page.keyboard.press("Tab");
    const submitButton = page.getByRole("button", { name: /submit|save/i });
    await expect(submitButton).toBeFocused();

    // Submit with keyboard
    await page.keyboard.press("Enter");

    // Should be redirected
    await expect(page).toHaveURL(/\/information/);
  });

  test("should be mobile friendly (320px viewport)", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    await page.goto("/");

    // All form elements should be visible and usable
    await expect(page.getByRole("heading", { name: /profile/i })).toBeVisible();
    await expect(page.getByLabel(/username/i)).toBeVisible();
    await expect(page.getByLabel(/job title/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /submit|save/i })).toBeVisible();

    // Should be able to interact with form
    const usernameInput = page.getByLabel(/username/i);
    const jobTitleInput = page.getByLabel(/job title/i);

    await usernameInput.fill("mobile_user");
    await jobTitleInput.fill("Mobile Developer");

    await page.getByRole("button", { name: /submit|save/i }).click();

    // Should navigate successfully
    await expect(page).toHaveURL(/\/information/);
  });
});
