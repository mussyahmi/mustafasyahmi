// Renders the MS monogram icons into src/app/ (icon.png 512x512, apple-icon.png 180x180).
import { chromium } from "playwright-core";

const ICONS = [
  { file: "src/app/icon.png", size: 512, radius: 112 },
  { file: "src/app/apple-icon.png", size: 180, radius: 0 },
];

const html = (size, radius) => `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@800&display=block" rel="stylesheet" />
    <style>
      * { margin: 0; }
      html, body { width: ${size}px; height: ${size}px; background: transparent; }
      div {
        width: ${size}px;
        height: ${size}px;
        border-radius: ${radius}px;
        background: #9e1b24;
        color: #ffffff;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: "Plus Jakarta Sans", system-ui, sans-serif;
        font-weight: 800;
        font-size: ${Math.round(size * 0.42)}px;
        letter-spacing: -0.04em;
      }
    </style>
  </head>
  <body><div>MS</div></body>
</html>`;

const browser = await chromium.launch({ channel: "chrome" });
try {
  for (const { file, size, radius } of ICONS) {
    const page = await browser.newPage({ viewport: { width: size, height: size } });
    await page.setContent(html(size, radius), { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: file, omitBackground: true });
    await page.close();
    console.log(`wrote ${file} (${size}x${size})`);
  }
} finally {
  await browser.close();
}
