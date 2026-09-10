# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: visual.spec.js >> store page looks correct in dark mode
- Location: tests\visual.spec.js:16:1

# Error details

```
Error: expect(page).toHaveScreenshot(expected) failed

  447736 pixels (ratio 0.24 of all image pixels) are different.

  Snapshot: store-page-dark.png

Call log:
  - Expect "toHaveScreenshot(store-page-dark.png)" with timeout 5000ms
    - verifying given screenshot expectation
  - taking page screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - 447736 pixels (ratio 0.24 of all image pixels) are different.
  - waiting 100ms before taking screenshot
  - taking page screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - captured a stable screenshot
  - 447736 pixels (ratio 0.24 of all image pixels) are different.

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
      - generic [ref=e15]:
        - generic [ref=e16]:
          - article [ref=e17]:
            - generic [ref=e18]: X
            - generic [ref=e20]:
              - heading "Xsolla T-Shirt" [level=3] [ref=e21]
              - paragraph [ref=e22]: Classic cotton tee with Xsolla logo. Unisex fit.
              - generic [ref=e23]:
                - strong [ref=e24]: $25.00
                - button "Add to cart" [ref=e25] [cursor=pointer]
          - article [ref=e26]:
            - generic [ref=e27]: D
            - generic [ref=e29]:
              - heading "Developer Hoodie" [level=3] [ref=e30]
              - paragraph [ref=e31]: Heavyweight pullover hoodie. Perfect for late-night PRs.
              - generic [ref=e32]:
                - strong [ref=e33]: $60.00
                - button "Add to cart" [ref=e34] [cursor=pointer]
          - article [ref=e35]:
            - generic [ref=e36]: S
            - generic [ref=e38]:
              - heading "Sticker Pack" [level=3] [ref=e39]
              - paragraph [ref=e40]: 10-pack of Xsolla and open-source themed stickers.
              - generic [ref=e41]:
                - strong [ref=e42]: $5.00
                - button "Add to cart" [ref=e43] [cursor=pointer]
          - article [ref=e44]:
            - generic [ref=e45]: M
            - generic [ref=e47]:
              - heading "Mechanical Keyboard" [level=3] [ref=e48]
              - paragraph [ref=e49]: Tenkeyless, Cherry MX Brown switches. USB-C.
              - generic [ref=e50]:
                - strong [ref=e51]: $180.00
                - button "Add to cart" [ref=e52] [cursor=pointer]
          - article [ref=e53]:
            - generic [ref=e54]: L
            - generic [ref=e56]:
              - heading "Laptop Stand" [level=3] [ref=e57]
              - paragraph [ref=e58]: Aluminium adjustable stand. Folds flat for travel.
              - generic [ref=e59]:
                - strong [ref=e60]: $45.00
                - button "Add to cart" [ref=e61] [cursor=pointer]
          - article [ref=e62]:
            - generic [ref=e63]: U
            - generic [ref=e65]:
              - heading "USB-C Hub" [level=3] [ref=e66]
              - paragraph [ref=e67]: "7-in-1 hub: HDMI 4K, 3× USB-A, SD, microSD, PD."
              - generic [ref=e68]:
                - strong [ref=e69]: $32.00
                - button "Add to cart" [ref=e70] [cursor=pointer]
          - article [ref=e71]:
            - generic [ref=e72]: "N"
            - generic [ref=e74]:
              - heading "Notebook (A5)" [level=3] [ref=e75]
              - paragraph [ref=e76]: Dot-grid, 200 pages, lay-flat binding.
              - generic [ref=e77]:
                - strong [ref=e78]: $12.00
                - button "Add to cart" [ref=e79] [cursor=pointer]
          - article [ref=e80]:
            - generic [ref=e81]: C
            - generic [ref=e83]:
              - heading "Cable Organiser" [level=3] [ref=e84]
              - paragraph [ref=e85]: Leather magnetic cable ties, pack of 6.
              - generic [ref=e86]:
                - strong [ref=e87]: $8.00
                - button "Add to cart" [ref=e88] [cursor=pointer]
          - article [ref=e89]:
            - generic [ref=e90]: M
            - generic [ref=e92]:
              - heading "Mechanical Keyboard" [level=3] [ref=e93]
              - paragraph [ref=e94]: Compact mechanical keyboard with tactile switches
              - generic [ref=e95]:
                - strong [ref=e96]: $89.00
                - button "Sold out" [disabled] [ref=e97]
        - navigation "Product pages" [ref=e98]:
          - button "Previous" [disabled] [ref=e99]
          - button "1" [ref=e100] [cursor=pointer]
          - button "2" [ref=e101] [cursor=pointer]
          - button "3" [ref=e102] [cursor=pointer]
          - button "4" [ref=e103] [cursor=pointer]
          - button "5" [ref=e104] [cursor=pointer]
          - button "6" [ref=e105] [cursor=pointer]
          - button "7" [ref=e106] [cursor=pointer]
          - button "Next" [ref=e107] [cursor=pointer]
  - contentinfo [ref=e108]:
    - generic [ref=e109]: React Hooks Project
    - button "☀️ Light Mode" [active] [ref=e110] [cursor=pointer]
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
  20 |   await page.locator(".item-card").first().waitFor();
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
> 32 |   await expect(page).toHaveScreenshot(
     |                      ^ Error: expect(page).toHaveScreenshot(expected) failed
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