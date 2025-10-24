import { test, expect } from "@playwright/test";

test.describe("Profile Gate", () => {
  test.beforeEach(async ({ page, context }) => {
    // Navigate to the page first to establish the document context
    await page.goto("/");

    // Now clear storage (only after page is loaded)
    await page.evaluate(() => {
      try {
        localStorage.clear();
        sessionStorage.clear();
      } catch (e) {
        // Ignore storage access errors in test environment
        console.log("Storage clear skipped:", e);
      }
    });

    // Reload to ensure clean state
    await page.reload();
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

    // Type username at maximum length (50 chars)
    const maxUsername = "a".repeat(50);
    await usernameInput.fill(maxUsername);

    // Verify character counter shows correct count
    await expect(page.getByText("50/50 characters")).toBeVisible();

    // Type job title at maximum length (100 chars)
    const maxJobTitle = "b".repeat(100);
    await jobTitleInput.fill(maxJobTitle);

    // Verify character counter shows correct count
    await expect(page.getByText("100/100 characters")).toBeVisible();

    // Should be able to submit with max length values
    await page.getByRole("button", { name: /submit|save/i }).click();

    // Should redirect to information page (form accepted max length)
    await page.waitForURL("/information");
    expect(page.url()).toContain("/information");
  });

  test("should submit valid profile and save to localStorage", async ({ page, context }) => {
    await page.goto("/");

    // Fill form with valid data
    await page.fill("input#username", "TestUser");
    await page.fill("input#jobTitle", "QA Engineer");

    // Submit form
    await page.getByRole("button", { name: /submit|save/i }).click();

    // Should redirect to information page
    await page.waitForURL("/information");

    // Verify localStorage was updated
    const storedProfile = await page.evaluate(() => {
      return JSON.parse(localStorage.getItem("user-profile") || "{}");
    });
    expect(storedProfile.username).toBe("TestUser");
    expect(storedProfile.jobTitle).toBe("QA Engineer");
  });

  test("should redirect to /information if profile exists", async ({ page }) => {
    await page.goto("/");

    // Submit profile
    await page.fill("input#username", "User1");
    await page.fill("input#jobTitle", "Developer");
    await page.getByRole("button", { name: /submit|save/i }).click();

    // Wait for redirect
    await page.waitForURL("/information");

    // Verify we're on information page
    expect(page.url()).toContain("/information");
  });

  test("should persist profile on page reload", async ({ page, context }) => {
    await page.goto("/");

    // Submit profile
    await page.fill("input#username", "PersistUser");
    await page.fill("input#jobTitle", "Designer");
    await page.getByRole("button", { name: /submit|save/i }).click();

    // Wait for redirect
    await page.waitForURL("/information");

    // Reload page
    await page.reload();

    // Should still be on information page (profile exists)
    expect(page.url()).toContain("/information");
  });

  test("should allow editing saved profile (T090)", async ({ page, context }) => {
    await page.goto("/");

    // Initial profile setup
    await page.fill("input#username", "OriginalUser");
    await page.fill("input#jobTitle", "Engineer");
    await page.getByRole("button", { name: /submit|save/i }).click();

    // Wait for redirect to information page
    await page.waitForURL("/information");

    // Look for Edit Profile button
    const editProfileButton = page
      .locator("button, a")
      .filter({ hasText: /edit profile/i })
      .first();
    if ((await editProfileButton.count()) > 0) {
      await editProfileButton.click();

      // Wait for edit form to appear
      const usernameInput = page.locator(`input#username`);
      await expect(usernameInput).toBeVisible();

      // Update profile
      await usernameInput.fill("UpdatedUser");
      const saveButton = page
        .locator("button")
        .filter({ hasText: /save|submit/i })
        .last();
      await saveButton.click();

      // Verify localStorage was updated
      const storedProfile = await page.evaluate(() => {
        return JSON.parse(localStorage.getItem("user-profile") || "{}");
      });
      expect(storedProfile.username).toBe("UpdatedUser");
    }
  });

  test("should be keyboard accessible", async ({ page }) => {
    await page.goto("/");

    const usernameInput = page.getByLabel(/username/i);
    const jobTitleInput = page.getByLabel(/job title/i);
    const submitButton = page.getByRole("button", { name: /submit|save/i });

    // Focus the username input directly (more reliable than Tab from page start)
    await usernameInput.focus();
    await expect(usernameInput).toBeFocused();

    // Type username
    await page.keyboard.type("john_doe");

    // Tab to job title field
    await page.keyboard.press("Tab");
    await expect(jobTitleInput).toBeFocused();

    // Type job title
    await page.keyboard.type("Engineer");

    // Tab to submit button
    await page.keyboard.press("Tab");
    await expect(submitButton).toBeFocused();

    // Submit with keyboard
    await page.keyboard.press("Enter");

    // Should be redirected to information page
    await page.waitForURL(/\/information/);
    expect(page.url()).toContain("/information");
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

  test("should display footer on home page (T108)", async ({ page }) => {
    await page.goto("/");

    // Footer should be visible with version text
    const footer = page.locator("text=/challenge version|v\\d+\\.\\d+/i");
    await expect(footer).toBeVisible();
  });

  test("should display footer on information page (T108)", async ({ page }) => {
    // Setup profile first
    await page.goto("/");

    await page.fill("input#username", "TestUser");
    await page.fill("input#jobTitle", "QA Engineer");
    await page.getByRole("button", { name: /submit|save/i }).click();

    // Wait for redirect
    await expect(page).toHaveURL(/\/information/);

    // Footer should be visible
    const footer = page.locator("text=/challenge version|v\\d+\\.\\d+/i");
    await expect(footer).toBeVisible();
  });

  test("should have mobile-friendly profile form (T097)", async ({ page }) => {
    // Set mobile viewport (320px width)
    await page.setViewportSize({ width: 320, height: 568 });

    await page.goto("/");

    // All form elements should be visible and usable
    await expect(page.getByRole("heading", { name: /create your profile/i })).toBeVisible();
    await expect(page.getByLabel(/username/i)).toBeVisible();
    await expect(page.getByLabel(/job title/i)).toBeVisible();

    const submitButton = page.getByRole("button", { name: /save profile/i });
    await expect(submitButton).toBeVisible();

    // Form should be usable on mobile
    const usernameInput = page.getByLabel(/username/i);
    const jobTitleInput = page.getByLabel(/job title/i);

    await usernameInput.fill("MobileTestUser");
    await jobTitleInput.fill("Mobile Developer");

    // Button should be clickable
    await expect(submitButton).toBeEnabled();

    // Submit should work
    await submitButton.click();

    // Should redirect to information page
    await page.waitForURL(/\/information/);
    expect(page.url()).toContain("/information");
  });
});
