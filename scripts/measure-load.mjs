import { chromium } from "@playwright/test";
import fs from "node:fs";
const browser = await chromium.launch({ channel: "chrome", headless: true });
const results = [];
for (const mobile of [false, true]) {
  const context = await browser.newContext({
      viewport: mobile
        ? { width: 390, height: 844 }
        : { width: 1440, height: 900 },
      isMobile: mobile,
      hasTouch: mobile,
    }),
    page = await context.newPage(),
    cdp = await context.newCDPSession(page);
  await cdp.send("Network.enable");
  await cdp.send("Network.setCacheDisabled", { cacheDisabled: true });
  await cdp.send("Network.emulateNetworkConditions", {
    offline: false,
    latency: 150,
    downloadThroughput: 500000,
    uploadThroughput: 125000,
  });
  await page.addInitScript(() => {
    window.__lcp = 0;
    new PerformanceObserver((l) => {
      window.__lcp = l.getEntries().at(-1).startTime;
    }).observe({ type: "largest-contentful-paint", buffered: true });
    window.__videoReady = 0;
    document.addEventListener(
      "loadeddata",
      (e) => {
        if (e.target.tagName === "VIDEO")
          window.__videoReady = performance.now();
      },
      true,
    );
  });
  await page.goto("http://127.0.0.1:4173/");
  await page.waitForFunction(() => window.__videoReady > 0, { timeout: 30000 });
  await page.waitForTimeout(500);
  const result = await page.evaluate(() => ({
    lcpMs: window.__lcp,
    videoReadyMs: window.__videoReady,
    paint: performance
      .getEntriesByType("paint")
      .map((e) => ({ name: e.name, ms: e.startTime })),
    resources: performance
      .getEntriesByType("resource")
      .map((e) => ({ url: e.name.split("/").pop(), bytes: e.transferSize })),
    sourceCount: document.querySelectorAll("video[src]").length,
  }));
  results.push({ mobile, ...result });
  console.log(
    mobile ? "mobile" : "desktop",
    JSON.stringify({
      lcp: result.lcpMs,
      videoReady: result.videoReadyMs,
      sources: result.sourceCount,
    }),
  );
  await context.close();
}
fs.writeFileSync(
  "docs/qa/revision/load.json",
  JSON.stringify(
    { network: "4 Mbps / 150 ms RTT / cold cache", results },
    null,
    2,
  ),
);
await browser.close();
