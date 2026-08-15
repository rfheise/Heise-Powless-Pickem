# frontend-web-next

The Heise Powless Pickem web front end, ported from `front-web` (create-react-app
+ react-router) to Next.js 16 with the App Router. Same pages, same styling, same
behaviour — the difference is where the work happens.

## Running it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build + standalone bundle
npm start        # node .next/standalone/server.js
```

Requires Node 20.9+. There is no build-time network dependency other than the
pickem API.

## Deploying

`next.config.mjs` sets `output: "standalone"`, so `next build` emits a
self-contained bundle at `.next/standalone` containing `server.js`, a trimmed
`node_modules` with only the packages the app actually reaches, and the server
build. It runs with plain `node` — no `npm install` on the box, and `next start`
is not used (and is explicitly unsupported alongside this setting).

Next does **not** copy `public/` or `.next/static/` into that folder, because it
assumes a CDN will serve them. This app serves them itself, so `npm run build`
chains a `bundle` step that copies both in:

```bash
cp -r public .next/standalone/ && cp -r .next/static .next/standalone/.next/
```

Miss that step and the site loads with no css, no javascript and no favicon.

The whole of `.next/standalone` is the deployable artifact — about 46 MB, most
of it `node_modules`. Ship that directory and run:

```bash
PORT=3000 HOSTNAME=0.0.0.0 node server.js
```

`outputFileTracingRoot` is pinned to this directory. `v4/` holds several apps and
more than one lockfile; without the pin Next guesses a workspace root and can
trace from the wrong place, producing a bundle that is missing files or carrying
the other apps'.

### The ISR cache

Regenerated pages are written to `.next/cache` **inside the standalone folder**.
In a container, mount that path on a volume if you want the cache to survive a
restart. Nothing breaks if you don't — the first request after boot regenerates
the page — and it is the right call to *not* persist it across deploys, since a
new build should not serve pages rendered by the old one. Running more than one
instance gives each its own cache, so they revalidate independently; a shared
`cacheHandler` is the fix if that ever matters.

### The image cache

The first request for a given propic at a given width makes the server download
the multi-megabyte original and resize it — about 300ms. The result is written to
`.next/cache/images` and every request after that is served from disk in about
1ms. It is the same cache directory as ISR, so the same advice applies: fine to
lose on deploy, worth a volume if you would rather not pay the first hit again
after a restart.

A cold cache is visible: on the very first load of a list page the avatar circles
sit empty for a moment before filling in.

### Two things that will waste your afternoon

**`pkill -f "server.js"` does not kill it.** The standalone server renames its
process to `next-server (v16.3.1)`, so a pattern matching the script path silently
matches nothing and you end up testing a server from a previous build while
staring at correct files on disk. Use `lsof -ti tcp:3000 | xargs kill`.

**`.next/standalone` keeps stale files across incremental builds.** Rebuilding
without clearing `.next` first can leave prerendered html from an earlier build
inside the standalone folder. Build clean in CI (`rm -rf .next && npm run build`).

### Telling ISR routes apart at runtime

The build log marks every prerendered route `○ (Static)`; the Revalidate column
is what identifies ISR. At runtime the `Cache-Control` header is unambiguous:

| Route | Header | |
| --- | --- | --- |
| `/hof`, `/standings`, `/`, … | `s-maxage=300, stale-while-revalidate=…` | ISR, 5 min |
| `/votes`, `/weekly_picks`, `/login`, … | `s-maxage=31536000` | static, never regenerates |

## How it is put together

### Public pages render on the server

These routes read endpoints that need no api token, so they are fetched on the
server and the visitor's html already contains the data:

| Route | Endpoint |
| --- | --- |
| `/`, `/recap` | `/api/recap/latest` |
| `/announcements` | `/api/announcements` |
| `/standings`, `/hall_of_shame` | `/api/standings` |
| `/hof` | `/api/hof` |
| `/career` | `/api/career` |

`/votes` and `/weekly_picks` could be server rendered too — their endpoints are
public — but are deliberately left fetching in the browser.

Each server rendered route declares `export const revalidate = 300`. Next serves the prerendered page
to everyone immediately and regenerates it in the background once the copy is
five minutes old, so no visitor ever waits on the backend and the backend sees
at most one request per page per five minutes. The value has to be a literal —
Next parses it statically and cannot follow an imported constant.

Pages with controls (the week/year dropdowns on Recap, the expander on All Time)
render their first state on the server and hand it to a client component as
`initialX` props. A `loaded` ref records what the server already rendered so
mounting does not immediately refetch the same week. Changing a dropdown fetches
from the browser exactly as before; the url does not change.

### The rest fetch in the browser

`/pick`, `/my_picks`, `/picks/*`, `/vote`, `/propic`, `/login`, `/signup` and
`/logout` need the api token, which only the browser has (localStorage), so they
have no choice. `/votes` and `/weekly_picks` are here by choice rather than
necessity. All of them fetch on mount, unchanged from `front-web`.

### The api layer is split in two

- `lib/config.ts` — url helpers and constants, safe on both sides.
- `lib/api.ts` — the browser client (`"use client"`). Same class as before:
  token in localStorage, 401/403 clears it and bounces to `/login`, non-silent
  calls drive the loading spinner.
- `lib/server.ts` — `serverGet()` for server components, with the revalidate
  window applied. Failures return `{success:false}` and the client component
  falls back to fetching for itself.

### Styling

Every stylesheet is global and imported in `app/layout.tsx` in the order
create-react-app bundled them, so the cascade and every specificity tie resolves
exactly as before. No CSS modules, no renamed classes.

## Deliberate differences from `front-web`

These are the only places the port does not do literally the same thing:

1. **The navbar breakpoint is CSS, not `window.innerWidth`.** The old bar measured
   the viewport in a `useState` initialiser to choose between the desktop links
   and the mobile drawer. That cannot run on the server, and shipping the desktop
   bar then swapping after hydration is a visible flash on every phone. Both trees
   are now always in the markup and a `@media (max-width: 1000px)` rule picks one
   (`.hamburger`, `.NavLinks`, `.NavTitle-full` / `.NavTitle-short` in `nav.css`).
   Rendered output is identical at every width.

2. **The random background photo is chosen after mount.** `getRandomImage()` is
   non-deterministic, so calling it during render would make the server and client
   disagree and react would discard the server html. It runs in an effect instead.
   The photo still changes on every page load, one frame later than before; the
   page sits on the same navy underneath meanwhile.

3. **"Update Standings" revalidates before reloading.** The button used to set
   `window.location.href` and get fresh data. With the page prerendered, a plain
   reload returns the cached copy, so it now calls a server action that drops the
   `/standings` and `/hall_of_shame` cache entries, then `router.refresh()`.

4. **Unknown urls get a 404 page.** `app/not-found.tsx` renders the same shell
   with an empty state; the old app rendered the nav and nothing else.

5. **Profile pictures go through the optimiser unless they are gifs.** Propics
   are phone camera uploads and the originals are enormous — Hall of Fame alone
   pulled **17.7 MB** of them to fill a column of 56px circles. `next/image`
   takes that to **2.8 MB**, and all but ~16 KB of what is left is one animated
   gif. An animated image would come back from the optimiser as a single still
   frame, so `Propic` checks the extension and passes `.gif` through untouched.
   Team logos and background photos are optimised normally.

6. **The whole week/year pill opens the list.** The `<select>` used to be a flex
   item occupying only the value on the right, so the label and the space between
   were dead. It is now stretched over the entire pill at `opacity: 0`, with the
   value drawn by a sibling `.drop-down-value` that keeps it in flow (and so keeps
   the pill its original height). Looks the same, but the tap target is the whole
   control rather than a chip — which matters most on a phone. Since the select is
   invisible, its focus ring is drawn on the pill via
   `.drop-down:has(.drop-down-select:focus-visible)`. The form selects
   (`.team-select` on Make A Pick and Vote) were already full width and are
   unchanged.

## Payload

Next ships more javascript than the old app (~184 KB gzipped for a page, against
~68 KB for React 17 + react-router v5) — the App Router runtime is simply bigger.
That cost is paid after first paint, and it buys removing the request waterfall
that used to gate the content:

```
before: html (empty) -> js -> execute -> fetch api -> render
after:  html (already contains the data) -> render
```

If the bundle size ever matters more than the server rendering, the lever is
`next/dynamic` on the heavier client views, not undoing the SSR.
