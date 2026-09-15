// Captures a 390x844 phone viewport (2x) of each live app into public/work/.
// Uses installed Google Chrome with real mobile emulation so pages lay out at phone width.
import { execFileSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import { chromium } from "playwright-core";

const VIEWPORT_WIDTH = 390;
const TMP_DIR = ".qa/work";
const APPS = [
  ["kirapoket", "https://kirapoket.web.app"],
  ["marisolat", "https://marisolat.web.app"],
  ["kadharilahir", "https://kadharilahir.web.app"],
  ["lukislukis", "https://lukislukis.web.app"],
];

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
  for (const [name, url] of APPS) {
    const page = await context.newPage();
    await page.goto(url, { waitUntil: "load", timeout: 30000 });
    await page.waitForTimeout(6000);
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
