import { test, expect } from "@playwright/test";
import { testAudio } from "./audio-fixture";

test("blocked audio never claims to be playing", async ({ page }) => {
  await page.addInitScript(() => {
    const original = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function () {
      if (this instanceof HTMLAudioElement)
        return Promise.reject(
          new DOMException("Policy test", "NotAllowedError"),
        );
      return original.call(this);
    };
  });
  await page.goto("/");
  await page.getByRole("button", { name: "开启背景音乐", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("点击声音按钮");
  await expect(
    page.getByRole("button", { name: "开启背景音乐", exact: true }),
  ).toHaveAttribute("aria-pressed", "false");
  expect(
    await page.locator("audio").evaluate((a) => (a as HTMLAudioElement).paused),
  ).toBe(true);
});

test("cancel buffering prevents delayed sound", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("jianying-sound", "off"));
  let release: (() => void) | undefined;
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route("**/private-soundtrack.mp3", async (route) => {
    await gate;
    await route
      .fulfill({ contentType: "audio/wav", body: testAudio() })
      .catch(() => {});
  });
  await page.goto("/");
  await page.getByRole("button", { name: "开启背景音乐", exact: true }).click();
  await page.getByRole("button", { name: "取消音乐加载", exact: true }).click();
  release!();
  await expect(
    page.getByRole("button", { name: "开启背景音乐", exact: true }),
  ).toHaveAttribute("aria-pressed", "false");
  // Allow the intercepted bytes to arrive; playback must remain cancelled.
  await page.waitForTimeout(300);
  expect(
    await page.locator("audio").evaluate((a) => ({
      paused: (a as HTMLAudioElement).paused,
      time: (a as HTMLAudioElement).currentTime,
    })),
  ).toEqual({ paused: true, time: 0 });
});
