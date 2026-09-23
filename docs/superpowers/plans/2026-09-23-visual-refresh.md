# Visual Refresh and Interactivity Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the plain but working portfolio site into a distinctive, animated, interactive one: dark glowing hero and closing panel, motion throughout, a price estimator, and tappable app screen galleries.

**Architecture:** Stay on Next.js 16 static export. Motion is CSS first (keyframes, scroll-driven animations where supported) with one small intersection-observer component for reveals. Only four components become client components: `Reveal`, `CountUp`, `AppGallery`, `Estimator`. The estimator's pricing is a pure, unit-tested module; the UI is a thin shell over it. Every section stays readable with JavaScript disabled and with reduced motion on.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS 4, lucide-react, Vitest, Playwright (screenshots only), Firebase Hosting.

**Spec:** `docs/superpowers/specs/2026-09-23-visual-refresh-design.md` (supersedes the visual parts of `docs/superpowers/specs/2026-09-15-portfolio-site-design.md`)

## Global Constraints

- Project root: `/Users/mustafasyahmi/development/mustafasyahmi`, branch `build/site`, Node v20.19.6, npm.
- Static export only: no server, no API routes, no database, no analytics, no third party embeds, no animation library.
- **Do not change any existing copy** in `src/content.ts`. New strings must contain no dash punctuation (no em dash, no en dash, no spaced hyphen), never mention GetLokal, and make no claim the repos do not support.
- Palette: crimson `#9e1b24`, cream `#faf6f0`, ink text `#1a1714`, WhatsApp green `#25d366` on `#0b2e17`. This plan adds dark surface tokens (`--ink*`) derived from the same warm family. No other new hues.
- Prices unchanged: RM2,500 / RM8,000 / RM15,000 / RM300 per month.
- Every animation uses `transform` and `opacity` only. Easing `cubic-bezier(0.22, 1, 0.36, 1)`. `prefers-reduced-motion: reduce` disables all of it, with content fully visible.
- With JavaScript disabled or still loading, every section must be readable and every WhatsApp link must work.
- Mobile first at 400px, no horizontal overflow. Lighthouse mobile: Performance, Accessibility, SEO each 90 or higher.
- `npm test` must stay green and `npm run verify` must end with `PASS: 9 sections, 8 WhatsApp links, SEO tags and assets present` once Task 3 lands.
- Commit messages use conventional prefixes and end with a blank line then `Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>`.
- `.qa/` and `.superpowers/` are git-ignored; never stage them.

## Deviations From the Spec

- The spec's "one soft pulse on WhatsApp buttons when first revealed" is dropped. Doing it properly needs per element JavaScript for a decoration, the buttons are already the loudest thing on the page, and a looping or repeated pulse would be worse than none. Everything else in the spec's motion table is implemented.
- The FAQ opens with a fade and slide rather than an animated height. Height animation on `<details>` needs either JavaScript or CSS that older iPhones do not support, and the answers must stay in the static HTML for search engines.

## File Map

| File | Responsibility |
|---|---|
| `src/app/globals.css` | Dark surface tokens, easing token, keyframes, reveal/card/glow utilities, reduced-motion block |
| `src/app/layout.tsx` | Adds the `js` class marker so reveal states only apply when scripts run |
| `src/lib/format.ts` (+ test) | `formatRinggit`, `parseRinggit` |
| `src/lib/estimate.ts` (+ test) | Pure estimator pricing and message building |
| `src/components/Reveal.tsx` | Client: reveal on scroll wrapper |
| `src/components/CountUp.tsx` | Client: animated number, final value in SSR output |
| `src/components/AppGallery.tsx` | Client: swipeable app screen gallery inside the phone frame |
| `src/components/sections/Estimator.tsx` | Client: four questions, result, WhatsApp handoff |
| `src/components/StickyWhatsApp.tsx` | Client: slides in after the hero leaves view |
| `src/components/sections/Hero.tsx` | Dark treatment, gradient phrase, entrance motion |
| `src/components/sections/Work.tsx` | Alternating layout, uses `AppGallery` |
| `src/components/sections/Process.tsx` | Timeline treatment |
| `src/components/sections/Contact.tsx` | Dark treatment with glow |
| `src/components/sections/{Problems,Services,About,Faq,Footer}.tsx` | New card treatment, counting prices, smoother FAQ |
| `src/content.ts` | `hero.headlineHighlight`, `estimator`, `work[].screens`, no changes to existing strings |
| `scripts/verify-build.mjs` | Adds the `estimate` section and the estimator's WhatsApp link |

---

### Task 1: Design tokens, motion foundation and the reveal helper

**Files:**
- Modify: `src/app/globals.css` (append tokens, utilities, keyframes), `src/app/layout.tsx` (add the `js` marker)
- Create: `src/lib/format.ts`, `src/lib/format.test.ts`, `src/components/Reveal.tsx`, `src/components/CountUp.tsx`

**Interfaces:**
- Consumes: nothing
- Produces:
  - Tailwind colour utilities `bg-ink`, `text-ink-foreground`, `text-ink-muted`, `text-ink-accent`, `border-ink-border`; easing utility `ease-out-soft`
  - CSS classes `glow-crimson`, `dot-grid`, `text-gradient-crimson`, `card-soft`, `card-hover`, `hero-item`, `faq-body`, `tilt-on-scroll`
  - `formatRinggit(amount: number): string` and `parseRinggit(price: string): number` from `@/lib/format`
  - `<Reveal as?: "div" | "section" | "article" | "li" | "ol" | "ul" className?: string delayMs?: number>` from `@/components/Reveal`
  - `<CountUp value: number suffix?: string className?: string durationMs?: number>` from `@/components/CountUp`

- [ ] **Step 1: Write the failing formatting test**

Create `src/lib/format.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { formatRinggit, parseRinggit } from "./format";

describe("formatRinggit", () => {
  it("groups thousands and prefixes RM", () => {
    expect(formatRinggit(2500)).toBe("RM2,500");
    expect(formatRinggit(15000)).toBe("RM15,000");
  });

  it("leaves hundreds ungrouped", () => {
    expect(formatRinggit(300)).toBe("RM300");
  });

  it("rounds to whole ringgit", () => {
    expect(formatRinggit(2499.6)).toBe("RM2,500");
  });
});

describe("parseRinggit", () => {
  it("reads the number out of a price string", () => {
    expect(parseRinggit("RM2,500")).toBe(2500);
    expect(parseRinggit("RM300")).toBe(300);
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm test`
Expected: FAIL with `Failed to resolve import "./format"`.

- [ ] **Step 3: Implement the formatter**

Create `src/lib/format.ts`:

```ts
const formatter = new Intl.NumberFormat("en-MY", { maximumFractionDigits: 0 });

export function formatRinggit(amount: number): string {
  return `RM${formatter.format(Math.round(amount))}`;
}

export function parseRinggit(price: string): number {
  return Number(price.replace(/[^0-9]/g, ""));
}
```

- [ ] **Step 4: Run it to verify it passes**

Run: `npm test`
Expected: PASS, 3 files, 15 tests (11 existing plus 4 new).

- [ ] **Step 5: Add the design tokens**

In `src/app/globals.css`, inside the `:root` block, after the `--whatsapp-foreground` line, add:

```css
  --ink: #141110;
  --ink-foreground: #f7f3ee;
  --ink-muted: #b9aea4;
  --ink-accent: #e4606a;
  --ink-border: #2b2320;
```

In the `@theme inline` block, after `--color-whatsapp-foreground`, add:

```css
  --color-ink: var(--ink);
  --color-ink-foreground: var(--ink-foreground);
  --color-ink-muted: var(--ink-muted);
  --color-ink-accent: var(--ink-accent);
  --color-ink-border: var(--ink-border);
  --ease-out-soft: cubic-bezier(0.22, 1, 0.36, 1);
```

- [ ] **Step 6: Add the motion layer**

Append to the end of `src/app/globals.css`:

```css
@layer components {
  .glow-crimson {
    background: radial-gradient(60% 60% at 50% 45%, rgba(158, 27, 36, 0.55) 0%, rgba(158, 27, 36, 0.18) 45%, transparent 72%);
  }

  .dot-grid {
    background-image: radial-gradient(rgba(247, 243, 238, 0.14) 1px, transparent 1px);
    background-size: 22px 22px;
  }

  .text-gradient-crimson {
    background: linear-gradient(120deg, #e4606a 0%, #9e1b24 65%);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }

  .text-gradient-ember {
    background: linear-gradient(120deg, #ffb4a8 0%, #e4606a 70%);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }

  .card-soft {
    box-shadow:
      0 1px 2px rgba(26, 23, 20, 0.04),
      0 8px 24px -12px rgba(26, 23, 20, 0.18);
  }

  .card-hover {
    transition:
      transform 200ms var(--ease-out-soft),
      box-shadow 200ms var(--ease-out-soft);
  }

  @media (hover: hover) {
    .card-hover:hover {
      transform: translateY(-4px);
      box-shadow:
        0 2px 4px rgba(26, 23, 20, 0.05),
        0 18px 40px -16px rgba(26, 23, 20, 0.28);
    }
  }
}

@layer utilities {
  /* Reveal state is applied only when scripts run, so a failed or disabled
     script never hides content. */
  [data-reveal] {
    transition:
      opacity 600ms var(--ease-out-soft),
      transform 600ms var(--ease-out-soft);
  }

  .js [data-reveal][data-revealed="false"] {
    opacity: 0;
    transform: translateY(16px);
  }

  .hero-item {
    animation: hero-in 700ms var(--ease-out-soft) both;
  }

  .hero-item:nth-child(1) { animation-delay: 60ms; }
  .hero-item:nth-child(2) { animation-delay: 140ms; }
  .hero-item:nth-child(3) { animation-delay: 220ms; }
  .hero-item:nth-child(4) { animation-delay: 300ms; }

  .animate-drift {
    animation: drift 12s ease-in-out infinite alternate;
  }

  .animate-float {
    animation: float 6s ease-in-out infinite alternate;
  }

  .faq-body {
    animation: faq-open 260ms var(--ease-out-soft) both;
  }

  @supports (animation-timeline: view()) {
    .tilt-on-scroll {
      animation: tilt linear both;
      animation-timeline: view();
      animation-range: entry 15% cover 65%;
    }
  }
}

@keyframes hero-in {
  from {
    opacity: 0;
    transform: translateY(18px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

@keyframes drift {
  from {
    transform: translate3d(-3%, -2%, 0) scale(1);
  }
  to {
    transform: translate3d(3%, 2%, 0) scale(1.08);
  }
}

@keyframes float {
  from {
    transform: translateY(-6px);
  }
  to {
    transform: translateY(6px);
  }
}

@keyframes faq-open {
  from {
    opacity: 0;
    transform: translateY(-6px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

@keyframes tilt {
  from {
    transform: perspective(1200px) rotateX(6deg) rotateY(-4deg) translateY(10px);
  }
  to {
    transform: perspective(1200px) rotateX(0deg) rotateY(0deg) translateY(-10px);
  }
}
```

Then replace the existing reduced-motion block at the end of the file with:

```css
@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }

  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }

  .js [data-reveal][data-revealed="false"] {
    opacity: 1;
    transform: none;
  }
}
```

- [ ] **Step 7: Mark that scripts are running**

In `src/app/layout.tsx`, inside `<html ...>` and directly above `<body ...>`, add:

```tsx
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.add("js")`,
          }}
        />
      </head>
```

- [ ] **Step 8: Create the reveal wrapper**

Create `src/components/Reveal.tsx`:

```tsx
"use client";

import { useEffect, useRef, useState, type ElementType, type ReactNode, type Ref } from "react";

type Props = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  delayMs?: number;
};

export function Reveal({ children, as: Tag = "div", className, delayMs = 0 }: Props) {
  const ref = useRef<HTMLElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (revealed) return;
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setRevealed(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [revealed]);

  return (
    <Tag
      ref={ref as Ref<never>}
      data-reveal
      data-revealed={revealed ? "true" : "false"}
      style={delayMs ? { transitionDelay: `${delayMs}ms` } : undefined}
      className={className}
    >
      {children}
    </Tag>
  );
}
```

- [ ] **Step 9: Create the counting number**

Create `src/components/CountUp.tsx`:

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { formatRinggit } from "@/lib/format";

type Props = {
  value: number;
  className?: string;
  durationMs?: number;
};

export function CountUp({ value, className, durationMs = 900 }: Props) {
  // Starts at the real value so the exported HTML and a no-script visit show
  // the price immediately.
  const [shown, setShown] = useState(value);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || typeof IntersectionObserver === "undefined") return;

    let frame = 0;
    let start = 0;
    setShown(0);

    const step = (now: number) => {
      if (!start) start = now;
      const progress = Math.min((now - start) / durationMs, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setShown(value * eased);
      if (progress < 1) frame = requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect();
          frame = requestAnimationFrame(step);
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(node);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value, durationMs]);

  return (
    <span ref={ref} className={className}>
      {formatRinggit(shown)}
    </span>
  );
}
```

- [ ] **Step 10: Verify the foundation builds**

Run: `npm test && npm run lint && npm run build && npm run verify`
Expected: 15 tests pass, lint clean, build clean, verify still prints `PASS: 8 sections, 7 WhatsApp links, SEO tags and assets present` (nothing uses the new pieces yet).

- [ ] **Step 11: Commit**

```bash
git add src/app/globals.css src/app/layout.tsx src/lib/format.ts src/lib/format.test.ts src/components/Reveal.tsx src/components/CountUp.tsx
git commit -m "feat: add dark tokens, motion utilities and reveal helpers" -m "Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 2: Estimator pricing logic

**Files:**
- Create: `src/lib/estimate.ts`, `src/lib/estimate.test.ts`
- Modify: `src/content.ts` (append the `estimator` export; change nothing existing)

**Interfaces:**
- Consumes: `formatRinggit` from `@/lib/format`
- Produces, from `@/lib/estimate`:
  - `type NeedId = "website" | "store" | "custom" | "unsure"`
  - `type SizeId = "small" | "medium" | "large"`
  - `type PaymentId = "yes" | "no" | "unsure"`
  - `type TimelineId = "asap" | "soon" | "exploring"`
  - `type Answers = { need: NeedId; size: SizeId; payment: PaymentId; timeline: TimelineId }`
  - `type Estimate = { kind: "range"; low: number; high: number } | { kind: "tiers" }`
  - `estimateFor(answers: Answers): Estimate`
  - `estimateMessage(answers: Answers, estimate: Estimate): string`
- Produces, from `@/content`: `estimator` (see Step 3 for its exact shape)

- [ ] **Step 1: Write the failing pricing test**

Create `src/lib/estimate.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { estimateFor, estimateMessage, type Answers } from "./estimate";

const answers = (overrides: Partial<Answers> = {}): Answers => ({
  need: "store",
  size: "medium",
  payment: "yes",
  timeline: "soon",
  ...overrides,
});

describe("estimateFor", () => {
  it("prices a small business website at the published starting price", () => {
    expect(estimateFor(answers({ need: "website", size: "small", payment: "no", timeline: "soon" }))).toEqual({
      kind: "range",
      low: 2500,
      high: 3500,
    });
  });

  it("adds payment handling to a website only", () => {
    expect(estimateFor(answers({ need: "website", size: "small", payment: "yes", timeline: "soon" }))).toEqual({
      kind: "range",
      low: 4000,
      high: 5500,
    });
    expect(estimateFor(answers({ need: "store", size: "small", payment: "yes", timeline: "soon" }))).toEqual(
      estimateFor(answers({ need: "store", size: "small", payment: "no", timeline: "soon" })),
    );
  });

  it("scales with size", () => {
    expect(estimateFor(answers({ need: "store", size: "medium", payment: "yes", timeline: "soon" }))).toEqual({
      kind: "range",
      low: 10000,
      high: 13500,
    });
    // 8000 times 1.6 is 12800, which rounds down to 12500; 12500 times 1.35
    // is 16875, which rounds up to 17000.
    expect(estimateFor(answers({ need: "store", size: "large", payment: "yes", timeline: "soon" }))).toEqual({
      kind: "range",
      low: 12500,
      high: 17000,
    });
  });

  it("adds a rush premium for as soon as possible", () => {
    const rushed = estimateFor(answers({ need: "custom", size: "large", payment: "no", timeline: "asap" }));
    const relaxed = estimateFor(answers({ need: "custom", size: "large", payment: "no", timeline: "soon" }));
    expect(rushed.kind).toBe("range");
    expect(relaxed.kind).toBe("range");
    if (rushed.kind === "range" && relaxed.kind === "range") {
      expect(rushed.low).toBeGreaterThan(relaxed.low);
    }
  });

  it("never quotes below the published starting price", () => {
    for (const need of ["website", "store", "custom"] as const) {
      const result = estimateFor(answers({ need, size: "small", payment: "no", timeline: "exploring" }));
      const floors = { website: 2500, store: 8000, custom: 15000 };
      if (result.kind === "range") expect(result.low).toBeGreaterThanOrEqual(floors[need]);
    }
  });

  it("rounds to the nearest 500", () => {
    const result = estimateFor(answers({ need: "custom", size: "large", payment: "no", timeline: "asap" }));
    if (result.kind === "range") {
      expect(result.low % 500).toBe(0);
      expect(result.high % 500).toBe(0);
    }
  });

  it("shows the tiers instead of a range when the visitor is not sure", () => {
    expect(estimateFor(answers({ need: "unsure" }))).toEqual({ kind: "tiers" });
  });
});

describe("estimateMessage", () => {
  it("lists the answers and the range", () => {
    const given = answers({ need: "store", size: "medium", payment: "yes", timeline: "soon" });
    const message = estimateMessage(given, estimateFor(given));
    expect(message).toBe(
      [
        "Hi Mustafa, I used the estimator on your website.",
        "What I need: Online store or ordering system",
        "Size: 10 to 50 pages or products",
        "Online payment: Yes",
        "Timeline: In the next 1 to 3 months",
        "Estimate shown: RM10,000 to RM13,500",
      ].join("\n"),
    );
  });

  it("says so when the visitor is not sure what they need", () => {
    const given = answers({ need: "unsure" });
    const message = estimateMessage(given, estimateFor(given));
    expect(message).toContain("What I need: Not sure yet");
    expect(message).toContain("Estimate shown: not sure yet, I would like your advice");
  });

  it("contains no dash punctuation", () => {
    const given = answers();
    expect(estimateMessage(given, estimateFor(given))).not.toMatch(/[‒–—―]|\s-\s/);
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm test`
Expected: FAIL with `Failed to resolve import "./estimate"`.

- [ ] **Step 3: Add the estimator copy**

Append to `src/content.ts`, after the `labels` export. Change nothing above it.

```ts
export type EstimatorOption = { id: string; label: string };

export type EstimatorQuestion = { id: "need" | "size" | "payment" | "timeline"; label: string; options: EstimatorOption[] };

export const estimator = {
  eyebrow: "Quick estimate",
  heading: "What would your project cost?",
  intro:
    "Four quick questions and you get a range in about 20 seconds. You can send your answers straight to me on WhatsApp.",
  questions: [
    {
      id: "need",
      label: "What do you need?",
      options: [
        { id: "website", label: "Business website" },
        { id: "store", label: "Online store or ordering system" },
        { id: "custom", label: "Custom system for my business" },
        { id: "unsure", label: "Not sure yet" },
      ],
    },
    {
      id: "size",
      label: "Roughly how big is it?",
      options: [
        { id: "small", label: "Up to 10 pages or products" },
        { id: "medium", label: "10 to 50 pages or products" },
        { id: "large", label: "More than 50 pages or products" },
      ],
    },
    {
      id: "payment",
      label: "Do you need to take payments online?",
      options: [
        { id: "yes", label: "Yes" },
        { id: "no", label: "No" },
        { id: "unsure", label: "Not sure" },
      ],
    },
    {
      id: "timeline",
      label: "When do you want it live?",
      options: [
        { id: "asap", label: "As soon as possible" },
        { id: "soon", label: "In the next 1 to 3 months" },
        { id: "exploring", label: "Just exploring for now" },
      ],
    },
  ] as EstimatorQuestion[],
  result: {
    rangeTitle: "Your estimated range",
    tiersTitle: "Here is where my prices start",
    note: "This is an estimate, not a quote. Your real price comes after a free chat and a written proposal.",
    includesLabel: "Closest package",
    cta: "Send my answers on WhatsApp",
    restart: "Start again",
    back: "Back",
  },
  fallbackCta: "Rather just ask? Message me on WhatsApp",
  progressLabel: "Question",
  progressJoiner: "of",
};
```

- [ ] **Step 4: Implement the pricing**

Create `src/lib/estimate.ts`:

```ts
import { estimator } from "@/content";
import { formatRinggit } from "@/lib/format";

export type NeedId = "website" | "store" | "custom" | "unsure";
export type SizeId = "small" | "medium" | "large";
export type PaymentId = "yes" | "no" | "unsure";
export type TimelineId = "asap" | "soon" | "exploring";

export type Answers = {
  need: NeedId;
  size: SizeId;
  payment: PaymentId;
  timeline: TimelineId;
};

export type Estimate = { kind: "range"; low: number; high: number } | { kind: "tiers" };

const BASE: Record<Exclude<NeedId, "unsure">, number> = {
  website: 2500,
  store: 8000,
  custom: 15000,
};

const SIZE_MULTIPLIER: Record<SizeId, number> = {
  small: 1,
  medium: 1.25,
  large: 1.6,
};

const PAYMENT_ADDITION = 1500;
const RUSH_MULTIPLIER = 1.15;
const SPREAD = 1.35;
const STEP = 500;

const roundDown = (amount: number) => Math.floor(amount / STEP) * STEP;
const roundUp = (amount: number) => Math.ceil(amount / STEP) * STEP;

export function estimateFor(answers: Answers): Estimate {
  if (answers.need === "unsure") return { kind: "tiers" };

  const base = BASE[answers.need];
  let amount = base * SIZE_MULTIPLIER[answers.size];
  if (answers.need === "website" && answers.payment === "yes") amount += PAYMENT_ADDITION;
  if (answers.timeline === "asap") amount *= RUSH_MULTIPLIER;

  const low = Math.max(base, roundDown(amount));
  const high = roundUp(low * SPREAD);
  return { kind: "range", low, high };
}

function optionLabel(questionId: string, optionId: string): string {
  const question = estimator.questions.find((item) => item.id === questionId);
  return question?.options.find((option) => option.id === optionId)?.label ?? optionId;
}

export function estimateMessage(answers: Answers, estimate: Estimate): string {
  const shown =
    estimate.kind === "range"
      ? `${formatRinggit(estimate.low)} to ${formatRinggit(estimate.high)}`
      : "not sure yet, I would like your advice";

  return [
    "Hi Mustafa, I used the estimator on your website.",
    `What I need: ${optionLabel("need", answers.need)}`,
    `Size: ${optionLabel("size", answers.size)}`,
    `Online payment: ${optionLabel("payment", answers.payment)}`,
    `Timeline: ${optionLabel("timeline", answers.timeline)}`,
    `Estimate shown: ${shown}`,
  ].join("\n");
}
```

- [ ] **Step 5: Run the tests**

Run: `npm test`
Expected: PASS, 4 files, 25 tests (15 plus 10 new). If any case fails, fix the implementation to match the rules above, never the rules to match the code. If you believe a rule itself is wrong, stop and report it.

- [ ] **Step 6: Confirm the copy rules still hold**

Run: `npm test -- content`
Expected: PASS. The recursive scan in `src/content.test.ts` now also covers every new `estimator` string.

- [ ] **Step 7: Commit**

```bash
git add src/lib/estimate.ts src/lib/estimate.test.ts src/content.ts
git commit -m "feat: add estimator pricing rules and copy" -m "Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 3: Estimator section

**Files:**
- Create: `src/components/sections/Estimator.tsx`
- Modify: `src/app/page.tsx` (insert the section after `Services`), `scripts/verify-build.mjs` (section list and expected messages)

**Interfaces:**
- Consumes: `estimator`, `site`, `services` from `@/content`; `estimateFor`, `estimateMessage`, types from `@/lib/estimate`; `whatsappLink` from `@/lib/whatsapp`; `formatRinggit`, `parseRinggit` from `@/lib/format`; `Container`, `SectionHeading`, `Reveal`
- Produces: `<Estimator />` rendering `<section id="estimate">`, whose initial HTML contains one WhatsApp link carrying `site.defaultWhatsappMessage`

- [ ] **Step 1: Build the section**

Create `src/components/sections/Estimator.tsx`:

```tsx
"use client";

import { useState } from "react";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { estimator, services, site } from "@/content";
import { estimateFor, estimateMessage, type Answers } from "@/lib/estimate";
import { formatRinggit, parseRinggit } from "@/lib/format";
import { cn } from "@/lib/utils";

type PartialAnswers = Partial<Record<keyof Answers, string>>;

const NEED_TO_SERVICE: Record<string, string> = {
  website: "website",
  store: "store",
  custom: "custom",
};

export function Estimator() {
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState<PartialAnswers>({});

  const questions = estimator.questions;
  const finished = step >= questions.length;
  const answers = picked as Answers;
  const result = finished ? estimateFor(answers) : null;
  const closest = finished ? services.find((service) => service.id === NEED_TO_SERVICE[answers.need]) : undefined;

  const choose = (questionId: string, optionId: string) => {
    const next = { ...picked, [questionId]: optionId };
    setPicked(next);
    // "Not sure yet" cannot be priced, so skip straight to the result.
    setStep(questionId === "need" && optionId === "unsure" ? questions.length : step + 1);
  };

  const restart = () => {
    setPicked({});
    setStep(0);
  };

  return (
    <section id="estimate" className="py-16 sm:py-24">
      <Container>
        <SectionHeading eyebrow={estimator.eyebrow} heading={estimator.heading} intro={estimator.intro} />
        <Reveal className="mt-10 rounded-3xl bg-card p-6 card-soft sm:p-10">
          {!finished && (
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                {estimator.progressLabel} {step + 1} {estimator.progressJoiner} {questions.length}
              </p>
              <h3 className="mt-3 text-2xl font-bold sm:text-3xl">{questions[step].label}</h3>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {questions[step].options.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => choose(questions[step].id, option.id)}
                    className="rounded-2xl border border-border bg-background px-5 py-4 text-left text-base font-semibold transition hover:border-primary hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              {step > 0 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft className="size-4" aria-hidden />
                  {estimator.result.back}
                </button>
              )}
            </div>
          )}

          {finished && result && (
            <div>
              {result.kind === "range" ? (
                <>
                  <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary">
                    {estimator.result.rangeTitle}
                  </p>
                  <p className="mt-3 font-heading text-4xl font-extrabold text-primary sm:text-5xl">
                    {formatRinggit(result.low)} to {formatRinggit(result.high)}
                  </p>
                  {closest && (
                    <p className="mt-4 text-muted-foreground">
                      {estimator.result.includesLabel}: <span className="font-semibold text-foreground">{closest.name}</span>
                      {". "}
                      {closest.summary}
                    </p>
                  )}
                </>
              ) : (
                <>
                  <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary">
                    {estimator.result.tiersTitle}
                  </p>
                  <ul className="mt-4 grid gap-3 sm:grid-cols-3">
                    {services
                      .filter((service) => service.id !== "care")
                      .map((service) => (
                        <li key={service.id} className="rounded-2xl border border-border bg-background p-5">
                          <p className="font-semibold">{service.name}</p>
                          <p className="mt-1 font-heading text-2xl font-extrabold text-primary">
                            {formatRinggit(parseRinggit(service.price))}
                          </p>
                        </li>
                      ))}
                  </ul>
                </>
              )}

              <p className="mt-6 text-sm text-muted-foreground">{estimator.result.note}</p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <WhatsAppButton size="lg" message={estimateMessage(answers, result)} label={estimator.result.cta} />
                <button
                  type="button"
                  onClick={restart}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground"
                >
                  <RotateCcw className="size-4" aria-hidden />
                  {estimator.result.restart}
                </button>
              </div>
            </div>
          )}

          {!finished && (
            <p className="mt-8 border-t border-border pt-6 text-sm text-muted-foreground">
              <a
                href={whatsappLink(site.defaultWhatsappMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-primary underline-offset-4 hover:underline"
              >
                {estimator.fallbackCta}
              </a>
            </p>
          )}
        </Reveal>
      </Container>
    </section>
  );
}
```

The imports at the top of the file must include `import { whatsappLink } from "@/lib/whatsapp";`. Drop the `cn` import if nothing else in the file uses it, so lint stays clean.

This fallback link is what keeps the estimator useful without JavaScript, and it is the eighth WhatsApp link the build check expects.

- [ ] **Step 2: Add it to the page**

In `src/app/page.tsx`, add `import { Estimator } from "@/components/sections/Estimator";` with the other section imports, and place `<Estimator />` directly after `<Services />` and before `<Work />`.

- [ ] **Step 3: Update the build checks**

In `scripts/verify-build.mjs`:
- Change the `SECTIONS` array to `["hero", "problems", "services", "estimate", "work", "process", "about", "faq", "contact"]`.
- In `EXPECTED_WHATSAPP_MESSAGES`, add one `DEFAULT_MESSAGE, // estimator fallback` line directly after the monthly care plan line and before the `// contact` line.

- [ ] **Step 4: Verify**

Run: `npm test && npm run lint && npm run build && npm run verify`
Expected: tests pass, lint clean, and verify prints `PASS: 9 sections, 8 WhatsApp links, SEO tags and assets present`.

- [ ] **Step 5: Check it by hand**

Start `npx serve@14 out -l 4173` in the background, then with Playwright (see `scripts/capture-work.mjs` for the launch pattern) click through: choose "Business website", "Up to 10 pages or products", "No", "In the next 1 to 3 months" and screenshot the result into `.qa/estimator-result.png`. Open it with the Read tool and confirm it shows RM2,500 to RM3,500, the closest package line, the note, and the WhatsApp button. Then check the "Not sure yet" path shows three starting prices. Stop the server with `lsof -ti:4173 | xargs kill`.

- [ ] **Step 6: Commit**

```bash
git add src/components/sections/Estimator.tsx src/app/page.tsx scripts/verify-build.mjs
git commit -m "feat: add the price estimator section" -m "Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 4: Dark hero, entrance motion and the sliding sticky bar

**Files:**
- Modify: `src/components/sections/Hero.tsx` (full replacement), `src/components/StickyWhatsApp.tsx` (full replacement), `src/content.ts` (add `hero.headlineHighlight`)

**Interfaces:**
- Consumes: `hero`, `site` from `@/content`; `Container`, `WhatsAppButton`, `buttonVariants`, `cn`
- Produces: `<Hero />` rendering `<section id="hero">` on the ink ground; `<StickyWhatsApp />` that hides itself while `#hero` is on screen

- [ ] **Step 1: Add the highlight phrase**

In `src/content.ts`, inside the `hero` object, after the `headline` line, add:

```ts
  headlineHighlight: "ordering systems",
```

This is a slice of the existing headline, used to colour that phrase. The headline string itself does not change.

- [ ] **Step 2: Rewrite the hero**

Replace `src/components/sections/Hero.tsx` with:

```tsx
import Image from "next/image";
import { Container } from "@/components/Container";
import { buttonVariants } from "@/components/ui/button";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { hero, site } from "@/content";
import { cn } from "@/lib/utils";

function Headline() {
  const [before, after] = hero.headline.split(hero.headlineHighlight);
  if (after === undefined) return <>{hero.headline}</>;
  return (
    <>
      {before}
      <span className="text-gradient-ember">{hero.headlineHighlight}</span>
      {after}
    </>
  );
}

export function Hero() {
  return (
    <section id="hero" className="relative overflow-hidden bg-ink text-ink-foreground">
      <div className="pointer-events-none absolute inset-0 dot-grid opacity-70" aria-hidden />
      <div
        className="pointer-events-none absolute -top-24 right-[-10%] h-[36rem] w-[36rem] glow-crimson animate-drift blur-2xl"
        aria-hidden
      />
      <Container className="relative grid items-center gap-8 pb-20 pt-12 sm:pb-28 sm:pt-20 md:grid-cols-[1.15fr_0.85fr] md:gap-14">
        <div className="order-2 md:order-1">
          <p className="hero-item text-sm font-semibold uppercase tracking-[0.14em] text-ink-accent">{hero.eyebrow}</p>
          <h1 className="hero-item mt-4 text-4xl font-extrabold leading-[1.05] sm:text-5xl lg:text-6xl">
            <Headline />
          </h1>
          <p className="hero-item mt-6 max-w-xl text-lg leading-relaxed text-ink-muted">{hero.subheadline}</p>
          <div className="hero-item mt-8 flex flex-wrap gap-3">
            <WhatsAppButton
              size="lg"
              message={site.defaultWhatsappMessage}
              label={hero.primaryCta}
              className="hidden md:inline-flex"
            />
            <a
              href="#work"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "h-13 rounded-full border-ink-border bg-transparent px-7 text-base text-ink-foreground hover:bg-white/10 hover:text-ink-foreground",
              )}
            >
              {hero.secondaryCta}
            </a>
          </div>
        </div>
        <div className="order-1 md:order-2">
          <div className="relative mx-auto w-full max-w-72 sm:max-w-sm md:max-w-none">
            <div className="pointer-events-none absolute -inset-6 glow-crimson blur-xl" aria-hidden />
            <Image
              src="/mustafa.webp"
              alt={hero.photoAlt}
              width={800}
              height={800}
              loading="eager"
              fetchPriority="high"
              sizes="(min-width: 768px) 40vw, 18rem"
              className="relative aspect-square w-full rounded-3xl object-cover shadow-2xl ring-1 ring-white/10 animate-float"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
```

- [ ] **Step 3: Make the sticky bar slide in**

Replace `src/components/StickyWhatsApp.tsx` with:

```tsx
"use client";

import { useEffect, useState } from "react";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { hero, site } from "@/content";
import { cn } from "@/lib/utils";

export function StickyWhatsApp() {
  // Visible by default, so a no-script visit still gets the button.
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const heroSection = document.getElementById("hero");
    if (!heroSection || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) setHidden(entry.isIntersecting);
      },
      { threshold: 0.35 },
    );
    observer.observe(heroSection);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-50 border-t bg-background/95 p-3 backdrop-blur transition-transform duration-300 ease-out-soft md:hidden",
        hidden && "translate-y-full",
      )}
    >
      <WhatsAppButton className="w-full" size="lg" message={site.defaultWhatsappMessage} label={hero.primaryCta} />
    </div>
  );
}
```

- [ ] **Step 4: Verify**

Run: `npm test && npm run lint && npm run build && npm run verify`
Expected: tests pass, lint clean, verify prints `PASS: 9 sections, 8 WhatsApp links, SEO tags and assets present`.

- [ ] **Step 5: Look at it**

Serve `out/` on port 4173 and capture with Playwright (mobile context 400x900 `isMobile: true`, and desktop 1440x900): `.qa/hero-mobile.png`, `.qa/hero-desktop.png`. Open both with the Read tool. Confirm: dark warm background, the crimson glow behind the photo, "ordering systems" in a lighter crimson gradient, the eyebrow readable against the dark, and on mobile no green button inside the hero. Scroll the mobile page 900px and capture `.qa/sticky-after-scroll.png` to confirm the bar is present after the hero. Stop the server.

- [ ] **Step 6: Commit**

```bash
git add src/components/sections/Hero.tsx src/components/StickyWhatsApp.tsx src/content.ts
git commit -m "feat: dark hero with entrance motion and a sliding sticky bar" -m "Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 5: Alternating work section with tappable app screens

**Files:**
- Create: `src/components/AppGallery.tsx`
- Modify: `src/components/sections/Work.tsx` (full replacement), `src/content.ts` (`WorkItem.screens`), `src/components/PhoneFrame.tsx` (accept children)

**Interfaces:**
- Consumes: `work`, `sectionCopy`, `labels` from `@/content`; `Reveal`, `Container`, `SectionHeading`, `PhoneFrame`
- Produces: `<AppGallery name: string screens: { src: string; alt: string }[] />`; `WorkItem.screens?: { src: string; alt: string }[]`

- [ ] **Step 1: Let the phone frame wrap anything**

Replace `src/components/PhoneFrame.tsx` with:

```tsx
import Image from "next/image";
import type { ReactNode } from "react";

type Props = { src?: string; alt?: string; children?: ReactNode };

export function PhoneFrame({ src, alt, children }: Props) {
  return (
    <div className="overflow-hidden rounded-[1.6rem] border-[6px] border-foreground bg-foreground shadow-lg">
      {children ?? (
        <Image
          src={src ?? ""}
          alt={alt ?? ""}
          width={390}
          height={844}
          sizes="14rem"
          className="aspect-[390/844] w-full rounded-[1.1rem] object-cover object-top"
        />
      )}
    </div>
  );
}
```

- [ ] **Step 2: Add the screens field**

In `src/content.ts`, add `screens?: { src: string; alt: string }[];` to the `WorkItem` type, after `stack: string[];`. Do not add screens to any item yet: Mustafa is supplying them, and every item must keep working without them.

- [ ] **Step 3: Build the gallery**

Create `src/components/AppGallery.tsx`:

```tsx
"use client";

import Image from "next/image";
import { useRef, useState } from "react";

type Screen = { src: string; alt: string };

type Props = { name: string; screens: Screen[] };

export function AppGallery({ name, screens }: Props) {
  const [index, setIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const go = (next: number) => setIndex(Math.max(0, Math.min(screens.length - 1, next)));

  return (
    <div
      role="group"
      aria-roledescription="carousel"
      aria-label={`${name} screens`}
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "ArrowRight") go(index + 1);
        if (event.key === "ArrowLeft") go(index - 1);
      }}
      onTouchStart={(event) => {
        touchStartX.current = event.touches[0].clientX;
      }}
      onTouchEnd={(event) => {
        const start = touchStartX.current;
        if (start === null) return;
        const delta = event.changedTouches[0].clientX - start;
        if (Math.abs(delta) > 40) go(delta < 0 ? index + 1 : index - 1);
        touchStartX.current = null;
      }}
      className="rounded-[1.1rem] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
    >
      <div className="relative aspect-[390/844] w-full overflow-hidden rounded-[1.1rem]">
        {screens.map((screen, i) => (
          <Image
            key={screen.src}
            src={screen.src}
            alt={screen.alt}
            width={390}
            height={844}
            sizes="14rem"
            loading={i === 0 ? "eager" : "lazy"}
            className={`absolute inset-0 size-full object-cover object-top transition-opacity duration-300 ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
            aria-hidden={i !== index}
          />
        ))}
      </div>
      {screens.length > 1 && (
        <div className="flex items-center justify-center gap-2 bg-foreground py-2">
          {screens.map((screen, i) => (
            <button
              key={screen.src}
              type="button"
              onClick={() => go(i)}
              aria-label={`${name} screen ${i + 1} of ${screens.length}`}
              aria-current={i === index}
              className={`size-2 rounded-full transition ${i === index ? "bg-background" : "bg-background/40"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Rewrite the work section**

Replace `src/components/sections/Work.tsx` with:

```tsx
import { ArrowUpRight } from "lucide-react";
import { AppGallery } from "@/components/AppGallery";
import { Container } from "@/components/Container";
import { PhoneFrame } from "@/components/PhoneFrame";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { labels, sectionCopy, work } from "@/content";

export function Work() {
  return (
    <section id="work" className="border-y bg-card py-16 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow={sectionCopy.work.eyebrow}
          heading={sectionCopy.work.heading}
          intro={sectionCopy.work.intro}
        />
        <div className="mt-14 space-y-16 sm:space-y-24">
          {work.map((item, i) => (
            <Reveal
              as="article"
              key={item.name}
              className="grid items-center gap-8 md:grid-cols-2 md:gap-14"
            >
              <div className={`mx-auto w-full max-w-56 tilt-on-scroll ${i % 2 === 1 ? "md:order-2" : ""}`}>
                <PhoneFrame src={item.image} alt={`${item.name} app screenshot`}>
                  {item.screens && item.screens.length > 0 ? (
                    <AppGallery name={item.name} screens={item.screens} />
                  ) : undefined}
                </PhoneFrame>
              </div>
              <div className={i % 2 === 1 ? "md:order-1" : ""}>
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary">{item.tagline}</p>
                <h3 className="mt-2 text-3xl font-bold">{item.name}</h3>
                <p className="mt-4 leading-relaxed text-muted-foreground">
                  <span className="font-semibold text-foreground">{labels.workProblem} </span>
                  {item.problem}
                </p>
                <p className="mt-2 leading-relaxed text-muted-foreground">
                  <span className="font-semibold text-foreground">{labels.workBuilt} </span>
                  {item.built}
                </p>
                <ul className="mt-5 flex flex-wrap gap-2">
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
                  className="mt-5 inline-flex items-center gap-1 font-semibold text-primary underline-offset-4 hover:underline"
                >
                  {labels.workOpen} {item.name}
                  <ArrowUpRight className="size-4" aria-hidden />
                </a>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
```

- [ ] **Step 5: Verify**

Run: `npm test && npm run lint && npm run build && npm run verify`
Expected: tests pass, lint clean, verify prints `PASS: 9 sections, 8 WhatsApp links, SEO tags and assets present`.

- [ ] **Step 6: Prove the gallery works before the real screens arrive**

Temporarily add to the KiraPoket item in `src/content.ts`:

```ts
    screens: [
      { src: "/work/kirapoket.webp", alt: "KiraPoket screen 1" },
      { src: "/work/marisolat.webp", alt: "KiraPoket screen 2" },
    ],
```

Rebuild, serve `out/` on 4173, and with Playwright (mobile context) tap the second dot, screenshot `.qa/gallery.png`, and confirm with the Read tool that the second image is showing. Then check the dots are reachable by keyboard (focus the group, press ArrowRight). **Revert the temporary edit with `git checkout src/content.ts` and rebuild** before committing. Record both screenshots and the revert in your report.

- [ ] **Step 7: Commit**

```bash
git add src/components/AppGallery.tsx src/components/PhoneFrame.tsx src/components/sections/Work.tsx src/content.ts
git commit -m "feat: alternating work layout with tappable app screens" -m "Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 6: Remaining sections: depth, counting prices, timeline, dark closing panel

**Files:**
- Modify: `src/components/sections/Problems.tsx`, `Services.tsx`, `Process.tsx`, `About.tsx`, `Faq.tsx`, `Contact.tsx` (each a full replacement of its section body)

**Interfaces:**
- Consumes: `Reveal`, `CountUp`, `parseRinggit`, plus the content each section already uses
- Produces: no new exports

- [ ] **Step 1: Problems**

In `src/components/sections/Problems.tsx`: import `Reveal`, change the card `<article>` to `<Reveal as="article" ... delayMs={i * 60}>`, and replace the card classes `rounded-2xl border bg-background p-6` with `rounded-2xl bg-background p-6 card-soft card-hover`.

- [ ] **Step 2: Services**

Replace `src/components/sections/Services.tsx` with:

```tsx
import { Check } from "lucide-react";
import { Container } from "@/components/Container";
import { CountUp } from "@/components/CountUp";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { labels, sectionCopy, services } from "@/content";
import { parseRinggit } from "@/lib/format";
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
          {services.map((service, i) => (
            <Reveal
              as="article"
              key={service.id}
              delayMs={i * 60}
              className={cn(
                "flex flex-col rounded-2xl bg-card p-6 card-soft card-hover sm:p-8",
                service.featured && "ring-2 ring-primary shadow-[0_24px_60px_-28px_rgba(158,27,36,0.65)]",
              )}
            >
              {service.badge && (
                <p className="mb-3 w-fit rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
                  {service.badge}
                </p>
              )}
              <h3 className="text-xl font-bold">{service.name}</h3>
              <p className="mt-2 leading-relaxed text-muted-foreground">{service.summary}</p>
              <p className="mt-6 text-sm text-muted-foreground">{labels.priceFrom}</p>
              <p className="font-heading text-4xl font-extrabold text-primary">
                <CountUp value={parseRinggit(service.price)} />
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
                <WhatsAppButton className="w-full" message={service.whatsappMessage} label={labels.serviceCta} />
              </div>
            </Reveal>
          ))}
        </div>
        <p className="mt-8 max-w-3xl text-sm text-muted-foreground">{sectionCopy.services.note}</p>
      </Container>
    </section>
  );
}
```

The card keeps `flex flex-col` so the WhatsApp button still sits at the bottom of every card.

- [ ] **Step 3: Process as a timeline**

Replace the `<ol>` and its items in `src/components/sections/Process.tsx` with:

```tsx
        <ol className="relative mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <span
            className="pointer-events-none absolute left-5 top-5 hidden h-px w-[calc(100%-2.5rem)] bg-gradient-to-r from-primary/60 to-primary/10 lg:block"
            aria-hidden
          />
          {processSteps.map((step, i) => (
            <Reveal as="li" key={step.title} delayMs={i * 80} className="relative">
              <span className="relative z-10 flex size-10 items-center justify-center rounded-full bg-primary font-heading font-bold text-primary-foreground shadow-[0_8px_20px_-8px_rgba(158,27,36,0.8)]">
                {i + 1}
              </span>
              <h3 className="mt-4 text-lg font-bold">{step.title}</h3>
              <p className="mt-2 leading-relaxed text-muted-foreground">{step.body}</p>
            </Reveal>
          ))}
        </ol>
```

Import `Reveal`. Remove the old card classes (`rounded-2xl border bg-card p-6`): the timeline steps sit directly on the ground.

- [ ] **Step 4: About**

In `src/components/sections/About.tsx`, wrap the text column in `<Reveal>` and add `delayMs={80}`. Leave the heading and copy as they are.

- [ ] **Step 5: FAQ**

In `src/components/sections/Faq.tsx`, wrap the `<p>` inside each `<details>` in a `<div className="faq-body">`, so the answer fades and slides when it opens:

```tsx
              <div className="faq-body">
                <p className="mt-3 leading-relaxed text-muted-foreground">{faq.answer}</p>
              </div>
```

Keep the native `<details>` and `<summary>` exactly as they are, so answers stay in the static HTML.

- [ ] **Step 6: Dark closing panel**

Replace `src/components/sections/Contact.tsx` with:

```tsx
import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { contact, hero, site } from "@/content";

export function Contact() {
  return (
    <section id="contact" className="pb-16 sm:pb-24">
      <Container>
        <Reveal className="relative overflow-hidden rounded-3xl bg-ink px-6 py-12 text-ink-foreground sm:px-12 sm:py-16">
          <div className="pointer-events-none absolute inset-0 dot-grid opacity-60" aria-hidden />
          <div
            className="pointer-events-none absolute -bottom-40 left-[-10%] h-[28rem] w-[28rem] glow-crimson blur-2xl"
            aria-hidden
          />
          <div className="relative">
            <h2 className="max-w-2xl text-3xl font-bold sm:text-5xl">{contact.heading}</h2>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-ink-muted">{contact.body}</p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
              <WhatsAppButton size="lg" message={site.defaultWhatsappMessage} label={hero.primaryCta} />
              <p className="text-ink-muted">
                {contact.emailLabel}{" "}
                <a
                  href={`mailto:${site.email}`}
                  className="font-semibold text-ink-foreground underline underline-offset-4"
                >
                  {site.email}
                </a>
              </p>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
```

- [ ] **Step 7: Bigger, quieter section headings**

Replace `src/components/SectionHeading.tsx` with:

```tsx
import { cn } from "@/lib/utils";

type Props = { eyebrow: string; heading: string; intro?: string; className?: string };

export function SectionHeading({ eyebrow, heading, intro, className }: Props) {
  return (
    <div className={cn("max-w-2xl", className)}>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{eyebrow}</p>
      <h2 className="mt-4 text-3xl font-bold leading-[1.1] sm:text-4xl lg:text-5xl">{heading}</h2>
      {intro && <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{intro}</p>}
    </div>
  );
}
```

This keeps the same props, so every section that uses it is unaffected.

- [ ] **Step 8: Verify**

Run: `npm test && npm run lint && npm run build && npm run verify`
Expected: tests pass, lint clean, verify prints `PASS: 9 sections, 8 WhatsApp links, SEO tags and assets present`.

- [ ] **Step 9: Commit**

```bash
git add src/components/sections src/components/SectionHeading.tsx
git commit -m "feat: depth, counting prices, process timeline and dark closing panel" -m "Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 7: Full QA pass

**Files:**
- Modify: only what the checks below prove is broken
- Output (git-ignored): `.qa/*.png`, `.qa/lighthouse.json`

**Interfaces:**
- Consumes: the built `out/`
- Produces: evidence for Mustafa's review

- [ ] **Step 1: Serve the final build**

Run `npm run build`, then start `npx serve@14 out -l 4173` in the background. Confirm `curl -s -o /dev/null -w "%{http_code}" http://localhost:4173` prints 200.

- [ ] **Step 2: Capture the page properly**

Create `.qa/shots.mjs` (git-ignored, not committed) using `playwright-core` with `channel: "chrome"`, following `scripts/capture-work.mjs`. For each of a mobile context (400x900, `isMobile: true`, `hasTouch: true`) and a desktop context (1440x900):
- `await page.goto("http://localhost:4173", { waitUntil: "load" })`
- **Scroll the whole page in steps to trigger lazy images**, then scroll back to the top: `await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 120)); } window.scrollTo(0, 0); })`
- `await page.waitForTimeout(1200)`
- Screenshot `.qa/<mobile|desktop>-first-screen.png` and `.qa/<mobile|desktop>.png` with `fullPage: true`
- Log `document.documentElement.scrollWidth`

Open all four images with the Read tool. Confirm every one of these and record a PASS or FAIL with one line each:
- Mobile layout width is exactly 400, no horizontal overflow
- The four phone frames show real screenshots, not black rectangles (this was suspect in the 2026-09-16 capture)
- Hero reads well on the dark ground, glow visible, gradient phrase legible
- Services cards show prices and the featured card stands out
- The estimator shows question 1 and its fallback WhatsApp link
- Process reads as a timeline
- The closing panel is dark with a glow
- The sticky bar is absent over the hero and present further down

- [ ] **Step 3: Lighthouse**

```bash
npx lighthouse@12 http://localhost:4173 --form-factor=mobile --only-categories=performance,accessibility,seo --output=json --output-path=.qa/lighthouse.json --chrome-flags="--headless=new" --quiet
node -e 'const r=require("./.qa/lighthouse.json");for(const c of Object.values(r.categories))console.log(c.title,Math.round(c.score*100));for(const a of Object.values(r.audits))if(a.score!==null&&a.score<0.9&&a.details)console.log(" -",a.id,":",a.title)'
```

Expected: Performance, Accessibility and SEO each 90 or higher. Fix any failing audit that lives in the code. If Performance drops below 90 only because of local `serve` limits (no compression, no HTTP/2), record the audits and say so rather than contorting the code.

- [ ] **Step 4: Reduced motion, keyboard and no script**

With Playwright:
- `browser.newContext({ reducedMotion: "reduce" })`: load the page, screenshot `.qa/reduced-motion.png`, and confirm every section is visible with no blank gaps.
- Keyboard: from the top of the page, press Tab repeatedly and confirm you can reach the hero link, the estimator options, the gallery group and the WhatsApp buttons, each with a visible focus ring. Screenshot one focused state as `.qa/focus.png`.
- `browser.newContext({ javaScriptEnabled: false })`: load the page, screenshot `.qa/no-js.png` full page, and confirm every section is readable, the sticky bar is present, and the estimator shows its questions and its fallback WhatsApp link.

Record each result in the report.

- [ ] **Step 5: Fix what the checks found**

Fix only real defects the evidence shows. Do not change approved copy. Re-run `npm test && npm run lint && npm run build && npm run verify` after each fix, and retake the affected screenshot.

- [ ] **Step 6: Stop the server and commit any fixes**

```bash
lsof -ti:4173 | xargs kill
git add -A
git commit -m "fix: address visual refresh QA findings" -m "Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

Skip the commit if nothing changed.

- [ ] **Step 7: Hand back to the controller**

Report the Lighthouse scores, the checklist, and anything you judged worth Mustafa's attention but did not change. The controller shows him the screenshots; deploy and the GitHub push stay blocked on his approval.
