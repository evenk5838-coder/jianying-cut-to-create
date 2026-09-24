import { test, expect } from "@playwright/test";
test.use({
  launchOptions: { args: ["--autoplay-policy=no-user-gesture-required"] },
});
test("starts on entry, silent exploration stops it, preference survives reload", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator("audio")).toHaveJSProperty("paused", false);
  await expect(
    page.getByRole("button", { name: "关闭背景音乐", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "静音探索", exact: true }).click();
  await expect(page.locator("audio")).toHaveJSProperty("paused", true);
  await page.reload();
  await page.waitForTimeout(350);
  await expect(page.locator("audio")).toHaveJSProperty("paused", true);
});
