import { test, expect, type Page } from "@playwright/test";
import fs from "node:fs";
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("jianying-sound", "off"));
});
const shotNames = [
  "earth",
  "nature",
  "fashion",
  "speech",
  "city",
  "future",
  "finale",
];
async function go(page: Page, x: number) {
  await page.evaluate((x) => {
    const h =
      (document.querySelector(".film-journey") as HTMLElement).offsetHeight -
      innerHeight;
    window.scrollTo(0, (h * x) / 6.65);
  }, x);
  await page.waitForTimeout(140);
}
for (const mobile of [false, true])
  test(`${mobile ? "mobile" : "desktop"} fullscreen sequence, reversible transitions and footer`, async ({
    page,
  }) => {
    await page.setViewportSize(
      mobile ? { width: 390, height: 844 } : { width: 1440, height: 900 },
    );
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    const requests: string[] = [];
    page.on("request", (r) => {
      if (r.url().includes(".mp4")) requests.push(r.url());
    });
    await page.goto("/");
    await expect(page.locator('video[data-film="earth"]')).toHaveJSProperty(
      "readyState",
      4,
    );
    expect(requests.every((r) => r.includes("/earth"))).toBeTruthy();
    expect(await page.locator("canvas").count()).toBe(0);
    const box = await page.locator(".film-stage").boundingBox();
    expect(box?.width).toBe(mobile ? 390 : 1440);
    expect(box?.height).toBe(mobile ? 844 : 900);
    fs.mkdirSync("docs/qa/revision", { recursive: true });
    await page.screenshot({
      path: `docs/qa/revision/${mobile ? "mobile" : "desktop"}-earth.png`,
    });
    for (const i of [1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1, 0]) {
      await go(page, i + 0.25);
      await expect(page.locator(".film-stage")).toHaveAttribute(
        "data-scene",
        String(i),
      );
      if (i > 0)
        await expect(page.locator(`.copy-${shotNames[i]}`)).toBeVisible();
      const counts = await page.evaluate(() => ({
        copies: [...document.querySelectorAll(".scene-copy")].filter(
          (e) =>
            getComputedStyle(e).visibility === "visible" &&
            +getComputedStyle(e).opacity > 0.01,
        ).length,
        playing: [...document.querySelectorAll("video")].filter(
          (e) => !e.paused,
        ).length,
        sources: document.querySelectorAll("video[src]").length,
        overflow: document.documentElement.scrollWidth > innerWidth,
      }));
      expect(counts.copies).toBe(i === 0 ? 0 : 1);
      expect(counts.playing).toBeLessThanOrEqual(2);
      expect(counts.sources).toBeLessThanOrEqual(2);
      expect(counts.overflow).toBe(false);
      if (i === 3) {
        await expect(
          page.locator(".speech-caption .live-caption"),
        ).toBeVisible();
        await expect(
          page.locator(".speech-caption .exit-caption"),
        ).not.toBeVisible();
      }
      if (i > 0)
        await page.screenshot({
          path: `docs/qa/revision/${mobile ? "mobile" : "desktop"}-${shotNames[i]}.png`,
        });
    }
    for (let i = 0; i < 6; i++) {
      await go(page, i + (i === 0 ? 0.5 : 0.84));
      const active = await page
        .locator(".scene-copy")
        .evaluateAll(
          (es) =>
            es.filter(
              (e) =>
                getComputedStyle(e).visibility === "visible" &&
                +getComputedStyle(e).opacity > 0.01,
            ).length,
        );
      expect(active).toBe(0);
      if (i === 3) {
        await expect(
          page.locator(".speech-caption .live-caption"),
        ).not.toBeVisible();
        await expect(
          page.locator(".speech-caption .exit-caption"),
        ).toBeVisible();
      }
      const first = await page.locator(".film-layer").evaluateAll((es) =>
        es.map((e) => ({
          clip: (e as HTMLElement).style.clipPath,
          transform: (e as HTMLElement).style.transform,
          visibility: (e as HTMLElement).style.visibility,
        })),
      );
      await go(page, i + 1.2);
      await go(page, i + (i === 0 ? 0.5 : 0.84));
      const reverse = await page.locator(".film-layer").evaluateAll((es) =>
        es.map((e) => ({
          clip: (e as HTMLElement).style.clipPath,
          transform: (e as HTMLElement).style.transform,
          visibility: (e as HTMLElement).style.visibility,
        })),
      );
      expect(reverse).toEqual(first);
    }
    await page.locator("footer").scrollIntoViewIfNeeded();
    await page.waitForTimeout(160);
    expect(
      await page
        .locator("footer")
        .evaluate((e) => getComputedStyle(e).position),
    ).toBe("relative");
    await page.screenshot({
      path: `docs/qa/revision/${mobile ? "mobile" : "desktop"}-footer.png`,
    });
    await page.getByRole("button", { name: "素材来源与使用说明" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).not.toBeVisible();
    expect(errors).toEqual([]);
  });
test("speech uses original audio, ducks music, stops when leaving; finale plays", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "开启背景音乐", exact: true }).click();
  await expect(page.locator("audio")).toHaveJSProperty("paused", false);
  await go(page, 3.25);
  await page.getByRole("button", { name: "听人物原声", exact: true }).click();
  await expect(page.locator('[data-film="speech"]')).toHaveJSProperty(
    "muted",
    false,
  );
  await expect(page.locator('[data-film="speech"]')).toHaveJSProperty(
    "paused",
    false,
  );
  await expect(page.locator("audio")).toHaveJSProperty("volume", 0.0144);
  await page.waitForTimeout(700);
  expect(
    await page
      .locator('[data-film="speech"]')
      .evaluate((e) => (e as HTMLVideoElement).currentTime),
  ).toBeGreaterThan(0.1);
  await go(page, 4.25);
  await expect(page.locator('[data-film="speech"]')).toHaveJSProperty(
    "paused",
    true,
  );
  await expect(page.locator("audio")).toHaveJSProperty("volume", 0.12);
  await page.getByRole("button", { name: "关闭背景音乐", exact: true }).click();
  await expect(page.locator("audio")).toHaveJSProperty("paused", true);
  await go(page, 6.25);
  await page.getByRole("button", { name: "观看完整短片" }).click();
  await expect(page.locator('[data-film="finale"]')).toHaveJSProperty(
    "paused",
    false,
  );
});
test("reduced motion and media failure retain usable content", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 360, height: 640 });
  await page.goto("/");
  await expect(page.locator('[data-film="earth"]')).toHaveJSProperty(
    "paused",
    true,
  );
  await go(page, 2.25);
  await expect(
    page.getByRole("heading", { name: "风格， 由你定义。" }),
  ).toBeVisible();
  await page.route("**/future-mobile.mp4", (r) => r.abort());
  await go(page, 5.25);
  await expect(page.locator(".media-status")).toContainText("保留静帧");
  await expect(page.locator(".copy-future")).toBeVisible();
});
