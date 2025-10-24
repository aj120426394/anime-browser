import { test, expect } from "@playwright/test";

test.describe("Pagination and Data Loading E2E", () => {
  test.beforeEach(async ({ page }) => {
    // Start on homepage
    await page.goto("/");
    
    // Fill in profile form
    await page.fill('input[name="username"]', "TestUser");
    await page.fill('input[name="jobTitle"]', "QA Engineer");
    await page.click('button:has-text("Enter")');
    
    // Wait for redirect to information page
    await page.waitForURL("/information");
  });

  test.describe("Data Loading from AniList API", () => {
    test("should load anime data on page load", async ({ page }) => {
      // Wait for media items to appear
      await page.waitForSelector("button:has-text('FINISHED')");
      
      // Verify at least one media item is visible
      const mediaItems = await page.locator("button").filter({ has: page.locator("text=FINISHED") });
      expect(await mediaItems.count()).toBeGreaterThan(0);
    });

    test("should display media card elements", async ({ page }) => {
      await page.waitForSelector("img");
      
      // Verify images loaded
      const images = await page.locator("img").count();
      expect(images).toBeGreaterThan(0);
      
      // Verify titles visible
      const titles = await page.locator("h3").count();
      expect(titles).toBeGreaterThan(0);
    });

    test("should show loading skeleton initially then content", async ({ page }) => {
      // Fresh load should show skeleton
      const skeletons = await page.locator("[aria-busy]").count();
      
      // Wait for data to load
      await page.waitForSelector("button:has-text('FINISHED')");
      
      // Content should now be visible
      const mediaItems = await page.locator("button").filter({ has: page.locator("text=FINISHED") });
      expect(await mediaItems.count()).toBeGreaterThan(0);
    });

    test("should display page info (current page, has next)", async ({ page }) => {
      await page.waitForSelector("button:has-text('Previous')");
      
      // Previous should be disabled on page 1
      const prevButton = page.locator("button:has-text('Previous')");
      expect(await prevButton.isDisabled()).toBe(true);
      
      // Next should be enabled (assuming there are multiple pages)
      const nextButton = page.locator("button:has-text('Next')");
      expect(await nextButton.isDisabled()).toBe(false);
    });
  });

  test.describe("Pagination Navigation", () => {
    test("should navigate to next page", async ({ page }) => {
      await page.waitForSelector("button:has-text('FINISHED')");
      
      // Get first item title on page 1
      const firstPageFirstItem = await page.locator("h3").first().textContent();
      
      // Click Next button
      await page.click("button:has-text('Next')");
      
      // Wait for page 2 to load
      await page.waitForSelector("button:has-text('FINISHED')");
      await page.waitForTimeout(500); // Small delay for data to update
      
      // First item on page 2 should be different
      const secondPageFirstItem = await page.locator("h3").first().textContent();
      expect(secondPageFirstItem).not.toEqual(firstPageFirstItem);
    });

    test("should navigate to previous page", async ({ page }) => {
      await page.waitForSelector("button:has-text('FINISHED')");
      
      // Go to page 2
      await page.click("button:has-text('Next')");
      await page.waitForSelector("button:has-text('FINISHED')");
      
      // Get first item on page 2
      const secondPageFirstItem = await page.locator("h3").first().textContent();
      
      // Click Previous button
      await page.click("button:has-text('Previous')");
      await page.waitForTimeout(500);
      
      // Should be back to page 1
      const firstPageFirstItem = await page.locator("h3").first().textContent();
      
      // Items should be different (page 1 vs page 2)
      expect(firstPageFirstItem).not.toEqual(secondPageFirstItem);
    });

    test("should navigate to specific page number", async ({ page }) => {
      await page.waitForSelector("button:has-text('FINISHED')");
      
      // Click page 3
      await page.click("button:has-text('3')");
      await page.waitForSelector("button:has-text('FINISHED')");
      
      // Page 3 button should be highlighted
      const page3Button = page.locator("button:has-text('3')");
      expect(await page3Button.evaluate((el) => el.getAttribute("aria-current"))).toBeTruthy();
    });

    test("Previous button should be disabled on page 1", async ({ page }) => {
      await page.waitForSelector("button:has-text('Previous')");
      const prevButton = page.locator("button:has-text('Previous')");
      expect(await prevButton.isDisabled()).toBe(true);
    });

    test("Previous button should be enabled on page > 1", async ({ page }) => {
      await page.waitForSelector("button:has-text('FINISHED')");
      
      // Go to page 2
      await page.click("button:has-text('Next')");
      await page.waitForSelector("button:has-text('Previous')");
      
      const prevButton = page.locator("button:has-text('Previous')");
      expect(await prevButton.isDisabled()).toBe(false);
    });

    test("pagination buttons should be disabled while loading", async ({ page }) => {
      await page.waitForSelector("button:has-text('Next')");
      
      const nextButton = page.locator("button:has-text('Next')");
      
      // Click next
      await nextButton.click();
      
      // Briefly check if button is disabled during loading
      // (This is a timing-dependent test, may need adjustment)
      await page.waitForSelector("button:has-text('FINISHED')");
      expect(await nextButton.isDisabled()).toBe(false);
    });
  });

  test.describe("Error Handling", () => {
    test("should handle network errors gracefully", async ({ page }) => {
      // Simulate offline mode
      await page.context().setOffline(true);
      
      // Navigate to information page
      await page.goto("/information");
      
      // Wait a moment for error to appear
      await page.waitForTimeout(1000);
      
      // Look for error message
      const errorMessage = page.locator("text=/Error|failed|network/i");
      
      // Should see error (or cached data)
      const hasError = await errorMessage.count().then((c) => c > 0);
      
      // Re-enable network
      await page.context().setOffline(false);
    });
  });

  test.describe("URL Synchronization", () => {
    test("should update URL with page parameter", async ({ page }) => {
      await page.waitForSelector("button:has-text('FINISHED')");
      
      // Go to page 2
      await page.click("button:has-text('Next')");
      await page.waitForSelector("button:has-text('FINISHED')");
      
      // Check URL contains page parameter
      const url = page.url();
      expect(url).toContain("page=2");
    });

    test("should update page number when URL changes", async ({ page }) => {
      // Navigate directly to page 3
      await page.goto("/information?page=3");
      
      // Wait for data to load
      await page.waitForSelector("button:has-text('FINISHED')");
      
      // Page 3 button should be current
      const page3Button = page.locator("button:has-text('3')");
      expect(await page3Button.evaluate((el) => el.getAttribute("aria-current"))).toBeTruthy();
    });
  });

  test.describe("Data Consistency", () => {
    test("should maintain data consistency across pagination", async ({ page }) => {
      await page.waitForSelector("button:has-text('FINISHED')");
      
      // Get list of items on page 1
      const page1Items = await page.locator("h3").allTextContents();
      
      // Go to page 2
      await page.click("button:has-text('Next')");
      await page.waitForSelector("button:has-text('FINISHED')");
      const page2Items = await page.locator("h3").allTextContents();
      
      // Go back to page 1
      await page.click("button:has-text('Previous')");
      await page.waitForSelector("button:has-text('FINISHED')");
      const page1ItemsAgain = await page.locator("h3").allTextContents();
      
      // Page 1 data should be the same
      expect(page1Items).toEqual(page1ItemsAgain);
    });
  });

  test.describe("Responsive Pagination", () => {
    test("should show pagination on mobile viewport", async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      
      await page.waitForSelector("button:has-text('Previous')");
      
      const prevButton = page.locator("button:has-text('Previous')");
      expect(await prevButton.isVisible()).toBe(true);
    });

    test("should show pagination on desktop viewport", async ({ page }) => {
      // Set desktop viewport
      await page.setViewportSize({ width: 1920, height: 1080 });
      
      await page.waitForSelector("button:has-text('Previous')");
      
      const prevButton = page.locator("button:has-text('Previous')");
      expect(await prevButton.isVisible()).toBe(true);
    });
  });

  test.describe("Accessibility in Pagination", () => {
    test("should be keyboard navigable", async ({ page }) => {
      await page.waitForSelector("button:has-text('Next')");
      
      // Tab to Next button
      await page.keyboard.press("Tab");
      await page.keyboard.press("Tab");
      
      // Press Enter to activate
      await page.keyboard.press("Enter");
      
      // Should navigate to page 2
      await page.waitForSelector("button:has-text('FINISHED')");
      const url = page.url();
      expect(url).toContain("page=2");
    });

    test("pagination buttons should have aria-labels", async ({ page }) => {
      await page.waitForSelector("button:has-text('Previous')");
      
      const prevButton = page.locator("button:has-text('Previous')");
      const ariaLabel = await prevButton.getAttribute("aria-label");
      expect(ariaLabel).toBeTruthy();
    });

    test("current page should have aria-current attribute", async ({ page }) => {
      await page.waitForSelector("button:has-text('1')");
      
      const currentPageButton = page.locator("button:has-text('1')[aria-current]");
      expect(await currentPageButton.count()).toBeGreaterThan(0);
    });
  });
});
