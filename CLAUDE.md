# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Personal portfolio for **Kishan S. Patel** — UI/UX Designer, Ahmedabad, India.

**Stack**: Next.js 15 (App Router) + React 19 + TypeScript + Tailwind CSS + Framer Motion.

On **desktop** the portfolio has two modes:
- **Canvas mode** — A horizontal film-strip of frames the visitor pans and zooms. Sprocket holes above/below, cinematic intro on load, floating bottom pill for navigation.
- **Presentation mode** — A fullscreen slide deck triggered by the "Present" button. Entirely separate components and data from canvas mode.

On **mobile/touch** an entirely separate "vertical film reel" renders instead (see [Mobile render path](#mobile-render-path-the-third-path)). [page.tsx](app/page.tsx) picks the path at runtime via `useIsMobile()`; the canvas/presentation code never mounts on phones.

The old static site (`index.html`, `styles.css`, `script.js`) remains in the repo root but is superseded by the Next.js app.

## Commands

```bash
npm run dev        # http://localhost:3000 (Turbopack)
npm run build      # production build + type-check
npm run start      # serve production build
```

`npm run build` (`next build`, which runs `tsc` across all routes) is the **only** automated correctness gate — there is **no test runner and no lint/ESLint setup** (`npm run lint` does not exist). Don't suggest it.

**Config conventions:**
- `@/*` is aliased to the project root in `tsconfig.json` — import via `@/components/...`, `@/lib/...`. `strict` mode is on; new code must be fully typed.
- `next.config.mjs` sets `images: { unoptimized: true }` (no Next image optimization — relevant given the many large `public/work/**` images). There is no `output: 'export'`, so `/api/contact` and `generateStaticParams` rely on a Node server (`next start`).

## Critical architecture: THREE separate render paths

**This is the most important thing to know.** The same content is rendered by three fully independent code paths, each with its own copy of the data:

| | Canvas frames | Presentation slides | Mobile reel |
|---|---|---|---|
| Files | `components/frames/*.tsx` | `components/PresentationSlides.tsx` | `components/mobile/scenes.tsx` |
| Data | inline per-frame | top-level consts in `PresentationSlides.tsx` | `lib/mobileContent.ts` |
| Shown when | desktop, always on canvas | desktop, "Present" button | mobile/touch viewport |

**Editing one path does NOT update the others.** When content changes (a stat, a project, contact info), update all three. The canonical facts (employer, dates, email, project copy) are duplicated across `components/frames/*`, `PresentationSlides.tsx`, `lib/mobileContent.ts`, and `app/resume/page.tsx` — a shared content layer would be a worthwhile future refactor.

`PresentationSlides.tsx` holds its own data arrays at the top of the file: `SVCS`, `PROC_STEPS`, `SKILL_DOMAINS`, `TIMELINE_ENTRIES`, `CONTACT_CARDS`, `TOOL_ITEMS`, `METHOD_ITEMS`, `AI_TOOLS`, `MODULES_GRID` — **plus** `WORK_PROJECTS` (the 4 Work case studies, the largest content block), `PROC_LABELS`, `SPECS` and `TOOLS_LIST` (About slide), and the `ProjectMockup` CSS-mockup component. Each `Slide*` function reads from these; `SLIDE_MAP` at the bottom wires them to frame IDs. Note the deck is **hardcoded to 7 slides** — `SlideHeader` "NN / 07" strings and per-slide `BgNum` digits are literals, not derived from `FRAMES.length`, so adding/removing a slide means editing each by hand.

### State flow

`page.tsx` is the single source of shared UI state.
- `canvasState` `{ tool, displayScale, selectedId }` flows **UP** from `useCanvas.ts` via `Canvas.onStateChange` (the canvas transform lives in DOM mutation, mirrored to React only for display).
- `presentationMode` is owned by `page.tsx` and flows **DOWN** to `Canvas` (lock + navigate) and `BottomNav` (hides itself).
- **Slide↔frame sync is by side-effect, not shared state**: advancing a slide calls `flyTo` on the locked, hidden canvas, which updates `selectedId`, which flows back up. The current frame index is derived **independently in both `page.tsx` and `Canvas.tsx`** — changing `FRAMES` ordering can desync them.

## UI chrome: live vs dead components

On desktop `page.tsx` renders only `Canvas`, `BottomNav`, and (conditionally) `PresentationSlides`; on mobile it renders `MobileApp` instead. `GlobalCursor` is mounted once in `app/layout.tsx`, so it applies to **all routes** (`/`, `/resume`, `/work/[slug]`) — a custom cursor (fast dot + lagging ring + click ripples) whose hover/grab state is detected via `event.target.closest('a, button, [role=button], .cursor-grab')`; the `.cursor-grab` class is toggled by `Canvas` based on the pan tool. It **early-returns on touch devices** (`pointer: coarse`), where `globals.css` also restores the native cursor.

**`components/Toolbar.tsx` and `components/LayersPanel.tsx` are dead code** — imported nowhere (leftovers from an earlier Figma-chrome layout that `BottomNav` replaced). Editing them has no effect in the running app; wire them up or delete them first.

## Canvas architecture

**Coordinate system**: Frames sit at absolute `(x, y)` in canvas space. The world `<div>` gets `transform: translate(panX, panY) scale(scale)` with `transform-origin: 0 0`. Pan/zoom uses direct DOM mutation — not React state — for 60fps performance. React state only updates for zoom display and `selectedId`.

**flyTo / zoom math** (constants in `useCanvas.ts`):
```
targetScale = min((vw - 2*pad) / frame.w, (vh - 2*pad) / frame.h, 1.3)
targetX     = vw/2 - (frame.x + frame.w/2) * targetScale
targetY     = vh/2 - (frame.y + frame.h/2) * targetScale
```
Zoom toward cursor: `newPanX = cursorScreenX - (cursorScreenX - panX) * (newScale / oldScale)`; zoom factor `= 1 - delta*0.0008`. Global clamp `MIN_SCALE=0.06`, `MAX_SCALE=3`; initial scale `0.38`. Pads differ by operation: `flyTo` pad=80 (cap 1.3), `fitAll` pad=100 (no cap beyond `MAX_SCALE`), cinematic intro pad=80 (cap 1.25).

**CanvasHandle**: `Canvas.tsx` uses `useImperativeHandle` to expose four members — `flyTo`, `fitAll`, `getState` (returns `{ tool, displayScale, selectedId }`), and `setTool`. `page.tsx` only consumes `flyTo`/`fitAll`; `getState`/`setTool` are effectively unused leftovers for the orphaned `Toolbar`.

**Frame registry**: `lib/frames.ts` exports `FRAMES`, which is **generated** by mapping over the `ORDER` array (not hand-edited). Each `FrameDef` has `id, label, number ('01'..'07'), x, y, w, h, color`. `y` is always `0`, `h` is always `FRAME_H` (780), and `x` is **computed at load** by accumulating `WIDTHS` with `GAP=60` and centering — not a hardcoded literal. `FRAME_MAP` (id→frame `Map`) and `getFramesBounds()` (used for the initial fit-all) live alongside.

**Cinematic intro** — two independent, separately-timed mechanisms: (1) `useCanvas.ts` frames the `about` frame on mount, then at 1900ms calls `fitAll(true)` and sets `introComplete=true`; (2) `Canvas.tsx` renders a separate full-bleed black `#050505` overlay (film title + loadBar) that fades at 300ms and unmounts at 1200ms. `WayfindingHint` appears after `introComplete` and auto-fades over ~10s.

**Film strip visuals** — the sprocket-hole strip and the animated Figma-style prototype-flow arcs (moving packet dots between frames) are drawn by `FilmStrip()` in `Canvas.tsx`; that's where film-strip visual edits go.

## Presentation mode

`BottomNav` "Present" button → sets `presentationMode` in `page.tsx` → `PresentationSlides` renders as a fullscreen overlay and the canvas is locked. The active slide is `SLIDE_MAP[FRAMES[idx].id]`, so **every `SLIDE_MAP` key must exactly equal a `FRAMES` id or the slide silently renders nothing**.

The **keyboard handler lives in `Canvas.tsx`** (a `useEffect` gated on `presentationMode`), NOT in `PresentationSlides.tsx`: `←`/`→` **and** `↑`/`↓` navigate (wrapping circularly via modulo), `Escape` exits. `PresentationSlides.tsx` only renders the visual arrow buttons, kbd hints, and Exit button. Navigation works by calling `flyTo` on the locked, hidden canvas (see State flow above).

## Mobile render path (the third path)

On a touch/narrow viewport, [page.tsx](app/page.tsx) renders `MobileApp` instead of the canvas — a **vertical "film reel"**: scroll-snapped full-height scenes with fixed sprocket rails, a top `NN / 07` counter, a scroll-progress bar, and a bottom dot-nav. The desktop canvas/presentation components never mount on mobile.

- **Detection** — `hooks/useIsMobile.ts` returns `boolean | null` (`null` until mounted → `page.tsx` shows a branded `Splash` to avoid a hydration flash). "Mobile" = `max-width: 768px` **or** a coarse pointer ≤1024px (catches phones in landscape).
- **Shell** — `components/mobile/MobileApp.tsx` owns the scroll container (`.mobile-reel`), the active-scene `IntersectionObserver` (root = the reel, threshold 0.5), the rAF-throttled scroll-progress, the dot-nav (`scrollIntoView`), and a brief cinematic intro overlay (skipped under `prefers-reduced-motion`). It maps `SECTIONS` (from `lib/mobileContent.ts`, mirrors `lib/frames.ts` ORDER) → scene components.
- **Scenes** — `components/mobile/scenes.tsx` has the 7 scene components (`AboutScene`…`ContactScene`), all reading from `lib/mobileContent.ts`. `AboutScene` is a bespoke hero; the rest use the shared `SceneHead`.
- **Primitives** — `components/mobile/primitives.tsx`: `Reveal` (scroll-in via `whileInView`), `SceneHead` (`NN / 07` + title + divider + meta), `Chip`, `CountUp`. Layout/typography helpers (`.m-wrap`, `.m-title`, `.m-card`, `.m-chip`, `.mobile-reel`, `.sprocket-rail`, `.m-nav`, etc.) live in `app/globals.css`.
- **Touch quirks** — `globals.css` globally hides the cursor (`cursor: none`) for the desktop `GlobalCursor`; a `@media (pointer: coarse)` block restores it, and `GlobalCursor.tsx` early-returns on touch. The Contact scene POSTs to the same `/api/contact` route as the other two paths.

## Shared graphics & slide-composition helpers (in PresentationSlides.tsx)

Decorative primitives (autonomous, not exported): `SpinArc`, `OrbDot`, `ConcentricRings`, `Bracket`, `ScanLine`, `StatChip`.

The actual building blocks for composing a new slide also live here: `SlideHeader` (top label + "NN / 07"), `BgNum` (giant background slide number), the `SP` padding const, `SplitText`, `AnimCount` (animated counter), `TiltPhoto` (3D tilt), `Particles`, and the `useMouseSpring` parallax hook.

## Design tokens & fonts

Two parallel token systems exist — keep them in sync (`accent #c8a96e` is duplicated in both):
- **Tailwind theme** (`tailwind.config.ts`): colors `canvas #1e1e1e`, `panel #2c2c2c`, `panel-border #3d3d3d`, `accent #c8a96e`, `frame-bg #111111`; font utilities `font-display` / `font-body`. The `content` glob covers only `./app` and `./components` — **Tailwind class strings written in `lib/` are purged** and never generated.
- **Raw CSS vars on `:root`** (`app/globals.css`): `--fg`, `--fg-2`, `--fg-3`, `--accent`, `--ease cubic-bezier(0.16,1,0.3,1)`, and the font aliases `--font-display: var(--font-antonio)` / `--font-body: var(--font-inter)`. `globals.css` also globally applies `cursor: none` (app supplies its own cursor) and `overflow: hidden` on `html/body` (no native scroll — pan/zoom handles all movement).

`app/layout.tsx` defines the raw next/font variables `--font-antonio` (Antonio, display) and `--font-inter` (Inter, body). **In inline styles, use `fontFamily: 'var(--font-display)'`** — that's the in-codebase convention (used ~25×); the raw `--font-antonio` appears only twice.

## Additional pages

**`app/work/[slug]/page.tsx`** — Static server component. Four case studies (`rum`, `metric`, `dashboard`, `system`) are hardcoded in `CASE_STUDIES`; `generateStaticParams` pre-renders all four and unknown slugs call `notFound()`. `generateMetadata` produces per-case-study SEO (`title — Kishan S. Patel`, description = `challenge.slice(0,155)`). Each study carries an `accentColor`, a `process` boolean tuple mapped to `PROC_LABELS` (only `metric` has `process[0]=false`, triggering an "upstream by PM" footnote), and a hardcoded `prev`/`next` chain `rum→metric→dashboard→system`. **Nothing in the canvas/presentation UI links to these pages** — they're reachable only by direct URL and cross-link among themselves via the header dots and prev/next footer. (`WorkFrame.tsx` only links out to Behance.)

**`app/resume/page.tsx`** — Client component, printable resume at `/resume`. Uses `@media print` CSS to switch from the dark theme to a clean white A4 layout for PDF export via `window.print()`. All content is hardcoded here, and this file is the **source of truth for contact/bio details** (email `kishanpatel4999@gmail.com`, phone `+91 7096855325`, employer "AI Mindarray Systems Pvt. Ltd." / Motadata ObserveOps). Update it directly when resume details change.

**SEO / OG** — `app/opengraph-image.tsx` (`runtime = 'edge'`, hand-built JSX) feeds both OpenGraph and Twitter images. Note a **domain inconsistency**: `layout.tsx` `metadataBase` is `https://kishanspatel.com` but the resume links to `https://kishanp.com`. Marketing stats ("4+ Years", "20+ modules") are hardcoded in both `opengraph-image.tsx` and the layout description — keep them in sync.

## Contact form

`POST /api/contact` accepts JSON `{ name, email, message }`. Missing any field → `400 { error: 'Missing fields' }`; success → `200 { success: true }`; thrown error → `500 { error: 'Server error' }`. It currently only `console.log`s the message. The presentation Contact slide and `ContactFrame.tsx` both POST here (and only check `res.ok`), so editing contact behavior touches `route.ts`, `ContactFrame.tsx`, **and** `PresentationSlides.tsx`. The TODO placeholder addresses in the route (`portfolio@yourdomain.com` / `kishanspatel@email.com`) are **not real** — the real address is `kishanpatel4999@gmail.com`.

To wire email: `npm install resend` → add `RESEND_API_KEY` to `.env.local` → call `resend.emails.send(...)` inside the route handler (preserve the response shape above).

## Adding a new frame

1. In `lib/frames.ts`: add the `id` to `ORDER` and matching entries to `WIDTHS`, `COLORS`, and `LABELS`. `x` and `number` are auto-derived; `y`/`h` are fixed. `ORDER` and `FRAME_CONTENT` (in `Canvas.tsx`) must stay in lockstep — a missing `FRAME_CONTENT` entry makes the artboard render crash.
2. Create `components/frames/YourFrame.tsx`.
3. Add it to the `FRAME_CONTENT` map in `components/Canvas.tsx`.
4. Add a `SlideYour` function in `PresentationSlides.tsx`, register it in `SLIDE_MAP`, and update the hardcoded "NN / 07" / `BgNum` literals across all slides (the deck count is not derived).
5. **Mobile:** add the section to `SECTIONS` + its data in `lib/mobileContent.ts`, write a `YourScene` in `components/mobile/scenes.tsx`, and register it in the `SCENES` map in `MobileApp.tsx`. The `NN / 07` counters there derive from `SECTIONS.length`, so they update automatically.

## Keyboard shortcuts (useCanvas.ts)

| Key | Action |
|-----|--------|
| `V` | Select tool |
| `H` | Pan tool |
| `Space` + drag | Pan |
| scroll (no modifier) | Pan (2-axis) |
| `Ctrl/⌘ + scroll` | Zoom toward cursor |
| `Ctrl/⌘ + =` / `+` | Zoom in (toward viewport center) |
| `Ctrl/⌘ + -` | Zoom out |
| `Ctrl/⌘ + 0` / `Escape` | Fit all frames |

All shortcuts are suppressed when an input/textarea is focused or when the canvas is locked (presentation mode). Arrow keys navigate **only** in presentation mode (handled in `Canvas.tsx`).

## Assets

Static assets live in `public/` and are referenced as `/filename`. `app/opengraph-image.tsx` is a Next.js image route for social previews. The top level of `public/` also holds `ai-portfolio.png`, `cyber-security.png`, `kishan-profile.png`, `kisu2.png` (an apparent duplicate of `kishan-profile.png`), `kishan-resume.pdf`, and `favicon.svg`.

**Design work images** — raw source files live in `me/designs work/` (Dashboard, Vector, Website, mobile app subfolders — not served by Next.js, and `me/designs work/` is gitignored). Exported copies with clean filenames live in:
- `public/work/dashboard/` — `desktop-1.jpg`…`desktop-7.jpg` and `desktop-10.jpg`…`desktop-20.jpg` (18 files; **`desktop-8`/`desktop-9` are absent**), `desktop-26.png`, `mobile-1.jpg`, `mobile-2.jpg`. All numbered desktop shots are JPG; only `desktop-26` is PNG. Any iterator must skip the 8/9 gap and handle the JPG/PNG split.
- `public/work/mobile/` — `mobile-1…4.jpg` (mobile app screenshots)
- `public/work/freelance/` — `web-1…59.jpg`, `web-60…71.png` (website designs)

`me/details.md` contains Kishan's raw biographical notes used as source of truth for resume and bio copy.
