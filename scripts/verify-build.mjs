// Checks the static export in out/ against the spec. Run after `npm run build`.
import { existsSync, readFileSync, statSync } from "node:fs";

const OUT = "out";
const SITE_URL = "https://mustafasyahmi.web.app";
const WHATSAPP_NUMBER = "60193934247";
const SECTIONS = ["hero", "problems", "services", "work", "process", "about", "faq", "contact"];
const WORK_IMAGES = ["kirapoket", "marisolat", "kadharilahir", "lukislukis"];
const MAX_OG_BYTES = 300000;
const DEFAULT_MESSAGE = "Hi Mustafa, I saw your website and would like to discuss a project.";
const EXPECTED_WHATSAPP_MESSAGES = [
  DEFAULT_MESSAGE, // hero
  "Hi Mustafa, I'm interested in a business website.",
  "Hi Mustafa, I'm interested in an online store or ordering system.",
  "Hi Mustafa, I'd like to discuss a custom system for my business.",
  "Hi Mustafa, I'm interested in a monthly care plan.",
  DEFAULT_MESSAGE, // contact
  DEFAULT_MESSAGE, // sticky bar
];

const failures = [];
const check = (ok, message) => {
  if (!ok) failures.push(message);
};
const read = (file) => (existsSync(`${OUT}/${file}`) ? readFileSync(`${OUT}/${file}`, "utf8") : "");

// Decodes the small set of HTML entities React emits in href attributes.
const decodeEntities = (value) =>
  value
    .replace(/&amp;/g, "&")
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"');

const html = read("index.html");
if (!html) {
  console.error(`FAIL: ${OUT}/index.html not found. Run npm run build first.`);
  process.exit(1);
}

const visibleText = html
  .replace(/<script[\s\S]*?<\/script>/gi, " ")
  .replace(/<style[\s\S]*?<\/style>/gi, " ")
  .replace(/<[^>]+>/g, " ");

for (const id of SECTIONS) check(html.includes(`id="${id}"`), `missing section #${id}`);

const dash = visibleText.match(/[‒-―]|&mdash;|&ndash;|&#821[12];|\s-\s/);
check(
  !dash,
  `dash punctuation in visible copy near: "${
    dash ? visibleText.slice(Math.max(0, dash.index - 40), dash.index + 40).replace(/\s+/g, " ") : ""
  }"`,
);
check(!/getlokal/i.test(visibleText), "visible copy mentions GetLokal");

const waLinks = [...html.matchAll(/href="(https:\/\/wa\.me\/[^"]+)"/g)].map((m) => decodeEntities(m[1]));
check(
  waLinks.length === EXPECTED_WHATSAPP_MESSAGES.length,
  `expected exactly ${EXPECTED_WHATSAPP_MESSAGES.length} WhatsApp links, found ${waLinks.length}`,
);
for (const link of waLinks) {
  const url = new URL(link);
  check(url.pathname === `/${WHATSAPP_NUMBER}`, `WhatsApp link to wrong number: ${link}`);
}

const actualMessages = waLinks.map((link) => new URL(link).searchParams.get("text") ?? "");
for (let i = 0; i < Math.max(actualMessages.length, EXPECTED_WHATSAPP_MESSAGES.length); i += 1) {
  const expected = EXPECTED_WHATSAPP_MESSAGES[i];
  const actual = actualMessages[i];
  check(
    expected !== undefined && actual === expected,
    `WhatsApp link #${i + 1} message mismatch\n    expected: ${JSON.stringify(expected)}\n    actual:   ${JSON.stringify(actual)}`,
  );
}

check(/<meta name="description" content="[^"]{50,}"/.test(html), "missing or short meta description");
check(/<link rel="canonical" href="https:\/\/mustafasyahmi\.web\.app\/?"/.test(html), "missing canonical link");
check(html.includes(`<meta property="og:image" content="${SITE_URL}/og.jpg"`), "missing og:image");
check(html.includes(`"@type":"ProfessionalService"`), "missing ProfessionalService JSON-LD");
check(read("sitemap.xml").includes(SITE_URL), "sitemap.xml missing or has no site URL");
check(read("robots.txt").includes("Sitemap:"), "robots.txt missing or has no Sitemap line");
check(/<link rel="icon"[^>]*>/.test(html), "missing <link rel=\"icon\"> tag");
check(/<link rel="apple-touch-icon"[^>]*>/.test(html), "missing <link rel=\"apple-touch-icon\"> tag");

for (const file of ["og.jpg", "mustafa.webp", "icon.png", "apple-icon.png", ...WORK_IMAGES.map((n) => `work/${n}.webp`)]) {
  check(existsSync(`${OUT}/${file}`), `missing asset ${file}`);
}

if (existsSync(`${OUT}/og.jpg`)) {
  const ogBytes = statSync(`${OUT}/og.jpg`).size;
  check(ogBytes < MAX_OG_BYTES, `out/og.jpg is ${ogBytes} bytes, expected under ${MAX_OG_BYTES}`);
}

if (failures.length) {
  console.error(`FAIL: ${failures.length} problem(s)\n${failures.map((f) => `  - ${f}`).join("\n")}`);
  process.exit(1);
}
console.log(`PASS: ${SECTIONS.length} sections, ${waLinks.length} WhatsApp links, SEO tags and assets present`);
