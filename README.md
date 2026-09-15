# Mustafa Syahmi, freelance web developer

A one page site for a Malaysian freelance web developer, built with Next.js and exported as static files for Firebase Hosting.

## Develop

```bash
npm install
npm run dev
```

## Check

Run these before committing:

```bash
npm test
npm run lint
npm run build
npm run verify
```

`npm run verify` checks the static export in `out/` for the required sections, WhatsApp links, SEO tags and assets.

## Images

These scripts need Google Chrome installed at the usual macOS path.

```bash
# App screenshots for the work section, also needs cwebp
npm run screenshots

# Social share image (public/og.jpg)
bash scripts/make-og.sh

# App icon and Apple touch icon (src/app/icon.png, src/app/apple-icon.png)
node scripts/make-icons.mjs
```

## Editing copy

All visible text lives in `src/content.ts`. Edit it there and the site updates everywhere it is used. A test in `src/content.test.ts` scans every string in that file for dash punctuation and a couple of banned words, so the check will fail if either shows up again.

## Deploy

```bash
firebase deploy --only hosting
```
