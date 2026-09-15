# mustafasyahmi.web.app: Freelance Portfolio Site Design

Date: 2026-09-15
Status: Approved in brainstorming, awaiting spec review

## Goal

A one-page site that turns Malaysian SME owners who hear about Mustafa (Threads, referrals, WhatsApp shares) into WhatsApp conversations about paid projects. It builds credibility and filters out low-budget enquiries. It is not expected to generate leads from search on its own.

## Decisions

| Topic | Decision |
|---|---|
| Target client | Malaysian SMEs (F&B, retail, services) |
| Language | English only |
| Pricing display | "From RM X" per service |
| Primary CTA | WhatsApp `wa.me/60193934247` with a pre-filled message per button |
| Secondary contact | mussyahmi31@gmail.com |
| Stack | Next.js 16 App Router, TypeScript, Tailwind 4, shadcn, static export |
| Hosting | New Firebase project `mustafasyahmi`, Hosting only |
| URL | `mustafasyahmi.web.app` (custom domain later, out of scope) |
| Theme | Light only |

## Content Rules

- No dash punctuation (em dash, en dash, spaced hyphen) anywhere in visible copy.
- No claims beyond verified evidence. Do not say "13 apps". Do not mention GetLokal until it is publicly live.
- Short paragraphs. Written for an owner skimming on a phone, in business terms, not tech terms.

## Page Structure (single page, in order)

1. **Hero.** Photo beside the headline (above it on mobile). Headline: "I build websites and ordering systems for Malaysian businesses." Supporting line: senior software engineer, 5+ years building payment and financial systems. Buttons: "WhatsApp me" (primary), "See my work" (scrolls to Work).
2. **Problems I solve.** Three cards:
   - Taking orders over WhatsApp is chaos
   - Paying marketplace commission on every sale
   - Spreadsheets that do not add up
3. **Services and pricing.** Four cards, each with inclusions and its own pre-filled WhatsApp button:
   - Business website, from RM2,500: up to 5 pages, mobile friendly, WhatsApp button, Google basics
   - Online store or ordering system, from RM8,000: catalogue, cart, FPX payment, receipts, admin panel
   - Custom web app or system, from RM15,000: bookings, agents, dashboards, PWA
   - Monthly care plan, from RM300/month: hosting, bug fixes, small changes
4. **Selected work.** KiraPoket, MariSolat, KadHariLahir, LukisLukis. Each: phone-framed screenshot, problem, what was built, live link. All four verified returning HTTP 200 on 2026-09-15.
5. **How it works.** Free chat, written proposal with fixed price, build in phases (30% upfront, 70% on delivery per phase), launch with 30 days free bug fixing.
6. **About.** Short bio, GitHub link (`github.com/mussyahmi`).
7. **FAQ.** Do I own the code? Can you integrate FPX? How long does it take? What if I need changes later? Do you work outside Klang Valley? Do you handle hosting?
8. **Final CTA and footer.** WhatsApp button, email, copyright.

Mobile: a sticky WhatsApp button pinned to the bottom of the viewport.

## Visual Design

- Palette derived from the portrait photo:
  - Accent: deep crimson, around `#9e1b24`, used sparingly (buttons, links, key figures)
  - Background: warm off-white paper tone
  - Text: near-black ink
  - WhatsApp buttons: WhatsApp green, overriding the accent
- Type: Plus Jakarta Sans for headings, Inter for body, both via `next/font/google`.
- Mobile first, designed at ~400px before desktop.
- Photo source: `~/Library/Mobile Documents/com~apple~CloudDocs/Downloads/IMG_6867.jpg`, converted to WebP (about 800px) in `public/`.
- Work screenshots captured from live sites with headless Chrome, converted to WebP, committed to `public/work/`.

## Architecture

```
mustafasyahmi/
  src/
    content.ts          all copy, prices, work items, FAQ, contact details
    lib/whatsapp.ts     whatsappLink(message): builds wa.me URL with encoded text
    app/
      layout.tsx        fonts, metadata, Open Graph, JSON-LD
      page.tsx          composes sections
      sitemap.ts
      robots.ts
    components/sections/
      Hero.tsx  Problems.tsx  Services.tsx  Work.tsx
      Process.tsx  About.tsx  Faq.tsx  Contact.tsx
    components/StickyWhatsApp.tsx
  public/               photo, work screenshots, og image
  scripts/screenshots   headless Chrome capture script
  firebase.json         hosting: public "out", cleanUrls, cache headers
  .firebaserc
```

- `next.config` uses `output: 'export'` and `images.unoptimized: true`.
- Components read only from `content.ts`. Changing a price or adding a project never requires touching a component.
- No server, database, auth, or `frameworksBackend`.

## SEO

- Title and description targeting "freelance web developer Malaysia" and "online ordering system Malaysia".
- Open Graph image (photo plus headline) for WhatsApp and Threads link previews.
- JSON-LD `ProfessionalService` schema.
- `sitemap.xml` and `robots.txt`.

## Out of Scope

Analytics, contact form, blog, individual case study pages, custom domain, dark mode, Bahasa Melayu version.

## Verification

- `next build` passes with no errors or type errors.
- Lighthouse mobile: Performance, Accessibility, SEO each 90 or higher.
- Headless Chrome screenshots at 400px and 1440px reviewed by Mustafa.
- Every WhatsApp button opens `wa.me/60193934247` with the correct pre-filled message.
- Copy scanned for dash punctuation.
- After deploy, `https://mustafasyahmi.web.app` returns HTTP 200.

## Approval Checkpoints

Ask Mustafa before each of:
1. Creating the Firebase project (if ID `mustafasyahmi` is taken, stop and ask, since it changes the URL)
2. First deploy
3. Pushing to GitHub, and whether the repo is public or private
