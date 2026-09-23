# Visual Refresh and Interactivity Design

Date: 2026-09-23
Status: Approved in brainstorming, awaiting spec review
Supersedes the visual sections of `2026-09-15-portfolio-site-design.md`. Everything that spec says about audience, copy rules, prices, hosting and verification still stands unless contradicted here.

## Why

The built site works and scores well, but Mustafa's verdict on 2026-09-23 was that it "looks and feels plain". Diagnosis: every section uses the same rhythm (small crimson label, heading, row of thin bordered cards on one cream ground), there is no depth, no motion, and nothing a visitor can interact with. For a developer selling his ability to build software, the site itself is the portfolio piece, so it has to demonstrate craft, not just describe it.

## Decisions

| Topic | Decision |
|---|---|
| Style direction | Modern product site (Linear or Stripe family): dark glowing hero, frosted depth, gradient accents, smooth scroll motion |
| Dark extent | Hero and final call to action only; the middle of the page stays light |
| Motion | Reveal on scroll, hero entrance, card hover lift, counting prices, tilting phone frames, smooth FAQ, sliding sticky bar |
| Interactive pieces | Price estimator with WhatsApp handoff; tappable app screen galleries |
| Implementation | Tailwind plus small custom CSS, three client components, no animation library |
| App screens | Mustafa supplies 3 or 4 phone screenshots for all four apps; the gallery falls back to the existing single screenshot until they arrive |
| Copy | Unchanged. All existing strings in `src/content.ts` stay as approved. New strings follow the same rules. |

## Unchanged Constraints

- Audience: Malaysian SME owners, mostly arriving on phones from Threads or WhatsApp. English only.
- No dash punctuation in any visible copy. Never mention GetLokal. No claims the repos do not support.
- Palette stays crimson `#9e1b24`, warm off-white `#faf6f0`, ink `#1a1714`, WhatsApp green `#25d366` with dark text. The refresh adds dark surface tokens and one crimson gradient derived from the existing accent. No new hues.
- Prices unchanged: website from RM2,500, store or ordering system from RM8,000, custom from RM15,000, care plan from RM300 a month.
- Static export to Firebase Hosting. No server, no database, no analytics, no tracking, no third party embeds.
- Lighthouse mobile: Performance, Accessibility and SEO each 90 or higher.
- Mobile first at 400px, no horizontal overflow.
- The page must remain fully readable and usable with JavaScript disabled or still loading, and with `prefers-reduced-motion: reduce`.

## Look

**Dark sections (hero, final call to action).**
- Ground: warm near black `#141110`, not pure black, so it sits in the same warm family as the cream.
- A crimson radial glow behind the portrait and behind the closing WhatsApp button, plus a faint dot grid at low opacity.
- Headline in `#f7f3ee`; the eyebrow label in a lightened crimson `#e4606a` for contrast on dark (the base crimson fails contrast on near black).
- The portrait gets a soft crimson edge glow and larger corner radius.

**Light sections (everything between).**
- Cream ground unchanged. Cards lose the thin border and gain layered soft shadows, slightly larger radius and more padding.
- The featured service card keeps its crimson outline, upgraded to a crimson gradient edge.

**Type.**
- Headlines larger and tighter: hero up to `clamp(2.5rem, 7vw, 4.5rem)`, section headings up from `text-3xl/4xl`.
- One key phrase per page (the hero's "ordering systems") carries a crimson gradient fill.
- Eyebrow labels smaller, wider tracking, crimson.

**Section rhythm.** The uniform label plus heading plus card row repeats too often. Changes:
- Work becomes a wider alternating layout, screenshot left then right, with more breathing room.
- Process becomes a connected timeline (a line linking the four numbered steps) rather than four identical boxes.
- FAQ narrows into a quieter single column.
- Problems, Services and About keep their current structure with the new card treatment.

## Motion

All motion uses `transform` and `opacity` only. Durations 200ms to 700ms, easing `cubic-bezier(0.22, 1, 0.36, 1)`.

| Element | Behaviour |
|---|---|
| Section reveal | Fade in and rise 16px when 15% visible, children staggered 60ms, once per element |
| Hero entrance | Eyebrow, headline lines, paragraph and buttons rise in sequence on load |
| Hero glow | Slow continuous drift, 12s loop |
| Portrait | Very subtle float, 6s loop |
| Cards | Hover on pointer devices: lift 4px, shadow deepens, 200ms. Touch: press state only |
| Prices | Count up from 0 to the real figure over 900ms when scrolled into view, formatted with the thousands separator |
| Phone frames | Tilt and shift slightly with scroll position, capped at a few degrees |
| FAQ | Height animates open and closed; the plus icon rotates 45 degrees |
| Sticky WhatsApp bar | Slides up once the hero leaves the viewport instead of being present at first paint |
| WhatsApp buttons | One soft pulse when first revealed, then still |

`prefers-reduced-motion: reduce` disables every animation and transition above, including the counters (which render their final value immediately) and the sticky bar slide (which appears without animation). Nothing is hidden behind an animation: revealed elements are visible by default and animate only when the reveal helper is active, so a failed script or disabled JavaScript leaves the page fully readable.

## Interactive Piece 1: Price Estimator

A new section with id `estimate`, placed directly after `services`.

**Questions** (one screen at a time, with a progress indicator and a back control):
1. What do you need? Business website / Online store or ordering system / Custom system / Not sure yet
2. Roughly how big? Up to 10 pages or products / 10 to 50 / More than 50
3. Do you need to take payments online? Yes / No / Not sure
4. When do you want it live? As soon as possible / In the next 1 to 3 months / Just exploring

**Result:** an estimated range, what it includes, and the line that the real price comes after a free chat and a written proposal. "Not sure yet" on question 1 shows the three starting prices instead of a range and still offers the WhatsApp handoff.

**Calculation** (pure function, unit tested):
- Base: website 2500, store 8000, custom 15000
- Size multiplier: up to 10 is 1.0, 10 to 50 is 1.25, more than 50 is 1.6
- Payments: adds 1500 to the website base only (the other tiers already include payment)
- Timeline: "as soon as possible" multiplies by 1.15, otherwise 1.0
- Low = base adjusted as above, rounded down to the nearest 500. High = low times 1.35, rounded up to the nearest 500. Low can never fall below the tier's published starting price.

**Handoff:** a WhatsApp link whose message is built from the answers, for example:

```
Hi Mustafa, I used the estimator on your website.
What I need: Online store or ordering system
Size: 10 to 50 products or pages
Online payment: Yes
Timeline: In the next 1 to 3 months
Estimate shown: RM10,000 to RM13,500
```

Before any answer is chosen, the link carries the site's default message, so the static HTML always contains a valid WhatsApp link. Nothing is stored, and no answers leave the visitor's browser except in the message they choose to send.

## Interactive Piece 2: Tappable App Screens

Each work item gains an optional `screens` array (`{ src, alt }`). The phone frame becomes a gallery:
- Swipe on touch, dot controls and arrow keys on desktop, with visible focus states.
- The current screen is announced for assistive technology; the gallery is labelled with the app name.
- The first screen loads eagerly enough to avoid an empty frame; the rest load lazily.
- An item with no `screens` (or one screen) renders exactly as today, with no controls.

Images live at `public/work/<app>/<n>.webp`, converted the same way as the current screenshots (780 wide, `cwebp -q 82`).

## Architecture

```
src/
  content.ts                  + estimator copy and questions, + work[].screens, + new section copy
  lib/
    estimate.ts               pure: answers -> { low, high, message } (unit tested)
    estimate.test.ts
  components/
    Reveal.tsx                client: intersection observer wrapper, ~30 lines
    CountUp.tsx               client: animated number, respects reduced motion
    AppGallery.tsx            client: the screen gallery
    sections/
      Estimator.tsx           client: the four questions and the result
      Hero.tsx                dark treatment, entrance motion
      Work.tsx                alternating layout, uses AppGallery
      Process.tsx             timeline treatment
      Contact.tsx             dark treatment
      (others)                new card treatment only
  app/globals.css             + dark surface tokens, keyframes, reduced motion block
```

Client components are limited to `Reveal`, `CountUp`, `AppGallery` and `Estimator`. Every other section stays a server component that renders static HTML.

## Verification

- `npm test`: existing copy-rule and link tests, plus estimator calculation tests (each tier, each multiplier, the floor rule, message formatting, the "not sure" path).
- `npm run verify`: section list gains `estimate`; the expected WhatsApp message list gains the estimator's default-state link; the assets check covers any committed gallery images.
- Lighthouse mobile at 90 or above for Performance, Accessibility and SEO.
- Manual: 400px and 1440px screenshots; keyboard through the estimator and gallery; `prefers-reduced-motion` on; JavaScript disabled leaves every section readable and every WhatsApp link working.
- Confirm the four phone frames actually show their screenshots in a full page capture (the 2026-09-16 desktop capture showed black frames, suspected to be lazy loading during capture rather than a site defect).

## Out of Scope

Work filters, testimonials or availability strips, a dark mode toggle, analytics, a contact form, a blog, the custom domain, and any change to the approved copy or prices.

## Dependencies

- Mustafa supplies 3 or 4 phone screenshots per app for all four apps. KiraPoket is the priority, since its current single screenshot only shows the sign-in page.
- Deploy, Firebase project creation and the public GitHub push remain blocked on his go-ahead.
