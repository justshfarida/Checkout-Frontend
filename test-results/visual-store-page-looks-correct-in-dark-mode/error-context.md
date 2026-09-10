# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: visual.spec.js >> store page looks correct in dark mode
- Location: tests/visual.spec.js:16:1

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.waitFor: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('.item-card').first() to be visible

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - generic [ref=e4]:
    - banner [ref=e5]:
      - link "Xsolla Xsolla Store" [ref=e6] [cursor=pointer]:
        - /url: /
        - img "Xsolla" [ref=e7]
        - generic [ref=e8]: Xsolla Store
      - navigation [ref=e9]:
        - link "Store" [ref=e10] [cursor=pointer]:
          - /url: /
        - link "Cart" [ref=e11] [cursor=pointer]:
          - /url: /checkout
        - link "Login" [ref=e13] [cursor=pointer]:
          - /url: /login
    - main [ref=e14]:
      - heading "The catalogue could not be loaded." [level=2] [ref=e17]
  - contentinfo [ref=e18]:
    - generic [ref=e19]: React Hooks Project
    - button "🌙 Dark Mode" [ref=e20] [cursor=pointer]
```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  | 
  3  | test("store page looks correct", async ({ page }) => {
  4  |   await page.goto("/");
  5  | 
  6  |   await page.evaluate(() => document.fonts.ready);
  7  | 
  8  |   await expect(page).toHaveScreenshot(
  9  |     "store-page.png",
  10 |     {
  11 |       fullPage: true,
  12 |     }
  13 |   );
  14 | });
  15 | 
  16 | test("store page looks correct in dark mode", async ({ page }) => {
  17 |   await page.goto("/");
  18 | 
  19 |   // Wait for products to load
> 20 |   await page.locator(".item-card").first().waitFor();
     |                                            ^ Error: locator.waitFor: Test timeout of 30000ms exceeded.
  21 | 
  22 |   // Click your dark mode button
  23 |   await page.getByRole("button", { name: /dark mode/i }).click();
  24 | 
  25 |   // Wait until dark theme is actually applied
  26 |   await page.locator("html[data-theme='dark']").waitFor();
  27 | 
  28 |   // Wait for fonts
  29 |   await page.evaluate(() => document.fonts.ready);
  30 | 
  31 |   // Screenshot the whole dark-mode Store
  32 |   await expect(page).toHaveScreenshot(
  33 |     "store-page-dark.png",
  34 |     {
  35 |       fullPage: true,
  36 |     }
  37 |   );
  38 | });
  39 | 
  40 | test("store keeps 3 columns at 800px", async ({ page }) => {
  41 |   await page.setViewportSize({
  42 |     width: 800,
  43 |     height: 900,
  44 |   });
  45 | 
  46 |   await page.goto("/");
  47 | 
  48 |   await page.locator(".item-card").first().waitFor();
  49 |   await page.evaluate(() => document.fonts.ready);
  50 | 
  51 |   const grid = page.locator(".item-grid");
  52 | 
  53 |   await expect(grid).toHaveScreenshot(
  54 |     "store-grid-800.png"
  55 |   );
  56 | });
  57 | 
```