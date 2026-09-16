// Captures a 390x844 phone viewport (2x) of each live app into public/work/.
// Uses installed Google Chrome with real mobile emulation so pages lay out at phone width.
import { execFileSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import { chromium } from "playwright-core";

const VIEWPORT_WIDTH = 390;
const TMP_DIR = ".qa/work";
// Each entry: [name, url, settleMs (optional, defaults to 6000), scrollOffset (optional, defaults to 0)]
// settleMs: extra wait before the screenshot, for apps with an animated element (e.g. a countdown)
// that needs to land on a stable, non-transitioning frame.
// scrollOffset: vertical scroll (px) applied via window.scrollTo(0, offset) before the screenshot,
// for apps where content is cut off by the viewport edge.
const APPS = [
  ["kirapoket", "https://kirapoket.web.app"],
  ["marisolat", "https://marisolat.web.app", 11500],
  ["kadharilahir", "https://kadharilahir.web.app"],
  ["lukislukis", "https://lukislukis.web.app"],
];

const requested = process.argv.slice(2);
const appsToCapture = requested.length
  ? APPS.filter(([name]) => requested.includes(name))
  : APPS;

mkdirSync(TMP_DIR, { recursive: true });
mkdirSync("public/work", { recursive: true });

const browser = await chromium.launch({ channel: "chrome" });
const context = await browser.newContext({
  viewport: { width: VIEWPORT_WIDTH, height: 844 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
  userAgent:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1",
  // Kuala Lumpur, so apps that detect the visitor's prayer zone show real content
  geolocation: { latitude: 3.139, longitude: 101.6869 },
  permissions: ["geolocation"],
});

try {
  for (const [name, url, settleMs = 6000, scrollOffset = 0] of appsToCapture) {
    const page = await context.newPage();
    await page.goto(url, { waitUntil: "load", timeout: 30000 });
    await page.waitForTimeout(settleMs);
    if (scrollOffset) await page.evaluate((offset) => window.scrollTo(0, offset), scrollOffset);
    const layoutWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const png = `${TMP_DIR}/${name}.png`;
    await page.screenshot({ path: png });
    execFileSync("cwebp", ["-quiet", "-q", "82", "-resize", "780", "0", png, "-o", `public/work/${name}.webp`]);
    await page.close();
    console.log(`captured ${name} (layout width ${layoutWidth}px)`);
    if (layoutWidth > VIEWPORT_WIDTH) console.warn(`  warning: ${name} is wider than the ${VIEWPORT_WIDTH}px viewport`);
  }
} finally {
  await browser.close();
}
