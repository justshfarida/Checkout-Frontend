import process from "node:process";
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",

  use: {
    baseURL: process.env.BASE_URL || "http://localhost:3000",
    screenshot: "only-on-failure",
  },

  expect: {
    toHaveScreenshot: {
      maxDiffPixels: 100,
      animations: "disabled",
      caret: "hide",
    },
  },

  reporter: [
    ["list"],
    ["html", { open: "never" }],
  ],

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});