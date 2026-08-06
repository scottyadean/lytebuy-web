# lytebuy-marketing

The public marketing site. SvelteKit 2 + Svelte 5 (runes), TypeScript, Tailwind
v4, server-rendered through `adapter-node`.

Its job is narrow: earn trust, state the mission, and push the visitor toward
one of three actions — open the app, download it, or start selling.

## Running it

```bash
npm install
cp .env.example .env      # defaults already point at a local blog service
npm run dev
```

The blog and press pages read from **lytebuy-blog-service**, so start that too:

```bash
cd ../lytebuy-blog-service && ./.server.sh   # sls offline on :5600
```

Without it the site still renders — the blog and press pages fall back to an
empty state rather than erroring. That is deliberate: a marketing page that
500s because a Lambda is cold is worse than one that says "nothing published
yet".

> **Note:** `sls offline` runs the Python handler with the *system* interpreter,
> so `pymongo` and `dnspython` must be installed for it
> (`python3 -m pip install --user -r requirements.txt` in the blog service).
> Without them every request to :5600 hangs rather than failing loudly.

## Environment

| Var                | Read at   | Purpose                                               |
|--------------------|-----------|-------------------------------------------------------|
| `BLOG_API_URL`     | request   | Blog service base, e.g. `http://localhost:5600/local` |
| `BLOG_API_KEY`     | request   | API Gateway usage-plan key, server-side only          |
| `PUBLIC_SITE_URL`  | **build** | Origin for canonical URLs, OG tags and the sitemap    |
| `PUBLIC_GA_ID`     | **build** | Google Analytics ID; empty loads no analytics at all  |

`PUBLIC_*` are inlined by Vite at build time, which is why the Dockerfile takes
them as build args rather than container env.

`BLOG_API_KEY` is only ever read in `src/lib/server/blog.ts` and never reaches
the browser. That is why the blog routes are server-rendered rather than
prerendered.

## Structure

```
src/lib/config.ts          site copy, nav, contact details
src/lib/format.ts          date and read-time helpers (server + client)
src/lib/server/blog.ts     blog service client; degrades instead of throwing
src/lib/server/markdown.ts markdown -> sanitized HTML, server-side only
src/lib/components/        the reusable set (see below)
src/routes/                pages
src/app.css                design tokens and utilities
```

### Components

`Button` `Section` `Eyebrow` `Hero` `Nav` `Footer` `Logo` `AppBadges`
`FeatureCard` `StatBlock` `VendorCard` `ProductCard` `PostCard` `Reveal` `Seo`

`Section` owns the vertical rhythm and the four background tones, `Eyebrow` the
section labels, and `Seo` every meta tag, canonical and JSON-LD block. Adding a
page should mean composing these, not writing new layout CSS.

## Design tokens

The palette is the one in `_project-insights/marketing-site-plan.txt` and matches
`lytebuy-client/src/lib/theme.ts` value for value, so the site and the app read
as one product. Three values are deliberately *not* verbatim — the reasoning is
written into `src/app.css` beside each one. Most of this palette is far too
low-contrast for text on a light background, so check any new pairing before
using it.

Type is Fraunces (display) and Inter (body), both self-hosted variable fonts, so
first paint costs no external font request.

## Content

Posts and press releases come from the blog service and are addressed by
**slug**, not id, for SEO. `getContentBySlug` resolves the slug through the
public list endpoint, which only sees the newest 100 items — fine for a launch
blog, but the service will need a real `GET /posts/slug/{slug}` before the
archive outgrows that.

## Assets

- `static/video/placerville-hero.mp4` — cut from
  `_project-insights/placervilleca_1920x650.mp4`, seconds 7.0–12.5. That window
  avoids the burned-in "Welcome To Placerville California" title card at the
  start and the car-show footage later on. 33MB → 354KB.
- `static/img/community-table.jpg`, `local-cafe.jpg` — Pexels, free to use.
- `static/img/come-in-were-awesome.jpg`, `main-street.png` — supplied in
  `_project-insights`.

## Checks

```bash
npm run check    # svelte-check; 0 errors expected
npm run build
```

## Deploy

```bash
docker compose up --build lytebuy-marketing   # :3002
```

## Known gaps

- The vendor directory and product feed on the landing page are illustrative
  placeholders, labelled as such on the page. They need the storefront and
  product APIs.
- `/privacy` and `/terms` are placeholders and say so on the page. They need
  real reviewed copy before launch.
- The contact form validates and logs; no mail transport is wired up. The single
  place to add SES/Postmark is `src/routes/get-involved/+page.server.ts`.
- App Store and Play links are empty in `src/lib/config.ts`, so the badges render
  a "coming soon" state rather than dead links.
- `appLinks.vendorSignup` in `src/lib/config.ts` is empty (the destination is
  still TBD). While it is, `/sell` sends people to the web app instead of
  rendering a dead "Create your account" button. Set it once the URL exists and
  every CTA on that page switches over.
- Mobile verified at a 500px viewport on `/sell`: no horizontal overflow, mobile
  drawer works. Other pages verified at desktop widths only.
