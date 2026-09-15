# mustafasyahmi.web.app Portfolio Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and deploy a one-page freelance site that turns Malaysian SME owners into WhatsApp conversations about paid projects.

**Architecture:** Next.js 16 App Router exported as static HTML (`output: 'export'`) and served from Firebase Hosting. All copy lives in `src/content.ts`; section components only render it. Correctness is enforced by Vitest unit tests on the content and link helper, plus a post-build script (`scripts/verify-build.mjs`) that inspects the exported HTML.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS 4, shadcn (Button only), lucide-react, Vitest, Firebase Hosting, headless Chrome + `cwebp` + `sips` for images.

**Spec:** `docs/superpowers/specs/2026-09-15-portfolio-site-design.md`

## Global Constraints

- Project root: `/Users/mustafasyahmi/development/mustafasyahmi`. All relative paths below are from this root.
- Node `v20.19.6` (already installed via nvm). Use `npm`, not pnpm or yarn.
- Static export only: no server, no API routes, no Firebase SDK, no `frameworksBackend`.
- Light theme only. English only.
- Visible copy must contain **no dash punctuation**: no em dash, no en dash, no spaced hyphen (` - `).
- Never mention GetLokal. Never claim "13 apps".
- WhatsApp number: `60193934247`. Email: `mussyahmi31@gmail.com`. GitHub: `https://github.com/mussyahmi`.
- Site URL: `https://mustafasyahmi.web.app`.
- Prices: Business website from RM2,500; Online store or ordering system from RM8,000; Custom web app or system from RM15,000; Monthly care plan from RM300/month.
- Palette: accent `#9e1b24`, background `#faf6f0`, text `#1a1714`, WhatsApp green `#25d366` with dark text `#0b2e17`.
- Fonts: Plus Jakarta Sans (headings), Inter (body), via `next/font/google`.
- Chrome binary: `"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"`.
- Commit messages use conventional prefixes (`feat:`, `chore:`, `docs:`) and end with a blank line then `Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>`.
- **Stop and ask Mustafa before:** creating the Firebase project, the first deploy, and pushing to GitHub.

## File Map

| File | Responsibility |
|---|---|
| `next.config.ts` | Static export config |
| `vitest.config.ts` | Test runner with `@/` alias |
| `firebase.json`, `.firebaserc` | Hosting config pointing at `out/` |
| `src/app/globals.css` | Tailwind import, design tokens, base styles |
| `src/app/layout.tsx` | Fonts, metadata, Open Graph, JSON-LD |
| `src/app/page.tsx` | Composes sections in order |
| `src/app/sitemap.ts`, `src/app/robots.ts` | SEO files |
| `src/content.ts` | Every piece of visible copy, prices, work items, FAQ, contact details |
| `src/content.test.ts` | Enforces copy rules and approved prices |
| `src/lib/whatsapp.ts` (+ test) | `whatsappLink(message, number?)` |
| `src/components/Container.tsx` | Page width and side gutters |
| `src/components/SectionHeading.tsx` | Eyebrow, heading, intro for each section |
| `src/components/WhatsAppButton.tsx` | Green pre-filled WhatsApp link button |
| `src/components/StickyWhatsApp.tsx` | Mobile-only pinned WhatsApp bar |
| `src/components/PhoneFrame.tsx` | Screenshot inside a phone outline |
| `src/components/JsonLd.tsx` | `ProfessionalService` structured data |
| `src/components/sections/*.tsx` | Hero, Problems, Services, Work, Process, About, Faq, Contact, Footer |
| `scripts/capture-work.sh` | Screenshots of the four live apps |
| `scripts/og.html`, `scripts/make-og.sh` | Builds the 1200×630 share image |
| `scripts/verify-build.mjs` | Checks the exported HTML against the spec |

---

### Task 1: Scaffold the project with static export

**Files:**
- Create: Next.js scaffold, `next.config.ts` (overwrite), `vitest.config.ts`, `firebase.json`, `.firebaserc`, `src/app/globals.css` (overwrite), `src/app/layout.tsx` (overwrite), `src/app/page.tsx` (overwrite)
- Modify: `.gitignore`, `package.json` scripts

**Interfaces:**
- Consumes: nothing
- Produces: `cn()` from `@/lib/utils`; `buttonVariants` from `@/components/ui/button`; Tailwind colour utilities `bg-background text-foreground bg-card text-muted-foreground bg-primary text-primary text-primary-foreground bg-accent text-accent-foreground border-border bg-whatsapp text-whatsapp-foreground`; font utilities `font-sans` and `font-heading`; npm scripts `test` and `verify`.

- [ ] **Step 1: Generate the Next.js app into the existing folder**

The folder already contains `.git` and `docs/`, which `create-next-app` accepts.

```bash
cd /Users/mustafasyahmi/development/mustafasyahmi
npx create-next-app@16 . --ts --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm --disable-git --yes
```

Expected: ends with `Success! Created mustafasyahmi`. If it refuses because of conflicting files, run it in `../mustafasyahmi-scaffold` instead, then `rsync -a --exclude .git ../mustafasyahmi-scaffold/ ./ && rm -rf ../mustafasyahmi-scaffold && npm install`.

- [ ] **Step 2: Add shadcn Button and Vitest**

```bash
npx shadcn@latest init -d
npx shadcn@latest add button -y
npm install -D vitest
```

Expected: `src/lib/utils.ts` and `src/components/ui/button.tsx` exist. `grep -n "buttonVariants" src/components/ui/button.tsx` prints an export line.

- [ ] **Step 3: Configure static export**

Overwrite `next.config.ts`:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
};

export default nextConfig;
```

- [ ] **Step 4: Configure Vitest**

Create `vitest.config.ts`:

```ts
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  test: {
    include: ["src/**/*.test.ts"],
  },
});
```

```bash
npm pkg set scripts.test="vitest run" scripts.verify="node scripts/verify-build.mjs"
```

- [ ] **Step 5: Configure Firebase Hosting**

Create `firebase.json`:

```json
{
  "hosting": {
    "public": "out",
    "cleanUrls": true,
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "headers": [
      {
        "source": "/_next/static/**",
        "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }]
      },
      {
        "source": "**/*.@(webp|png|jpg|svg|ico)",
        "headers": [{ "key": "Cache-Control", "value": "public, max-age=86400" }]
      }
    ]
  }
}
```

Create `.firebaserc`:

```json
{
  "projects": {
    "default": "mustafasyahmi"
  }
}
```

Append to `.gitignore`:

```
# firebase and QA output
.firebase/
.qa/
```

- [ ] **Step 6: Replace the design tokens**

Overwrite `src/app/globals.css`:

```css
@import "tailwindcss";
@import "tw-animate-css";

:root {
  --radius: 0.75rem;
  --background: #faf6f0;
  --foreground: #1a1714;
  --card: #fffdf9;
  --card-foreground: #1a1714;
  --popover: #fffdf9;
  --popover-foreground: #1a1714;
  --primary: #9e1b24;
  --primary-foreground: #ffffff;
  --secondary: #f1e9df;
  --secondary-foreground: #1a1714;
  --muted: #f1e9df;
  --muted-foreground: #5f564d;
  --accent: #f6e3e1;
  --accent-foreground: #7a141b;
  --destructive: #b42318;
  --border: #e6dccf;
  --input: #e6dccf;
  --ring: #9e1b24;
  --whatsapp: #25d366;
  --whatsapp-foreground: #0b2e17;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-whatsapp: var(--whatsapp);
  --color-whatsapp-foreground: var(--whatsapp-foreground);
  --font-sans: var(--font-inter), ui-sans-serif, system-ui, sans-serif;
  --font-heading: var(--font-jakarta), ui-sans-serif, system-ui, sans-serif;
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  html {
    scroll-behavior: smooth;
  }
  body {
    @apply bg-background text-foreground;
  }
  h1,
  h2,
  h3 {
    font-family: var(--font-heading);
    letter-spacing: -0.02em;
    text-wrap: balance;
  }
  section[id] {
    scroll-margin-top: 1.5rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
}
```

- [ ] **Step 7: Minimal layout and page**

Overwrite `src/app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
  weight: ["600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Mustafa Syahmi",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jakarta.variable}`}>
      <body className="bg-background font-sans text-foreground antialiased">{children}</body>
    </html>
  );
}
```

Overwrite `src/app/page.tsx`:

```tsx
export default function Home() {
  return (
    <main>
      <h1 className="p-8 text-4xl font-extrabold text-primary">Mustafa Syahmi</h1>
    </main>
  );
}
```

Delete unused scaffold assets: `rm -f public/*.svg`.

- [ ] **Step 8: Verify the export builds**

```bash
npm run build && ls out/index.html
```

Expected: build succeeds with no type errors and prints `out/index.html`.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "chore: scaffold Next.js static site with Tailwind tokens and Firebase config" -m "Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 2: Content and WhatsApp link helper

**Files:**
- Create: `src/lib/whatsapp.ts`, `src/lib/whatsapp.test.ts`, `src/content.ts`, `src/content.test.ts`

**Interfaces:**
- Consumes: nothing
- Produces:
  - `whatsappLink(message: string, number?: string): string` returns `https://wa.me/<number>?text=<encoded message>`; `number` defaults to `site.whatsappNumber`
  - From `@/content`: `site`, `hero`, `sectionCopy`, `problems: Problem[]`, `services: Service[]`, `work: WorkItem[]`, `processSteps: Step[]`, `about`, `faqs: Faq[]`, `contact`
  - Types: `Problem { title; body }`, `Service { id; name; price; unit?; badge?; featured?; summary; includes: string[]; whatsappMessage }`, `WorkItem { name; tagline; url; image; problem; built; stack: string[] }`, `Step { title; body }`, `Faq { question; answer }`

- [ ] **Step 1: Write the failing link helper test**

Create `src/lib/whatsapp.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { whatsappLink } from "./whatsapp";

describe("whatsappLink", () => {
  it("links to Mustafa's WhatsApp number by default", () => {
    expect(whatsappLink("Hi")).toBe("https://wa.me/60193934247?text=Hi");
  });

  it("encodes spaces, commas and question marks in the message", () => {
    expect(whatsappLink("Hi Mustafa, can we talk?")).toBe(
      "https://wa.me/60193934247?text=Hi%20Mustafa%2C%20can%20we%20talk%3F",
    );
  });

  it("uses another number when one is given", () => {
    expect(whatsappLink("Hi", "60123456789")).toBe("https://wa.me/60123456789?text=Hi");
  });
});
```

- [ ] **Step 2: Write the failing content rules test**

Create `src/content.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import * as content from "./content";

type Found = { path: string; text: string };

function collectStrings(value: unknown, path: string): Found[] {
  if (typeof value === "string") return [{ path, text: value }];
  if (Array.isArray(value)) return value.flatMap((item, i) => collectStrings(item, `${path}[${i}]`));
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([key, item]) => collectStrings(item, `${path}.${key}`));
  }
  return [];
}

const allStrings = collectStrings(content, "content");
const DASH = /[‒–—―]|\s-\s/;

describe("copy rules", () => {
  it("contains no dash punctuation", () => {
    const offenders = allStrings.filter((s) => DASH.test(s.text)).map((s) => `${s.path}: ${s.text}`);
    expect(offenders).toEqual([]);
  });

  it("never mentions GetLokal or a 13 app count", () => {
    const joined = allStrings.map((s) => s.text).join("\n");
    expect(joined).not.toMatch(/getlokal/i);
    expect(joined).not.toMatch(/\b13\b/);
  });
});

describe("contact details", () => {
  it("uses the approved WhatsApp number, email and site URL", () => {
    expect(content.site.whatsappNumber).toBe("60193934247");
    expect(content.site.email).toBe("mussyahmi31@gmail.com");
    expect(content.site.url).toBe("https://mustafasyahmi.web.app");
  });
});

describe("services", () => {
  it("lists the four approved services with starting prices", () => {
    expect(content.services.map((s) => [s.name, s.price, s.unit ?? ""])).toEqual([
      ["Business website", "RM2,500", ""],
      ["Online store or ordering system", "RM8,000", ""],
      ["Custom web app or system", "RM15,000", ""],
      ["Monthly care plan", "RM300", "/month"],
    ]);
  });

  it("gives every service a pre-filled WhatsApp message and at least three inclusions", () => {
    for (const service of content.services) {
      expect(service.whatsappMessage.startsWith("Hi Mustafa")).toBe(true);
      expect(service.includes.length).toBeGreaterThanOrEqual(3);
    }
  });
});

describe("work", () => {
  it("shows exactly the four approved live apps", () => {
    expect(content.work.map((w) => w.name)).toEqual(["KiraPoket", "MariSolat", "KadHariLahir", "LukisLukis"]);
  });

  it("links each app to its web.app URL and a local WebP screenshot", () => {
    for (const item of content.work) {
      expect(item.url).toMatch(/^https:\/\/[a-z]+\.web\.app$/);
      expect(item.image).toMatch(/^\/work\/[a-z]+\.webp$/);
    }
  });
});

describe("section sizes", () => {
  it("has 3 problems, 4 process steps and 6 FAQs", () => {
    expect(content.problems).toHaveLength(3);
    expect(content.processSteps).toHaveLength(4);
    expect(content.faqs).toHaveLength(6);
  });
});
```

- [ ] **Step 3: Run tests to verify they fail**

```bash
npm test
```

Expected: FAIL, both files report `Failed to resolve import "./whatsapp"` / `"./content"`.

- [ ] **Step 4: Implement the link helper**

Create `src/lib/whatsapp.ts`:

```ts
import { site } from "@/content";

export function whatsappLink(message: string, number: string = site.whatsappNumber): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
```

- [ ] **Step 5: Write the content**

Create `src/content.ts`:

```ts
export type Problem = { title: string; body: string };

export type Service = {
  id: string;
  name: string;
  price: string;
  unit?: string;
  badge?: string;
  featured?: boolean;
  summary: string;
  includes: string[];
  whatsappMessage: string;
};

export type WorkItem = {
  name: string;
  tagline: string;
  url: string;
  image: string;
  problem: string;
  built: string;
  stack: string[];
};

export type Step = { title: string; body: string };

export type Faq = { question: string; answer: string };

export const site = {
  name: "Mustafa Syahmi",
  url: "https://mustafasyahmi.web.app",
  title: "Mustafa Syahmi | Web Developer for Malaysian Businesses",
  description:
    "Freelance web developer in Malaysia. Business websites from RM2,500, online stores and ordering systems with FPX payment from RM8,000, and custom systems for SMEs.",
  whatsappNumber: "60193934247",
  whatsappDisplay: "+60 19 393 4247",
  email: "mussyahmi31@gmail.com",
  github: "https://github.com/mussyahmi",
  defaultWhatsappMessage: "Hi Mustafa, I saw your website and would like to discuss a project.",
};

export const hero = {
  eyebrow: "Freelance web developer in Malaysia",
  headline: "I build websites and ordering systems for Malaysian businesses.",
  subheadline:
    "I'm Mustafa, a senior software engineer with five and a half years building payment and financial systems. I help business owners stop juggling WhatsApp orders and spreadsheets, and start selling online properly.",
  primaryCta: "WhatsApp me",
  secondaryCta: "See my work",
  photoAlt: "Portrait of Mustafa Syahmi",
};

export const sectionCopy = {
  problems: {
    eyebrow: "Sound familiar?",
    heading: "Running a business is hard enough without fighting your own tools",
  },
  services: {
    eyebrow: "Services",
    heading: "Clear starting prices, no guesswork",
    intro:
      "Every project starts with a free chat and a written proposal with a fixed price. Your final price depends on what you need.",
    note: "Prices are starting points. Third party fees such as hosting, domain and payment gateway charges are paid directly to those providers.",
  },
  work: {
    eyebrow: "Selected work",
    heading: "Apps I have built and shipped",
    intro: "Four products I designed, built and run myself. Open any of them on your phone right now.",
  },
  process: {
    eyebrow: "How it works",
    heading: "From first message to launch",
  },
  faq: {
    eyebrow: "FAQ",
    heading: "Questions owners usually ask",
  },
};

export const problems: Problem[] = [
  {
    title: "Taking orders over WhatsApp is chaos",
    body: "Orders get buried in chats, payments are checked by hand and small mistakes cost you customers. An ordering system keeps every order, payment and receipt in one place.",
  },
  {
    title: "Paying marketplace commission on every sale",
    body: "Platforms take a cut of every order. Your own online store lets customers buy from you directly with FPX payment, and the margin stays with you.",
  },
  {
    title: "Spreadsheets that do not add up",
    body: "When stock, sales and costs live in different files, you never see your real profit. A simple system keeps the numbers together and does the maths for you.",
  },
];

export const services: Service[] = [
  {
    id: "website",
    name: "Business website",
    price: "RM2,500",
    summary: "A professional site that makes your business look trustworthy and sends enquiries to your WhatsApp.",
    includes: [
      "Up to 5 pages",
      "Looks great on mobile",
      "WhatsApp button on every page",
      "Google search basics",
      "Hosting setup and handover",
    ],
    whatsappMessage: "Hi Mustafa, I'm interested in a business website.",
  },
  {
    id: "store",
    name: "Online store or ordering system",
    price: "RM8,000",
    badge: "Best for F&B and retail",
    featured: true,
    summary: "Take orders and payments online without paying commission to a marketplace.",
    includes: [
      "Product or menu catalogue",
      "Cart and checkout",
      "FPX online banking payment",
      "Automatic receipts by email",
      "Admin panel for orders and products",
    ],
    whatsappMessage: "Hi Mustafa, I'm interested in an online store or ordering system.",
  },
  {
    id: "custom",
    name: "Custom web app or system",
    price: "RM15,000",
    summary: "Software shaped around how your business actually runs.",
    includes: [
      "Bookings, agents or staff workflows",
      "Dashboards and reports",
      "Installable app on phones",
      "Built in phases so you can start using it early",
    ],
    whatsappMessage: "Hi Mustafa, I'd like to discuss a custom system for my business.",
  },
  {
    id: "care",
    name: "Monthly care plan",
    price: "RM300",
    unit: "/month",
    summary: "Keep your site or system running smoothly after launch.",
    includes: ["Monitoring and security updates", "Bug fixes", "Small content and design changes each month"],
    whatsappMessage: "Hi Mustafa, I'm interested in a monthly care plan.",
  },
];

export const work: WorkItem[] = [
  {
    name: "KiraPoket",
    tagline: "Personal finance app",
    url: "https://kirapoket.web.app",
    image: "/work/kirapoket.webp",
    problem: "Most budgeting apps assume your month starts on the 1st, but Malaysians get paid on different days.",
    built:
      "An installable expense tracker built around your salary cycle, with needs, wants and savings budgets, debt tracking and daily spending limits.",
    stack: ["Next.js", "Firebase", "PWA"],
  },
  {
    name: "MariSolat",
    tagline: "Prayer times app",
    url: "https://marisolat.web.app",
    image: "/work/marisolat.webp",
    problem: "Checking prayer times, finding the Qibla and tracking missed prayers usually means three different apps.",
    built:
      "One app that detects your zone automatically, shows the prayer times for it, points to the Qibla on a map and tracks qada prayers.",
    stack: ["Next.js", "Firebase", "Leaflet maps"],
  },
  {
    name: "KadHariLahir",
    tagline: "Digital birthday invitations",
    url: "https://kadharilahir.web.app",
    image: "/work/kadharilahir.webp",
    problem: "Printed invitation cards cost money, and guests still ask for the date and location again.",
    built:
      "Create a birthday invitation with a cover photo and a venue map, share one link, and let guests add the party to their calendar.",
    stack: ["Next.js", "Firebase", "Leaflet maps"],
  },
  {
    name: "LukisLukis",
    tagline: "Multiplayer drawing game",
    url: "https://lukislukis.web.app",
    image: "/work/lukislukis.webp",
    problem: "Party games in English don't always land with Malaysian friends and family.",
    built: "A Pictionary style drawing and guessing game in Bahasa Melayu that friends play together from their own phones.",
    stack: ["Next.js", "Firebase"],
  },
];

export const processSteps: Step[] = [
  {
    title: "Free chat",
    body: "Tell me about your business on WhatsApp. I'll ask a few questions to understand what you really need.",
  },
  {
    title: "Written proposal",
    body: "You get a clear proposal with the scope, timeline and a fixed price for each phase. No surprise charges.",
  },
  {
    title: "Build in phases",
    body: "Pay 30% to start each phase and 70% on delivery. You can start using each phase before the next one begins.",
  },
  {
    title: "Launch and support",
    body: "Every phase comes with 30 days of free bug fixing. After that, a monthly care plan is there if you want one.",
  },
];

export const about = {
  heading: "Hi, I'm Mustafa",
  paragraphs: [
    "By day I'm a senior software engineer at a fintech company, where I've spent five and a half years building payment and financial systems that have to be correct to the last sen.",
    "In the evenings I build products of my own. Four of them are live today, from a budgeting app to a prayer times app.",
    "I take on a small number of freelance projects at a time, so every client gets my full attention and a direct line to the person writing the code.",
  ],
  githubLabel: "See my code on GitHub",
};

export const faqs: Faq[] = [
  {
    question: "Do I own the code and the website?",
    answer:
      "Yes. Once the project is paid in full, the code, domain and accounts are handed over to you. You are never locked in to me.",
  },
  {
    question: "Can you set up FPX online banking payments?",
    answer:
      "Yes, through Malaysian payment gateways such as ToyyibPay, senangPay or CHIP. The gateway has to approve your merchant account first, which usually needs a registered business, so it is worth applying early.",
  },
  {
    question: "How long does a project take?",
    answer:
      "A business website usually takes 2 to 3 weeks. The first phase of an online store or ordering system takes around 4 weeks. Custom systems are planned in phases, and your proposal shows the timeline for each one.",
  },
  {
    question: "What if I need changes after launch?",
    answer:
      "Bugs are fixed for free for 30 days after each phase. New features are quoted before any work starts, and small changes are covered by the monthly care plan.",
  },
  {
    question: "Do you only work with businesses in the Klang Valley?",
    answer: "No. Everything can be done over WhatsApp and video calls, so I work with businesses anywhere in Malaysia.",
  },
  {
    question: "Do you handle hosting and the domain?",
    answer:
      "Yes, I set them up for you. Hosting, domain and payment gateway fees are paid directly to those providers, and your proposal lists the expected amounts.",
  },
];

export const contact = {
  heading: "Let's talk about your business",
  body: "Send me a WhatsApp message with a short description of what you need. I'll reply with a few questions and an honest view of what it would take.",
  emailLabel: "Prefer email?",
};
```

- [ ] **Step 6: Run tests to verify they pass**

```bash
npm test
```

Expected: PASS, 2 files, 11 tests.

- [ ] **Step 7: Commit**

```bash
git add src/content.ts src/content.test.ts src/lib/whatsapp.ts src/lib/whatsapp.test.ts
git commit -m "feat: add site copy and WhatsApp link helper with copy rule tests" -m "Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 3: Image assets (photo, app screenshots, share image)

**Files:**
- Create: `scripts/capture-work.sh`, `scripts/og.html`, `scripts/make-og.sh`, `public/mustafa.webp`, `public/work/{kirapoket,marisolat,kadharilahir,lukislukis}.webp`, `public/og.png`

**Interfaces:**
- Consumes: the paths used in `content.ts` (`/mustafa.webp`, `/work/<name>.webp`)
- Produces: `public/mustafa.webp` (800×800), four `public/work/*.webp` (780×1688), `public/og.png` (1200×630)

- [ ] **Step 1: Convert the portrait**

```bash
cwebp -quiet -q 85 -resize 800 800 "/Users/mustafasyahmi/Library/Mobile Documents/com~apple~CloudDocs/Downloads/IMG_6867.jpg" -o public/mustafa.webp
```

Verify:

```bash
mkdir -p .qa && dwebp -quiet public/mustafa.webp -o .qa/mustafa.png && sips -g pixelWidth -g pixelHeight .qa/mustafa.png
```

Expected: `pixelWidth: 800` and `pixelHeight: 800`.

- [ ] **Step 2: Write the screenshot script**

Create `scripts/capture-work.sh`:

```bash
#!/usr/bin/env bash
# Captures a 390x844 phone viewport (2x) of each live app into public/work/.
set -euo pipefail

CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
TMP_DIR=".qa/work"
mkdir -p "$TMP_DIR" public/work

capture() {
  local name="$1" url="$2"
  "$CHROME" --headless=new --disable-gpu --hide-scrollbars \
    --force-device-scale-factor=2 --window-size=390,844 \
    --virtual-time-budget=10000 \
    --screenshot="$TMP_DIR/$name.png" "$url"
  cwebp -quiet -q 82 -resize 780 0 "$TMP_DIR/$name.png" -o "public/work/$name.webp"
  echo "captured $name"
}

capture kirapoket https://kirapoket.web.app
capture marisolat https://marisolat.web.app
capture kadharilahir https://kadharilahir.web.app
capture lukislukis https://lukislukis.web.app
```

```bash
chmod +x scripts/capture-work.sh && npm pkg set scripts.screenshots="bash scripts/capture-work.sh"
```

- [ ] **Step 3: Capture and inspect the screenshots**

```bash
npm run screenshots
```

Expected: four `captured <name>` lines.

Open each of `.qa/work/*.png` with the Read tool and look at it. **If any screenshot shows a login wall, a blank page, a cookie banner covering the app, or a loading spinner, stop and ask Mustafa** which page or state to capture, or for a screenshot from his phone. Do not ship a login screen as a portfolio image. For a screenshot he provides, convert it with `cwebp -quiet -q 82 -resize 780 0 <file> -o public/work/<name>.webp`.

- [ ] **Step 4: Build the share image**

Create `scripts/og.html`:

```html
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <link
      href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800&display=block"
      rel="stylesheet"
    />
    <style>
      * { box-sizing: border-box; margin: 0; }
      body {
        width: 1200px;
        height: 630px;
        overflow: hidden;
        background: #faf6f0;
        color: #1a1714;
        font-family: "Plus Jakarta Sans", system-ui, sans-serif;
        display: grid;
        grid-template-columns: 1fr 470px;
      }
      .copy { padding: 72px 48px 72px 80px; display: flex; flex-direction: column; justify-content: center; }
      .eyebrow { color: #9e1b24; font-weight: 700; font-size: 24px; letter-spacing: 0.12em; text-transform: uppercase; }
      h1 { margin-top: 22px; font-size: 60px; line-height: 1.06; font-weight: 800; letter-spacing: -0.02em; }
      .name { margin-top: 36px; font-size: 28px; font-weight: 700; color: #5f564d; }
      .photo { background: url("../public/mustafa.webp") center / cover no-repeat; }
    </style>
  </head>
  <body>
    <div class="copy">
      <p class="eyebrow">Freelance web developer</p>
      <h1>Websites and ordering systems for Malaysian businesses</h1>
      <p class="name">Mustafa Syahmi · mustafasyahmi.web.app</p>
    </div>
    <div class="photo"></div>
  </body>
</html>
```

Create `scripts/make-og.sh`:

```bash
#!/usr/bin/env bash
# Renders scripts/og.html to public/og.png at 1200x630.
set -euo pipefail

CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
"$CHROME" --headless=new --disable-gpu --hide-scrollbars \
  --force-device-scale-factor=1 --window-size=1200,630 \
  --virtual-time-budget=5000 \
  --screenshot="public/og.png" "file://$PWD/scripts/og.html"
sips -g pixelWidth -g pixelHeight public/og.png
```

```bash
chmod +x scripts/make-og.sh && bash scripts/make-og.sh
```

Expected: `pixelWidth: 1200` and `pixelHeight: 630`. Open `public/og.png` with the Read tool and confirm the headline is fully visible, set in a bold sans font, and the photo fills the right side. If the headline wraps past the bottom, reduce `h1` `font-size` to `54px` and rerun.

- [ ] **Step 5: Commit**

```bash
git add scripts public package.json
git commit -m "feat: add portrait, app screenshots and share image" -m "Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 4: Build verification script and SEO

**Files:**
- Create: `scripts/verify-build.mjs`, `src/components/JsonLd.tsx`, `src/app/sitemap.ts`, `src/app/robots.ts`
- Modify: `src/app/layout.tsx` (full replacement)

**Interfaces:**
- Consumes: `site`, `services` from `@/content`
- Produces: `npm run verify` that prints `PASS: ...` or `FAIL: n problem(s)` with a list; `<JsonLd />` component

- [ ] **Step 1: Write the verification script**

Create `scripts/verify-build.mjs`:

```js
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
```

- [ ] **Step 2: Run it to see the SEO and section failures**

```bash
npm run build && npm run verify
```

Expected: FAIL listing all 8 `missing section` lines, `found 0 WhatsApp links`, `missing or short meta description`, `missing canonical link`, `missing og:image`, `missing ProfessionalService JSON-LD`, and the sitemap and robots lines. No `missing asset` lines (Task 3 made them).

- [ ] **Step 3: Add structured data**

Create `src/components/JsonLd.tsx`:

```tsx
import { services, site } from "@/content";

export function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: `${site.name}, Web Developer`,
    url: site.url,
    image: `${site.url}/og.png`,
    email: site.email,
    telephone: `+${site.whatsappNumber}`,
    areaServed: { "@type": "Country", name: "Malaysia" },
    founder: { "@type": "Person", name: site.name, jobTitle: "Software Engineer", sameAs: [site.github] },
    makesOffer: services.map((service) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: service.name },
      priceSpecification: {
        "@type": "PriceSpecification",
        minPrice: Number(service.price.replace(/[^0-9]/g, "")),
        priceCurrency: "MYR",
      },
    })),
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
```

- [ ] **Step 4: Full metadata in the layout**

Overwrite `src/app/layout.tsx`:

```tsx
import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { JsonLd } from "@/components/JsonLd";
import { site } from "@/content";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
  weight: ["600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: site.title,
  description: site.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: site.url,
    siteName: site.name,
    title: site.title,
    description: site.description,
    locale: "en_MY",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: site.title }],
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
    images: ["/og.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#faf6f0",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jakarta.variable}`}>
      <body className="bg-background font-sans text-foreground antialiased">
        <JsonLd />
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 5: Sitemap and robots**

Create `src/app/sitemap.ts`:

```ts
import type { MetadataRoute } from "next";
import { site } from "@/content";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: site.url, lastModified: new Date("2026-09-15"), changeFrequency: "monthly", priority: 1 }];
}
```

Create `src/app/robots.ts`:

```ts
import type { MetadataRoute } from "next";
import { site } from "@/content";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
```

- [ ] **Step 6: Run verify again**

```bash
npm run build && npm run verify
```

Expected: FAIL with **only** the 8 `missing section` lines and `found 0 WhatsApp links`. If a canonical or og:image line remains, run `grep -o '<link rel="canonical"[^>]*>\|<meta property="og:image"[^>]*>' out/index.html` and fix the metadata, not the check.

- [ ] **Step 7: Commit**

```bash
git add scripts/verify-build.mjs src/components/JsonLd.tsx src/app/layout.tsx src/app/sitemap.ts src/app/robots.ts
git commit -m "feat: add SEO metadata, structured data, sitemap and build verification" -m "Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 5: Shared components, Hero, Problems and sticky WhatsApp bar

**Files:**
- Create: `src/components/Container.tsx`, `src/components/SectionHeading.tsx`, `src/components/WhatsAppButton.tsx`, `src/components/StickyWhatsApp.tsx`, `src/components/sections/Hero.tsx`, `src/components/sections/Problems.tsx`
- Modify: `src/app/page.tsx` (full replacement)

**Interfaces:**
- Consumes: `whatsappLink` from `@/lib/whatsapp`; `site`, `hero`, `sectionCopy`, `problems` from `@/content`; `cn` from `@/lib/utils`; `buttonVariants` from `@/components/ui/button`
- Produces:
  - `Container({ className?, children })`
  - `SectionHeading({ eyebrow, heading, intro?, className? })`
  - `WhatsAppButton({ message, label, size?: "default" | "lg", className? })`
  - `StickyWhatsApp()`, `Hero()`, `Problems()`

- [ ] **Step 1: Shared components**

Create `src/components/Container.tsx`:

```tsx
import { cn } from "@/lib/utils";

export function Container({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("mx-auto w-full max-w-6xl px-5 sm:px-8", className)}>{children}</div>;
}
```

Create `src/components/SectionHeading.tsx`:

```tsx
import { cn } from "@/lib/utils";

type Props = { eyebrow: string; heading: string; intro?: string; className?: string };

export function SectionHeading({ eyebrow, heading, intro, className }: Props) {
  return (
    <div className={cn("max-w-2xl", className)}>
      <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl">{heading}</h2>
      {intro && <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{intro}</p>}
    </div>
  );
}
```

Create `src/components/WhatsAppButton.tsx`:

```tsx
import { MessageCircle } from "lucide-react";
import { whatsappLink } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

type Props = {
  message: string;
  label: string;
  size?: "default" | "lg";
  className?: string;
};

export function WhatsAppButton({ message, label, size = "default", className }: Props) {
  return (
    <a
      href={whatsappLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full bg-whatsapp font-semibold text-whatsapp-foreground shadow-sm transition hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-whatsapp",
        size === "lg" ? "h-13 px-7 text-base" : "h-11 px-5 text-sm",
        className,
      )}
    >
      <MessageCircle className="size-5" aria-hidden />
      {label}
    </a>
  );
}
```

Create `src/components/StickyWhatsApp.tsx`:

```tsx
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { hero, site } from "@/content";

export function StickyWhatsApp() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t bg-background/95 p-3 backdrop-blur md:hidden">
      <WhatsAppButton className="w-full" size="lg" message={site.defaultWhatsappMessage} label={hero.primaryCta} />
    </div>
  );
}
```

- [ ] **Step 2: Hero**

Create `src/components/sections/Hero.tsx`:

```tsx
import Image from "next/image";
import { Container } from "@/components/Container";
import { buttonVariants } from "@/components/ui/button";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { hero, site } from "@/content";
import { cn } from "@/lib/utils";

export function Hero() {
  return (
    <section id="hero" className="pb-16 pt-8 sm:pb-24 sm:pt-16">
      <Container className="grid items-center gap-8 md:grid-cols-[1.15fr_0.85fr] md:gap-14">
        <div className="order-2 md:order-1">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary">{hero.eyebrow}</p>
          <h1 className="mt-4 text-4xl font-extrabold leading-[1.05] sm:text-5xl lg:text-6xl">{hero.headline}</h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">{hero.subheadline}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <WhatsAppButton size="lg" message={site.defaultWhatsappMessage} label={hero.primaryCta} />
            <a
              href="#work"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-13 rounded-full px-7 text-base")}
            >
              {hero.secondaryCta}
            </a>
          </div>
        </div>
        <div className="order-1 md:order-2">
          <Image
            src="/mustafa.webp"
            alt={hero.photoAlt}
            width={800}
            height={800}
            loading="eager"
            fetchPriority="high"
            sizes="(min-width: 768px) 40vw, 18rem"
            className="aspect-square w-full max-w-72 rounded-3xl object-cover shadow-xl sm:max-w-sm md:max-w-none"
          />
        </div>
      </Container>
    </section>
  );
}
```

- [ ] **Step 3: Problems**

Create `src/components/sections/Problems.tsx`:

```tsx
import { Container } from "@/components/Container";
import { SectionHeading } from "@/components/SectionHeading";
import { problems, sectionCopy } from "@/content";

export function Problems() {
  return (
    <section id="problems" className="border-y bg-card py-16 sm:py-24">
      <Container>
        <SectionHeading eyebrow={sectionCopy.problems.eyebrow} heading={sectionCopy.problems.heading} />
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {problems.map((problem, i) => (
            <article key={problem.title} className="rounded-2xl border bg-background p-6">
              <span className="font-heading text-sm font-bold text-primary">0{i + 1}</span>
              <h3 className="mt-3 text-xl font-bold">{problem.title}</h3>
              <p className="mt-3 leading-relaxed text-muted-foreground">{problem.body}</p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
```

- [ ] **Step 4: Compose the page**

Overwrite `src/app/page.tsx`:

```tsx
import { StickyWhatsApp } from "@/components/StickyWhatsApp";
import { Hero } from "@/components/sections/Hero";
import { Problems } from "@/components/sections/Problems";

export default function Home() {
  return (
    <>
      <main>
        <Hero />
        <Problems />
      </main>
      <StickyWhatsApp />
    </>
  );
}
```

- [ ] **Step 5: Verify progress**

```bash
npm test && npm run build && npm run verify
```

Expected: tests PASS. Verify FAILS with only `missing section` for `services, work, process, about, faq, contact` and `found 2 WhatsApp links`. No dash or GetLokal lines.

- [ ] **Step 6: Commit**

```bash
git add src/components src/app/page.tsx
git commit -m "feat: add hero, problems section and sticky WhatsApp bar" -m "Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 6: Services and Selected Work

**Files:**
- Create: `src/components/PhoneFrame.tsx`, `src/components/sections/Services.tsx`, `src/components/sections/Work.tsx`
- Modify: `src/app/page.tsx` (full replacement)

**Interfaces:**
- Consumes: `Container`, `SectionHeading`, `WhatsAppButton` (Task 5); `services`, `work`, `sectionCopy` from `@/content`; `cn`
- Produces: `PhoneFrame({ src, alt })`, `Services()`, `Work()`

- [ ] **Step 1: Phone frame**

Create `src/components/PhoneFrame.tsx`:

```tsx
import Image from "next/image";

export function PhoneFrame({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="rounded-[1.6rem] border-[6px] border-foreground bg-foreground shadow-lg">
      <Image
        src={src}
        alt={alt}
        width={390}
        height={844}
        sizes="10rem"
        className="aspect-[390/844] w-full rounded-[1.1rem] object-cover object-top"
      />
    </div>
  );
}
```

- [ ] **Step 2: Services**

Create `src/components/sections/Services.tsx`:

```tsx
import { Check } from "lucide-react";
import { Container } from "@/components/Container";
import { SectionHeading } from "@/components/SectionHeading";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { sectionCopy, services } from "@/content";
import { cn } from "@/lib/utils";

export function Services() {
  return (
    <section id="services" className="py-16 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow={sectionCopy.services.eyebrow}
          heading={sectionCopy.services.heading}
          intro={sectionCopy.services.intro}
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {services.map((service) => (
            <article
              key={service.id}
              className={cn(
                "flex flex-col rounded-2xl border bg-card p-6 sm:p-8",
                service.featured && "border-primary ring-1 ring-primary",
              )}
            >
              {service.badge && (
                <p className="mb-3 w-fit rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
                  {service.badge}
                </p>
              )}
              <h3 className="text-xl font-bold">{service.name}</h3>
              <p className="mt-2 leading-relaxed text-muted-foreground">{service.summary}</p>
              <p className="mt-6 text-sm text-muted-foreground">From</p>
              <p className="font-heading text-4xl font-extrabold text-primary">
                {service.price}
                {service.unit && <span className="text-base font-semibold text-muted-foreground">{service.unit}</span>}
              </p>
              <ul className="mt-6 space-y-2">
                {service.includes.map((item) => (
                  <li key={item} className="flex gap-2">
                    <Check className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-8">
                <WhatsAppButton className="w-full" message={service.whatsappMessage} label="Ask about this" />
              </div>
            </article>
          ))}
        </div>
        <p className="mt-8 max-w-3xl text-sm text-muted-foreground">{sectionCopy.services.note}</p>
      </Container>
    </section>
  );
}
```

- [ ] **Step 3: Selected Work**

Create `src/components/sections/Work.tsx`:

```tsx
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/Container";
import { PhoneFrame } from "@/components/PhoneFrame";
import { SectionHeading } from "@/components/SectionHeading";
import { sectionCopy, work } from "@/content";

export function Work() {
  return (
    <section id="work" className="border-y bg-card py-16 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow={sectionCopy.work.eyebrow}
          heading={sectionCopy.work.heading}
          intro={sectionCopy.work.intro}
        />
        <div className="mt-12 grid gap-12 md:grid-cols-2 md:gap-x-10 md:gap-y-16">
          {work.map((item) => (
            <article key={item.name} className="grid grid-cols-[7.5rem_1fr] items-start gap-5 sm:grid-cols-[10rem_1fr] sm:gap-6">
              <PhoneFrame src={item.image} alt={`${item.name} app screenshot`} />
              <div>
                <p className="text-sm font-semibold text-primary">{item.tagline}</p>
                <h3 className="mt-1 text-2xl font-bold">{item.name}</h3>
                <p className="mt-3 leading-relaxed text-muted-foreground">
                  <span className="font-semibold text-foreground">The problem: </span>
                  {item.problem}
                </p>
                <p className="mt-2 leading-relaxed text-muted-foreground">
                  <span className="font-semibold text-foreground">What I built: </span>
                  {item.built}
                </p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {item.stack.map((tech) => (
                    <li key={tech} className="rounded-full border bg-background px-3 py-1 text-xs font-medium">
                      {tech}
                    </li>
                  ))}
                </ul>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-1 font-semibold text-primary underline-offset-4 hover:underline"
                >
                  Open {item.name}
                  <ArrowUpRight className="size-4" aria-hidden />
                </a>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
```

- [ ] **Step 4: Add to the page**

Overwrite `src/app/page.tsx`:

```tsx
import { StickyWhatsApp } from "@/components/StickyWhatsApp";
import { Hero } from "@/components/sections/Hero";
import { Problems } from "@/components/sections/Problems";
import { Services } from "@/components/sections/Services";
import { Work } from "@/components/sections/Work";

export default function Home() {
  return (
    <>
      <main>
        <Hero />
        <Problems />
        <Services />
        <Work />
      </main>
      <StickyWhatsApp />
    </>
  );
}
```

- [ ] **Step 5: Verify progress**

```bash
npm run build && npm run verify
```

Expected: FAIL with only `missing section` for `process, about, faq, contact` and `found 6 WhatsApp links`.

- [ ] **Step 6: Commit**

```bash
git add src/components src/app/page.tsx
git commit -m "feat: add services pricing and selected work sections" -m "Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 7: Process, About, FAQ, Contact and Footer

**Files:**
- Create: `src/components/sections/Process.tsx`, `src/components/sections/About.tsx`, `src/components/sections/Faq.tsx`, `src/components/sections/Contact.tsx`, `src/components/sections/Footer.tsx`
- Modify: `src/app/page.tsx` (full replacement)

**Interfaces:**
- Consumes: `Container`, `SectionHeading`, `WhatsAppButton`; `processSteps`, `about`, `faqs`, `contact`, `site`, `sectionCopy` from `@/content`
- Produces: `Process()`, `About()`, `Faq()`, `Contact()`, `Footer()`

The FAQ uses native `<details>` rather than a JavaScript accordion so the answers are present in the static HTML for search engines.

- [ ] **Step 1: Process**

Create `src/components/sections/Process.tsx`:

```tsx
import { Container } from "@/components/Container";
import { SectionHeading } from "@/components/SectionHeading";
import { processSteps, sectionCopy } from "@/content";

export function Process() {
  return (
    <section id="process" className="py-16 sm:py-24">
      <Container>
        <SectionHeading eyebrow={sectionCopy.process.eyebrow} heading={sectionCopy.process.heading} />
        <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {processSteps.map((step, i) => (
            <li key={step.title} className="rounded-2xl border bg-card p-6">
              <span className="flex size-10 items-center justify-center rounded-full bg-primary font-heading font-bold text-primary-foreground">
                {i + 1}
              </span>
              <h3 className="mt-4 text-lg font-bold">{step.title}</h3>
              <p className="mt-2 leading-relaxed text-muted-foreground">{step.body}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
```

- [ ] **Step 2: About**

Create `src/components/sections/About.tsx`:

```tsx
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/Container";
import { about, site } from "@/content";

export function About() {
  return (
    <section id="about" className="border-y bg-card py-16 sm:py-24">
      <Container className="grid gap-6 md:grid-cols-[0.8fr_1.2fr] md:gap-14">
        <h2 className="text-3xl font-bold sm:text-4xl">{about.heading}</h2>
        <div className="space-y-4 text-lg leading-relaxed text-muted-foreground">
          {about.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <a
            href={site.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-semibold text-primary underline-offset-4 hover:underline"
          >
            {about.githubLabel}
            <ArrowUpRight className="size-4" aria-hidden />
          </a>
        </div>
      </Container>
    </section>
  );
}
```

- [ ] **Step 3: FAQ**

Create `src/components/sections/Faq.tsx`:

```tsx
import { Plus } from "lucide-react";
import { Container } from "@/components/Container";
import { SectionHeading } from "@/components/SectionHeading";
import { faqs, sectionCopy } from "@/content";

export function Faq() {
  return (
    <section id="faq" className="py-16 sm:py-24">
      <Container className="max-w-3xl">
        <SectionHeading eyebrow={sectionCopy.faq.eyebrow} heading={sectionCopy.faq.heading} />
        <div className="mt-8 divide-y border-y">
          {faqs.map((faq) => (
            <details key={faq.question} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-heading text-lg font-semibold [&::-webkit-details-marker]:hidden">
                {faq.question}
                <Plus className="size-5 shrink-0 text-primary transition group-open:rotate-45" aria-hidden />
              </summary>
              <p className="mt-3 leading-relaxed text-muted-foreground">{faq.answer}</p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}
```

- [ ] **Step 4: Contact and Footer**

Create `src/components/sections/Contact.tsx`:

```tsx
import { Container } from "@/components/Container";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { contact, hero, site } from "@/content";

export function Contact() {
  return (
    <section id="contact" className="pb-16 sm:pb-24">
      <Container>
        <div className="rounded-3xl bg-primary px-6 py-12 text-primary-foreground sm:px-12 sm:py-16">
          <h2 className="max-w-2xl text-3xl font-bold sm:text-5xl">{contact.heading}</h2>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-primary-foreground/85">{contact.body}</p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
            <WhatsAppButton size="lg" message={site.defaultWhatsappMessage} label={hero.primaryCta} />
            <p className="text-primary-foreground/85">
              {contact.emailLabel}{" "}
              <a href={`mailto:${site.email}`} className="font-semibold text-primary-foreground underline underline-offset-4">
                {site.email}
              </a>
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
```

Create `src/components/sections/Footer.tsx`:

```tsx
import { Container } from "@/components/Container";
import { site } from "@/content";

export function Footer() {
  return (
    <footer className="border-t pb-28 pt-8 md:pb-8">
      <Container className="flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:justify-between">
        <p>© 2026 {site.name}</p>
        <p>
          {site.whatsappDisplay} · {site.email}
        </p>
      </Container>
    </footer>
  );
}
```

`pb-28` on mobile keeps the footer clear of the sticky WhatsApp bar.

- [ ] **Step 5: Final page composition**

Overwrite `src/app/page.tsx`:

```tsx
import { StickyWhatsApp } from "@/components/StickyWhatsApp";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Faq } from "@/components/sections/Faq";
import { Footer } from "@/components/sections/Footer";
import { Hero } from "@/components/sections/Hero";
import { Problems } from "@/components/sections/Problems";
import { Process } from "@/components/sections/Process";
import { Services } from "@/components/sections/Services";
import { Work } from "@/components/sections/Work";

export default function Home() {
  return (
    <>
      <main>
        <Hero />
        <Problems />
        <Services />
        <Work />
        <Process />
        <About />
        <Faq />
        <Contact />
      </main>
      <Footer />
      <StickyWhatsApp />
    </>
  );
}
```

- [ ] **Step 6: Verify everything passes**

```bash
npm test && npm run lint && npm run build && npm run verify
```

Expected: tests PASS, lint clean, and `PASS: 8 sections, 7 WhatsApp links, SEO tags and assets present`.

- [ ] **Step 7: Commit**

```bash
git add src/components src/app/page.tsx
git commit -m "feat: add process, about, FAQ, contact and footer" -m "Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 8: Visual and Lighthouse QA, then Mustafa's review

**Files:**
- Modify: only files needed to fix issues found (most likely section components or `globals.css`)
- Output (gitignored): `.qa/mobile.png`, `.qa/desktop.png`, `.qa/lighthouse.json`

**Interfaces:**
- Consumes: the built `out/` folder
- Produces: screenshots and scores for Mustafa's sign-off

- [ ] **Step 1: Serve the export locally**

Run in the background (Bash `run_in_background: true`):

```bash
npx serve@14 out -l 4173
```

Check: `curl -s -o /dev/null -w "%{http_code}\n" http://localhost:4173` prints `200`.

- [ ] **Step 2: Full-length screenshots at phone and desktop widths**

```bash
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
"$CHROME" --headless=new --disable-gpu --hide-scrollbars --window-size=400,7800 --virtual-time-budget=5000 --screenshot=.qa/mobile.png http://localhost:4173
"$CHROME" --headless=new --disable-gpu --hide-scrollbars --window-size=1440,5200 --virtual-time-budget=5000 --screenshot=.qa/desktop.png http://localhost:4173
```

Open both with the Read tool. Check, and fix anything that fails:
- Nothing overflows horizontally at 400px; the side gutter is visible on every section
- On mobile the photo sits above the headline; on desktop it sits to the right
- Service cards line up, and the featured card has the crimson outline and badge
- Phone frames show the real app screenshots, not blank boxes
- Headings use the heavier Plus Jakarta Sans face; body text uses Inter
- The sticky WhatsApp bar is visible at the bottom of the mobile screenshot and absent on desktop

If content is cut off at the bottom, increase the window height and retake.

- [ ] **Step 3: Lighthouse on mobile**

```bash
npx lighthouse@12 http://localhost:4173 --form-factor=mobile --only-categories=performance,accessibility,seo --output=json --output-path=.qa/lighthouse.json --chrome-flags="--headless=new" --quiet
node -e 'const r=require("./.qa/lighthouse.json");for(const c of Object.values(r.categories))console.log(c.title,Math.round(c.score*100));for(const a of Object.values(r.audits))if(a.score!==null&&a.score<0.9&&a.details)console.log(" -",a.id,":",a.title)'
```

Expected: Performance, Accessibility and SEO each print 90 or higher. For any score below 90, fix the listed failing audits (common ones: `color-contrast`, `image-size-responsive`, `largest-contentful-paint`) and rerun `npm run build`, restart the server and rerun this step.

- [ ] **Step 4: Stop the server and rerun the gate**

Stop the background `serve` task, then:

```bash
npm test && npm run build && npm run verify
```

Expected: tests PASS and verify prints `PASS`.

- [ ] **Step 5: Commit any fixes**

```bash
git add -A
git commit -m "fix: address visual QA and Lighthouse findings" -m "Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

Skip this step if nothing changed.

- [ ] **Step 6: CHECKPOINT: Mustafa reviews the site**

Open the screenshots for him (`open .qa/mobile.png .qa/desktop.png`) and report the Lighthouse scores. Also offer `npx serve@14 out -l 4173` so he can open `http://localhost:4173` on his own browser. **Wait for his approval** before Task 9. Apply any copy or design changes he asks for, rerunning Step 4 after each round.

---

### Task 9: Firebase project, deploy and GitHub

**Files:**
- Modify: `.firebaserc` only if the project ID has to change

**Interfaces:**
- Consumes: approved `out/` build
- Produces: live `https://mustafasyahmi.web.app`; optional GitHub repo

- [ ] **Step 1: CHECKPOINT: ask Mustafa to approve creating the Firebase project**

Once approved:

```bash
firebase projects:create mustafasyahmi --display-name "Mustafa Syahmi"
```

Expected: `Your Firebase project is ready!`. **If the ID is already taken, stop and ask Mustafa** which ID to use instead, because it changes the public URL. Then update `.firebaserc`, `site.url` in `src/content.ts`, the expected URL in `src/content.test.ts`, `SITE_URL` and the canonical regex in `scripts/verify-build.mjs`, and the domain text in `scripts/og.html` (rerun `bash scripts/make-og.sh`).

- [ ] **Step 2: Make sure a Hosting site exists**

```bash
firebase hosting:sites:list --project mustafasyahmi
```

If no site is listed, run `firebase hosting:sites:create mustafasyahmi --project mustafasyahmi`.

- [ ] **Step 3: CHECKPOINT: ask Mustafa to approve the first deploy**

Once approved:

```bash
npm test && npm run build && npm run verify && firebase deploy --only hosting --project mustafasyahmi
```

Expected: `Deploy complete!` and `Hosting URL: https://mustafasyahmi.web.app`.

- [ ] **Step 4: Verify the live site**

```bash
curl -s -o /dev/null -w "%{http_code}\n" https://mustafasyahmi.web.app
curl -s https://mustafasyahmi.web.app | grep -o '<meta property="og:image"[^>]*>'
curl -s -o /dev/null -w "%{http_code}\n" https://mustafasyahmi.web.app/og.png
curl -s https://mustafasyahmi.web.app/sitemap.xml | head -5
```

Expected: `200`, the og:image tag pointing at `https://mustafasyahmi.web.app/og.png`, `200`, and XML containing the site URL.

- [ ] **Step 5: CHECKPOINT: ask Mustafa about GitHub**

Ask whether to push, and whether the repo should be public or private. If approved:

```bash
gh repo create mussyahmi/mustafasyahmi --<public|private> --source . --push
```

Expected: the repo URL is printed and `git status` shows the branch tracking `origin`.

- [ ] **Step 6: Hand-off**

Tell Mustafa the site is live, and remind him of the next steps from the spec's out-of-scope list: replace `beacons.ai/mustafasyahmi` in his Threads bio with the new URL, test a link preview by sending the URL to himself on WhatsApp, and buy a custom domain when ready.
