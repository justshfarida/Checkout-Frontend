import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",

   reporter: [
    ["list"],
    ["html", { open: "never" }],
  ],
  expect: {
    toHaveScreenshot: {
      maxDiffPixels: 100,
      animations: "disabled",
      caret: "hide",
    },
  },

  use: {
    baseURL: process.env.BASE_URL || "http://localhost:3000",
    browserName: "chromium",
  },
});