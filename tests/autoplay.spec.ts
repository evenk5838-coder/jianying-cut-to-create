import { test, expect } from "@playwright/test";
test("blocked autoplay offers one-click music and remembers switch-off", async ({
  page,
}) => {
  await page.addInitScript(() => {
    localStorage.removeItem("jianying-sound");
    const original = HTMLMediaElement.prototype.play;
    let n = 0;
    HTMLMediaElement.prototype.play = function () {
      if (this instanceof HTMLAudioElement && n++ === 0)
        return Promise.reject(
          new DOMException("Autoplay blocked", "NotAllowedError"),
        );
      return original.call(this);
    };
  });
  await page.goto("/");
  await expect(page.getByRole("status")).toContainText("点击声音按钮");
  const off = page.getByRole("button", { name: "开启背景音乐", exact: true });
  await expect(off).toHaveAttribute("aria-pressed", "false");
  await off.click();
  await expect(page.locator("audio")).toHaveJSProperty("paused", false);
  await expect(page.locator("audio")).toHaveJSProperty("volume", 0.12);
  await page.getByRole("button", { name: "关闭背景音乐", exact: true }).click();
  await expect(page.locator("audio")).toHaveJSProperty("paused", true);
  expect(
    await page.evaluate(() => localStorage.getItem("jianying-sound")),
  ).toBe("off");
});
test("missing music leaves film and feature details usable", async ({
  page,
}) => {
  await page.route("**/private-soundtrack.mp3", (r) => r.abort());
  await page.goto("/");
  await page.getByRole("button", { name: "开启背景音乐", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("页面仍可正常浏览");
  await page.getByRole("button", { name: "关闭声音设置" }).click();
  await page.evaluate(() =>
    scrollTo(
      0,
      (((document.querySelector(".film-journey") as HTMLElement).offsetHeight -
        innerHeight) *
        1.25) /
        6.65,
    ),
  );
  await page.locator(".copy-nature .capability-link").click();
  await expect(
    page.getByRole("heading", { name: "关键帧、蒙版与调色", exact: true }),
  ).toBeVisible();
});
