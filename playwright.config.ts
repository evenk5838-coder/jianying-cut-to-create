import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests",
  testMatch: ["revision.spec.ts", "autoplay*.spec.ts", "sound.spec.ts"],
  timeout: 45000,
  workers: 1,
  use: {
    baseURL: "http://127.0.0.1:4174",
    browserName: "chromium",
    channel: "chrome",
    headless: true,
  },
  reporter: "list",
});
