import { chromium } from "@playwright/test";
import fs from "node:fs";
const browser = await chromium.launch({ channel: "chrome", headless: true });
const results = {
  date: new Date().toISOString(),
  browser: browser.version(),
  conditions:
    "Apple M1 Pro, 16 GB; production preview. Mobile = viewport/touch/4x CPU emulation, not physical hardware.",
  runs: [],
};
for (const cfg of [
  {
    name: "desktop",
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
    cpu: 1,
  },
  {
    name: "mobile-4x-cpu",
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    cpu: 4,
  },
]) {
  const { name, cpu, ...options } = cfg;
  const context = await browser.newContext(options),
    page = await context.newPage();
  const cdp = await context.newCDPSession(page);
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: cpu });
  await page.addInitScript(() => {
    window.__longTasks = [];
    new PerformanceObserver((l) =>
      window.__longTasks.push(
        ...l
          .getEntries()
          .map((x) => ({ start: x.startTime, duration: x.duration })),
      ),
    ).observe({ type: "longtask", buffered: true });
  });
  await page.goto("http://127.0.0.1:4174/");
  await page.waitForFunction(
    () => document.querySelector("video").readyState >= 3,
  );
  const result = await page.evaluate(async () => {
    const initialRequests = performance
      .getEntriesByType("resource")
      .map((r) => ({ url: r.name.split("/").pop(), bytes: r.transferSize }));
    const h =
      document.querySelector(".film-journey").offsetHeight - innerHeight;
    const start = performance.now();
    let last = start,
      maxPlaying = 0,
      maxLoaded = 0,
      maxCopies = 0;
    const dts = [];
    await new Promise((resolve) => {
      function f(now) {
        dts.push(now - last);
        last = now;
        const t = Math.min((now - start) / 14000, 1);
        const p = t < 0.5 ? t * 2 : (1 - t) * 2;
        scrollTo(0, h * p);
        maxPlaying = Math.max(
          maxPlaying,
          [...document.querySelectorAll("video")].filter((v) => !v.paused)
            .length,
        );
        maxLoaded = Math.max(
          maxLoaded,
          document.querySelectorAll("video[src]").length,
        );
        maxCopies = Math.max(
          maxCopies,
          [...document.querySelectorAll(".scene-copy")].filter(
            (e) =>
              getComputedStyle(e).visibility === "visible" &&
              +getComputedStyle(e).opacity > 0.01,
          ).length,
        );
        if (t < 1) requestAnimationFrame(f);
        else requestAnimationFrame(resolve);
      }
      requestAnimationFrame(f);
    });
    const elapsed = performance.now() - start,
      sorted = dts.slice(2).sort((a, b) => a - b);
    return {
      elapsedMs: elapsed,
      rafFps: (dts.length / elapsed) * 1000,
      medianFrameMs: sorted[Math.floor(sorted.length * 0.5)],
      p95FrameMs: sorted[Math.floor(sorted.length * 0.95)],
      over33ms: sorted.filter((x) => x > 33.4).length,
      maxPlaying,
      maxLoaded,
      maxCopies,
      initialRequests,
      longTasks: window.__longTasks,
      canvases: document.querySelectorAll("canvas").length,
      videoQuality: [...document.querySelectorAll("video")].map((v) => ({
        name: v.dataset.film,
        total: v.getVideoPlaybackQuality().totalVideoFrames,
        dropped: v.getVideoPlaybackQuality().droppedVideoFrames,
      })),
    };
  });
  results.runs.push({ name, ...result });
  console.log(
    name,
    JSON.stringify({
      fps: result.rafFps,
      p95: result.p95FrameMs,
      maxPlaying: result.maxPlaying,
      maxLoaded: result.maxLoaded,
      maxCopies: result.maxCopies,
    }),
  );
  await context.close();
}
fs.writeFileSync(
  "docs/qa/feature-preview/performance.json",
  JSON.stringify(results, null, 2),
);
await browser.close();
