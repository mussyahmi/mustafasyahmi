// Checks the static export in out/ against the spec. Run after `npm run build`.
import { existsSync, readFileSync } from "node:fs";

const OUT = "out";
const SITE_URL = "https://mustafasyahmi.web.app";
const WHATSAPP_NUMBER = "60193934247";
const SECTIONS = ["hero", "problems", "services", "work", "process", "about", "faq", "contact"];
const WORK_IMAGES = ["kirapoket", "marisolat", "kadharilahir", "lukislukis"];
const MIN_WHATSAPP_LINKS = 7; // hero, 4 services, contact, sticky bar

const failures = [];
const check = (ok, message) => {
  if (!ok) failures.push(message);
};
const read = (file) => (existsSync(`${OUT}/${file}`) ? readFileSync(`${OUT}/${file}`, "utf8") : "");

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

const waLinks = [...html.matchAll(/href="(https:\/\/wa\.me\/[^"]+)"/g)].map((m) => m[1].replace(/&amp;/g, "&"));
check(
  waLinks.length >= MIN_WHATSAPP_LINKS,
  `expected at least ${MIN_WHATSAPP_LINKS} WhatsApp links, found ${waLinks.length}`,
);
for (const link of waLinks) {
  const url = new URL(link);
  check(url.pathname === `/${WHATSAPP_NUMBER}`, `WhatsApp link to wrong number: ${link}`);
  check((url.searchParams.get("text") ?? "").startsWith("Hi Mustafa"), `WhatsApp link without pre-filled message: ${link}`);
}

check(/<meta name="description" content="[^"]{50,}"/.test(html), "missing or short meta description");
check(/<link rel="canonical" href="https:\/\/mustafasyahmi\.web\.app\/?"/.test(html), "missing canonical link");
check(html.includes(`<meta property="og:image" content="${SITE_URL}/og.png"`), "missing og:image");
check(html.includes(`"@type":"ProfessionalService"`), "missing ProfessionalService JSON-LD");
check(read("sitemap.xml").includes(SITE_URL), "sitemap.xml missing or has no site URL");
check(read("robots.txt").includes("Sitemap:"), "robots.txt missing or has no Sitemap line");

for (const file of ["og.png", "mustafa.webp", ...WORK_IMAGES.map((n) => `work/${n}.webp`)]) {
  check(existsSync(`${OUT}/${file}`), `missing asset ${file}`);
}

if (failures.length) {
  console.error(`FAIL: ${failures.length} problem(s)\n${failures.map((f) => `  - ${f}`).join("\n")}`);
  process.exit(1);
}
console.log(`PASS: ${SECTIONS.length} sections, ${waLinks.length} WhatsApp links, SEO tags and assets present`);
