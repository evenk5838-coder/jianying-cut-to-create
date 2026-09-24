import { test, expect } from "@playwright/test";
import { clockProgress } from "../src/lib/sequence";
import { testAudio } from "./audio-fixture";
import fs from "node:fs";
const features = [
  ["city", "专业剪辑"],
  ["speech", "智能剪口播"],
  ["fashion", "人像美化与智能抠像"],
  ["nature", "调色与画质增强"],
  ["future", "AI 视频生成"],
];
async function go(page: any, x: number, mobile = false) {
  const p = clockProgress(x, mobile);
  await page.evaluate(
    (f: number) =>
      scrollTo(
        0,
        (document.querySelector(".film-journey")!.getBoundingClientRect()
          .height -
          innerHeight) *
          f,
      ),
    p,
  );
  await page.waitForTimeout(130);
}
for (const mobile of [false, true]) {
  test(`${mobile ? "mobile" : "desktop"} feature sequence, progressive copy, matching details and return`, async ({
    page,
  }) => {
    await page.setViewportSize(
      mobile ? { width: 390, height: 844 } : { width: 1440, height: 900 },
    );
    await page.addInitScript(() =>
      localStorage.setItem("jianying-sound", "off"),
    );
    await page.goto("/");
    fs.mkdirSync("docs/qa/feature-preview", { recursive: true });
    await expect(page.locator(".copy-earth h1")).toHaveText(
      "世界很大，装得下你的想象。",
    );
    await expect(page.locator('[data-film="earth"]')).toHaveAttribute(
      "src",
      /earth/,
    );
    for (const [i, [id, title]] of features.entries()) {
      await go(page, i + 1.14, mobile);
      await expect(page.locator(`.copy-${id} h2`)).toHaveText(title);
      expect(
        await page
          .locator(`.copy-${id} .scene-description`)
          .evaluate((e) => +getComputedStyle(e).opacity),
      ).toBeLessThan(0.05);
      await go(page, i + 1.52, mobile);
      const entry = page.locator(`.copy-${id} .capability-link`);
      await expect(entry).toBeVisible();
      const before = await page.evaluate(() => scrollY);
      await page.screenshot({
        path: `docs/qa/feature-preview/${mobile ? "mobile" : "desktop"}-${id}.png`,
      });
      await entry.click();
      await expect(page.locator("#detail-title")).toHaveText(title);
      await page
        .getByRole("button", { name: "返回原板块", exact: true })
        .click();
      await expect(entry).toBeFocused();
      expect(
        Math.abs((await page.evaluate(() => scrollY)) - before),
      ).toBeLessThan(2);
    }
    await go(page, 6.3, mobile);
    expect(
      await page.locator('[data-film="finale"]').getAttribute("src"),
    ).toMatch(/finale/);
    await expect(page.locator(".copy-finale")).not.toContainText("候选");
    await expect(page.locator(".copy-finale")).not.toContainText("等待素材确认");
    await go(page, 6.52, mobile);
    const finale = page.locator('[data-film="finale"]');
    await page.waitForFunction(() => {
      const v = document.querySelector('[data-film="finale"]') as HTMLVideoElement;
      return v.readyState >= 3 && !v.paused && v.currentTime > 0;
    });
    await finale.evaluate((v: any) => (v.currentTime = v.duration - 0.3));
    await expect.poll(() => finale.evaluate((v: any) => v.currentTime), {timeout: 10000}).toBeLessThan(2);
    expect(await finale.evaluate((v: any) => v.paused)).toBe(false);
    await expect(page.locator('a[href*="candidates"]')).toHaveCount(0);
    await page.screenshot({path: `docs/qa/feature-preview/${mobile ? "mobile" : "desktop"}-finale.png`});
    await go(page, 2.52, mobile);
    await expect(page.locator(".copy-speech h2")).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
    ).toBe(false);
  });
  test(`${mobile ? "mobile" : "desktop"} visible videos continue through scroll, boundaries, loops and reverse`, async ({
    page,
  }) => {
    test.setTimeout(70000);
    await page.setViewportSize(
      mobile ? { width: 390, height: 844 } : { width: 1440, height: 900 },
    );
    await page.addInitScript(() =>
      localStorage.setItem("jianying-sound", "off"),
    );
    await page.goto("/");
    for (const [i, [id]] of features.entries()) {
      await go(page, i + 1.5, mobile);
      await page.waitForFunction((id) => {
        const v = document.querySelector(
          `[data-film="${id}"]`,
        ) as HTMLVideoElement;
        return v.readyState >= 3 && !v.paused;
      }, id);
      const video = page.locator(`[data-film="${id}"]`);
      await video.evaluate((v: any) => (v.currentTime = v.duration - 0.4));
      await page.waitForTimeout(800);
      expect(await video.evaluate((v: any) => v.currentTime)).toBeLessThan(2);
      expect(await video.evaluate((v: any) => v.paused)).toBe(false);
    }
    for (const x of [1.9, 2.9, 3.9, 4.9, 3.9, 2.9, 1.9]) {
      await go(page, x, mobile);
      const from = Math.floor(x);
      await page.waitForFunction(
        (ids) =>
          ids.every((id) => {
            const v = document.querySelector(
              `[data-film="${id}"]`,
            ) as HTMLVideoElement;
            return v.readyState >= 3 && !v.paused;
          }),
        [features[from - 1][0], features[from][0]],
      );
      const times = await page
        .locator("video")
        .evaluateAll((v) => v.map((e: any) => e.currentTime));
      await go(page, x + 0.012, mobile);
      await page.waitForTimeout(330);
      const state = await page
        .locator("video")
        .evaluateAll((v) =>
          v.map((e: any) => ({ time: e.currentTime, paused: e.paused })),
        );
      expect(state[from].time).not.toBe(times[from]);
      expect(state[from + 1].time).not.toBe(times[from + 1]);
      expect(state.filter((v) => !v.paused).length).toBeLessThanOrEqual(2);
    }
  });
}
// A pointer click avoids Chromium's scrollIntoView moving the tall sticky journey during rapid label changes.
async function clickSound(page: any, name: string) {
  const button = page.getByRole("button", { name, exact: true });
  await expect(button).toBeVisible();
  const r = await button.boundingBox();
  await page.mouse.click(r!.x + r!.width / 2, r!.y + r!.height / 2);
}
test("speech sound toggles in place, background music ducks and restores without changing user choice", async ({
  page,
}) => {
  await page.route("**/private-soundtrack.mp3", (r) =>
    r.fulfill({ status: 200, contentType: "audio/wav", body: testAudio() }),
  );
  await page.addInitScript(() => localStorage.setItem("jianying-sound", "off"));
  await page.goto("/");
  await go(page, 2.52);
  const video = page.locator('[data-film="speech"]');
  await page.waitForFunction(() => {
    const v = document.querySelector(
      '[data-film="speech"]',
    ) as HTMLVideoElement;
    return !v.paused && v.currentTime > 1;
  });
  expect(await video.evaluate((v: any) => v.muted)).toBe(true);
  await clickSound(page, "开启背景音乐");
  await expect(
    page.getByRole("button", { name: "关闭背景音乐", exact: true }),
  ).toBeVisible();
  const t = await video.evaluate((v: any) => v.currentTime);
  await clickSound(page, "听人物原声");
  expect(
    await video.evaluate((v: any) => v.currentTime),
  ).toBeGreaterThanOrEqual(t);
  expect(await video.evaluate((v: any) => v.muted)).toBe(false);
  await expect
    .poll(() => page.locator("audio").evaluate((a: any) => a.volume))
    .toBeCloseTo(0.0144, 4);
  await clickSound(page, "关闭人物原声");
  expect(await video.evaluate((v: any) => v.paused)).toBe(false);
  await expect
    .poll(() => page.locator("audio").evaluate((a: any) => a.volume))
    .toBeCloseTo(0.12, 4);
  await clickSound(page, "关闭背景音乐");
  await clickSound(page, "听人物原声");
  await clickSound(page, "关闭人物原声");
  expect(await page.locator("audio").evaluate((a: any) => a.paused)).toBe(true);
});
test("reduced motion, same-source grading and normal-flow footer", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(() => localStorage.setItem("jianying-sound", "off"));
  await page.goto("/");
  await go(page, 4.52);
  expect(
    await page
      .locator("video")
      .evaluateAll((v) => v.every((e: any) => e.paused)),
  ).toBe(true);
  const src = await page.locator('[data-film="nature"]').getAttribute("src");
  await page.getByRole("button", { name: "查看色彩预览" }).click();
  await expect(page.locator(".film-nature .film-picture")).toHaveClass(
    /is-graded/,
  );
  expect(await page.locator('[data-film="nature"]').getAttribute("src")).toBe(
    src,
  );
  await page.locator("#about").scrollIntoViewIfNeeded();
  expect(
    await page.locator("#about").evaluate((e) => getComputedStyle(e).position),
  ).toBe("relative");
  await expect(
    page.getByRole("button", { name: "素材来源与使用说明" }),
  ).toBeVisible();
});
test("small phone, transition copy exclusion, media failure and lazy opening", async ({
  page,
}) => {
  await page.setViewportSize({ width: 360, height: 640 });
  await page.addInitScript(() => localStorage.setItem("jianying-sound", "off"));
  const requests: string[] = [];
  page.on("request", (r) => {
    if (r.url().includes(".mp4")) requests.push(r.url());
  });
  await page.goto("/");
  await page.waitForTimeout(400);
  expect(requests.every((x) => x.includes("earth-mobile"))).toBe(true);
  expect(
    await page
      .locator(".film-stage")
      .evaluate((e) => e.getBoundingClientRect().height),
  ).toBe(640);
  for (const x of [1.52, 2.52, 3.52, 4.52, 5.52, 4.9, 3.9, 2.9, 1.9, 0.8]) {
    await go(page, x, true);
    const readable = await page
      .locator(".scene-copy")
      .evaluateAll(
        (es) =>
          es.filter(
            (e) =>
              +getComputedStyle(e).opacity > 0.01 &&
              getComputedStyle(e).visibility === "visible",
          ).length,
      );
    expect(readable).toBeLessThanOrEqual(1);
    if (x % 1 > 0.5 && x % 1 < 0.6) {
      const box = await page
        .locator(".scene-copy")
        .nth(Math.floor(x))
        .boundingBox();
      expect(box!.y).toBeGreaterThan(95);
      expect(box!.y + box!.height).toBeLessThan(565);
    }
  }
  await page.screenshot({
    path: "docs/qa/feature-preview/mobile-small-transition.png",
  });
  await page.route("**/nature-mobile.mp4", (r) => r.abort());
  await page.reload();
  await go(page, 4.52, true);
  await expect(page.locator(".copy-nature h2")).toBeVisible();
  expect(
    await page
      .locator(".film-nature .film-picture")
      .evaluate((e) => getComputedStyle(e).backgroundImage),
  ).toContain("nature-poster");
});
test("candidate review has horizontal playable media, correct audio disclosures and one active clip", async ({
  page,
}) => {
  await page.goto("/candidates.html");
  await expect(page.locator("#portrait-list article")).toHaveCount(2);
  await expect(page.locator("#speech-list article")).toHaveCount(2);
  expect(
    await page
      .locator("video")
      .evaluateAll((v) => v.every((e) => e.preload === "none" && e.paused)),
  ).toBe(true);
  await page.locator("#portrait-list video").first().scrollIntoViewIfNeeded();
  await page.locator("#portrait-list video").first().evaluate((v: any) => v.play());
  await page.waitForFunction(() => {
    const v = document.querySelector(
      "#portrait-list video",
    ) as HTMLVideoElement;
    return v.currentTime > 0.25;
  });
  await page.locator("#future-list video").scrollIntoViewIfNeeded();
  await page.locator("#future-list video").evaluate((v: any) => v.play());
  expect(
    await page.locator("#portrait-list video").first().evaluate((v: any) => v.paused),
  ).toBe(true);
  await page.locator("#montage > video").scrollIntoViewIfNeeded();
  await page.locator("#montage > video").evaluate((v: any) => v.play());
  await page.waitForFunction(() => {
    const v = document.querySelector("#montage > video") as HTMLVideoElement;
    return v.readyState >= 3;
  });
  expect(
    await page
      .locator("video")
      .evaluateAll((v) => v.filter((e) => !e.paused).length),
  ).toBe(1);
  expect(
    await page
      .locator("#montage > video")
      .evaluate((v: any) => v.videoWidth / v.videoHeight),
  ).toBeCloseTo(16 / 9, 3);
  await page.screenshot({
    path: "docs/qa/feature-preview/candidates-montage-desktop.png",
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/candidates.html#speech");
  await page.screenshot({
    path: "docs/qa/feature-preview/candidates-mobile.png",
  });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
  ).toBe(false);
  await expect(page.locator("#speech")).toContainText("没有音轨");
});
