import { test, expect } from "@playwright/test";

test("store page looks correct", async ({ page }) => {
  await page.setViewportSize({
    width: 1280,
    height: 900,
  });

  await page.goto("/");

  await page.locator(".item-card").first().waitFor();

  await page.evaluate(() => document.fonts.ready);

  await expect(page).toHaveScreenshot(
    "store-page.png",
    {
      fullPage: true,
    },
  );
});

test("store page looks correct in dark mode", async ({ page }) => {
  await page.setViewportSize({
    width: 1280,
    height: 900,
  });

  await page.goto("/");

  await page.locator(".item-card").first().waitFor();

  await page.getByRole("button", { name: /dark mode/i }).click();

  await page.locator("html[data-theme='dark']").waitFor();

  await page.evaluate(() => document.fonts.ready);

  await expect(page).toHaveScreenshot(
    "store-page-dark.png",
    {
      fullPage: true,
    },
  );
});

test("store keeps 3 columns at 800px", async ({ page }) => {
  await page.setViewportSize({
    width: 800,
    height: 900,
  });

  await page.goto("/");

  await page.locator(".item-card").first().waitFor();

  await page.evaluate(() => document.fonts.ready);

  const grid = page.locator(".item-grid");

  await expect(grid).toHaveScreenshot(
    "store-grid-800.png",
  );
});