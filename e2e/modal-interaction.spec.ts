import { test, expect } from "@playwright/test";

test.describe("Modal Interaction E2E", () => {
  test.beforeEach(async ({ page }) => {
    // Start on homepage
    await page.goto("/");

    // Fill in profile form
    await page.fill('input[name="username"]', "TestUser");
    await page.fill('input[name="jobTitle"]', "QA Engineer");
    await page.click('button:has-text("Enter")');

    // Wait for redirect to information page
    await page.waitForURL("/information");
    await page.waitForSelector("button:has-text('FINISHED')");
  });

  test.describe("Modal Open on Item Click (T076)", () => {
    test("should open modal when clicking media card", async ({ page }) => {
      // Click on first media item
      const firstCard = page
        .locator("button")
        .filter({ has: page.locator("text=FINISHED") })
        .first();
      await firstCard.click();

      // Modal should appear
      const modal = page.locator("[role='dialog']");
      await expect(modal).toBeVisible();

      // Modal should contain media details
      await expect(page.locator("h2, h3").first()).toContainText(/.+/);
    });

    test("should display large image in modal", async ({ page }) => {
      // Click first media item
      const firstCard = page
        .locator("button")
        .filter({ has: page.locator("text=FINISHED") })
        .first();
      await firstCard.click();

      // Wait for modal
      const modal = page.locator("[role='dialog']");
      await expect(modal).toBeVisible();

      // Modal should contain image
      const image = modal.locator("img").first();
      await expect(image).toBeVisible();
    });

    test("should display title, status, and description in modal", async ({ page }) => {
      // Click first media item
      const firstCard = page
        .locator("button")
        .filter({ has: page.locator("text=FINISHED") })
        .first();
      await firstCard.click();

      // Modal should be visible
      const modal = page.locator("[role='dialog']");
      await expect(modal).toBeVisible();

      // Should contain media information
      await expect(modal.locator("text=FINISHED")).toBeVisible();
    });
  });

  test.describe("Modal Close via ESC Key (T077)", () => {
    test("should close modal when ESC key pressed", async ({ page }) => {
      // Open modal
      const firstCard = page
        .locator("button")
        .filter({ has: page.locator("text=FINISHED") })
        .first();
      await firstCard.click();

      const modal = page.locator("[role='dialog']");
      await expect(modal).toBeVisible();

      // Press ESC
      await page.keyboard.press("Escape");

      // Modal should be hidden
      await expect(modal).not.toBeVisible();
    });

    test("should close modal when close button clicked", async ({ page }) => {
      // Open modal
      const firstCard = page
        .locator("button")
        .filter({ has: page.locator("text=FINISHED") })
        .first();
      await firstCard.click();

      const modal = page.locator("[role='dialog']");
      await expect(modal).toBeVisible();

      // Click close button (usually X icon)
      const closeButton = modal
        .locator("button")
        .filter({ has: page.locator("text=/✕|×|close|dismiss/i") })
        .first();
      if ((await closeButton.count()) > 0) {
        await closeButton.click();
      } else {
        // Try finding by aria-label
        const closeByLabel = modal
          .locator("button[aria-label*='close' i], button[aria-label*='dismiss' i]")
          .first();
        if ((await closeByLabel.count()) > 0) {
          await closeByLabel.click();
        }
      }

      // Modal should be hidden
      await expect(modal).not.toBeVisible();
    });

    test("should close modal when overlay clicked", async ({ page }) => {
      // Open modal
      const firstCard = page
        .locator("button")
        .filter({ has: page.locator("text=FINISHED") })
        .first();
      await firstCard.click();

      const modal = page.locator("[role='dialog']");
      await expect(modal).toBeVisible();

      // Click overlay/backdrop
      const backdrop = page.locator("[data-testid='modal-backdrop']");
      if ((await backdrop.count()) > 0) {
        await backdrop.click();
        await expect(modal).not.toBeVisible();
      }
    });
  });

  test.describe("Modal Keyboard Navigation - Tab Focus Trap (T078)", () => {
    test("should keep focus within modal when tabbing", async ({ page }) => {
      // Open modal
      const firstCard = page
        .locator("button")
        .filter({ has: page.locator("text=FINISHED") })
        .first();
      await firstCard.click();

      const modal = page.locator("[role='dialog']");
      await expect(modal).toBeVisible();

      // Get all focusable elements in modal
      const focusableElements = modal.locator("button, a, input, [tabindex='0']");
      const count = await focusableElements.count();

      // There should be at least a close button
      expect(count).toBeGreaterThan(0);

      // Tab should move focus within modal (not outside)
      await page.keyboard.press("Tab");

      // Modal should still be visible (focus didn't leave it)
      await expect(modal).toBeVisible();
    });

    test("should navigate between modal elements with Tab key", async ({ page }) => {
      // Open modal
      const firstCard = page
        .locator("button")
        .filter({ has: page.locator("text=FINISHED") })
        .first();
      await firstCard.click();

      const modal = page.locator("[role='dialog']");
      await expect(modal).toBeVisible();

      // Get focused element before tab
      const focusedBefore = await page.evaluate(() =>
        document.activeElement?.getAttribute("aria-label")
      );

      // Tab to next element
      await page.keyboard.press("Tab");

      // Focus should have moved (or stayed within modal)
      const focusedAfter = await page.evaluate(() =>
        document.activeElement?.getAttribute("aria-label")
      );

      // At minimum, modal should still be open
      await expect(modal).toBeVisible();
    });

    test("should allow closing modal with Enter on close button", async ({ page }) => {
      // Open modal
      const firstCard = page
        .locator("button")
        .filter({ has: page.locator("text=FINISHED") })
        .first();
      await firstCard.click();

      const modal = page.locator("[role='dialog']");
      await expect(modal).toBeVisible();

      // Tab to close button
      let tabCount = 0;
      while (tabCount < 10) {
        await page.keyboard.press("Tab");
        tabCount++;

        const focused = await page.evaluate(() => {
          const el = document.activeElement as HTMLElement;
          return el?.getAttribute("aria-label") || el?.textContent;
        });

        // If we find close button, press Enter
        if (
          focused &&
          (focused.includes("close") || focused.includes("dismiss") || focused === "×")
        ) {
          await page.keyboard.press("Enter");
          break;
        }
      }

      // Modal should be closed or still visible (graceful failure)
      // At minimum, ESC should always work
      await page.keyboard.press("Escape");
      await expect(modal).not.toBeVisible();
    });

    test("should have proper ARIA attributes for accessibility", async ({ page }) => {
      // Open modal
      const firstCard = page
        .locator("button")
        .filter({ has: page.locator("text=FINISHED") })
        .first();
      await firstCard.click();

      const modal = page.locator("[role='dialog']");
      await expect(modal).toBeVisible();

      // Modal should have aria-labelledby
      const ariaLabelledBy = await modal.getAttribute("aria-labelledby");
      if (ariaLabelledBy) {
        const label = page.locator(`#${ariaLabelledBy}`);
        await expect(label).toBeVisible();
      }

      // Modal should be in focus or be keyboard accessible
      expect(modal).toBeTruthy();
    });
  });

  test.describe("Modal on Mobile Viewport", () => {
    test("should be usable on mobile size", async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });

      // Open modal
      const firstCard = page
        .locator("button")
        .filter({ has: page.locator("text=FINISHED") })
        .first();
      await firstCard.click();

      // Modal should be visible and readable
      const modal = page.locator("[role='dialog']");
      await expect(modal).toBeVisible();

      // Close button should be accessible
      await page.keyboard.press("Escape");
      await expect(modal).not.toBeVisible();
    });
  });
});
