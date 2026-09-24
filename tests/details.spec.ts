import { test, expect } from "@playwright/test";
import fs from "node:fs";
const features = [
  ["nature", "关键帧、蒙版与调色"],
  ["fashion", "智能抠像"],
  ["speech", "智能剪口播"],
  ["city", "智能搜索素材与多时间线"],
  ["future", "视频生成"],
];
for (const mobile of [false, true])
  test(`${mobile ? "mobile" : "desktop"} feature entries show only matching content and return in place`, async ({
    page,
  }) => {
    await page.setViewportSize(
      mobile ? { width: 390, height: 844 } : { width: 1440, height: 900 },
    );
    await page.addInitScript(() =>
      localStorage.setItem("jianying-sound", "off"),
    );
    await page.goto("/");
    fs.mkdirSync("docs/qa/public-release", { recursive: true });
    for (const [index, [id, title]] of features.entries()) {
      await page.evaluate((x) => {
        const h =
          (document.querySelector(".film-journey") as HTMLElement)
            .offsetHeight - innerHeight;
        scrollTo(0, (h * x) / 6.65);
      }, index + 1.25);
      const entry = page.locator(`.copy-${id} .capability-link`);
      await expect(entry).toBeVisible();
      const before = await page.evaluate(() => scrollY);
      await entry.click();
      const dialog = page.getByRole("dialog");
      await expect(
        dialog.getByRole("heading", { name: title, exact: true }),
      ).toBeVisible();
      await expect(
        dialog.getByRole("heading", { name: "适合怎样的创作" }),
      ).toBeVisible();
      await expect(dialog.locator(".feature-sheet")).toHaveAttribute(
        "data-feature",
        id,
      );
      expect(await dialog.locator("img").getAttribute("src")).toContain(
        `${id}-poster.webp`,
      );
      await expect
        .poll(() =>
          dialog
            .locator("img")
            .evaluate((e) => (e as HTMLImageElement).naturalWidth),
        )
        .toBeGreaterThan(0);
      for (const [other, otherTitle] of features)
        if (other !== id)
          await expect(
            dialog.getByRole("heading", { name: otherTitle, exact: true }),
          ).toHaveCount(0);
      expect(await dialog.innerText()).not.toMatch(
        /非剪映|未经过剪映|素材仅用于演示|未演示/,
      );
      expect(
        await page
          .locator("video")
          .evaluateAll(
            (v) => v.filter((e) => !(e as HTMLVideoElement).paused).length,
          ),
      ).toBe(0);
      expect(await dialog.evaluate((e) => e.scrollWidth > e.clientWidth)).toBe(
        false,
      );
      await page.screenshot({
        path: `docs/qa/public-release/${mobile ? "mobile" : "desktop"}-${id}-detail.png`,
      });
      if (index % 2 === 0)
        await dialog
          .getByRole("button", { name: "返回原板块", exact: true })
          .click();
      else await page.keyboard.press("Escape");
      await expect(dialog).not.toBeVisible();
      await expect(entry).toBeFocused();
      expect(
        Math.abs((await page.evaluate(() => scrollY)) - before),
      ).toBeLessThanOrEqual(1);
    }
    await expect(page.locator(".scene-copy")).not.toContainText(["非剪映生成"]);
    await expect(page.locator(".site-disclosure")).toContainText(
      "未来城市也不是剪映生成",
    );
  });
