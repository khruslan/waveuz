import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  timeout: 30_000,
  use: {
    baseURL: "http://127.0.0.1:3210",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    extraHTTPHeaders: { "Accept-Language": "en-US,en;q=0.9" },
    locale: "en-US"
  },
  webServer: {
    command: "npm run start -- -p 3210",
    url: "http://127.0.0.1:3210",
    reuseExistingServer: false,
    timeout: 120_000
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["iPhone 15"], browserName: "chromium" } }
  ]
});
