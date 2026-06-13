# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Personal portfolio for **Kishan S. Patel** — UI/UX Designer, Ahmedabad, India.

**Stack**: Next.js 15 (App Router) + React 19 + TypeScript + Tailwind CSS + Framer Motion.

The portfolio has two distinct modes:
- **Canvas mode** — A horizontal film-strip of frames the visitor pans and zooms. Sprocket holes above/below, cinematic intro on load, floating bottom pill for navigation.
- **Presentation mode** — A fullscreen slide deck triggered by the "Present" button. Entirely separate components and data from canvas mode.

The old static site (`index.html`, `styles.css`, `script.js`) remains in the repo root but is superseded by the Next.js app.

## Commands

```bash
npm run dev        # http://localhost:3000 (Turbopack)
npm run build      # production build + type-check
npm run start      # serve production build
```

No test runner is configured. `npm run build` is the primary correctness check — it catches TypeScript errors across all routes.

## Critical architecture: two separate render paths

**This is the most important thing to know.** Canvas frames and presentation slides are completely independent:

| | Canvas frames | Presentation slides |
|---|---|---|
| Files | `components/frames/*.tsx` | `components/PresentationSlides.tsx` |
| Data | inline per-frame | top-level consts inside `PresentationSlides.tsx` |
| Triggered by | always visible on canvas | "Present" button in `BottomNav` |

**Editing a canvas frame does NOT update the presentation slide, and vice versa.** Both must be updated separately when content changes.

`PresentationSlides.tsx` contains all its own data arrays at the top of the file: `SVCS`, `PROC_STEPS`, `SKILL_DOMAINS`, `TIMELINE_ENTRIES`, `CONTACT_CARDS`, `TOOL_ITEMS`, `METHOD_ITEMS`, `AI_TOOLS`, `MODULES_GRID`. Each exported slide function (`SlideAbout`, `SlideWork`, `SlideServices`, etc.) reads from these arrays. The slide map at the bottom wires them to frame IDs.

## Canvas architecture

**Coordinate system**: Frames sit at absolute `(x, y)` in canvas space. The world `<div>` gets `transform: translate(panX, panY) scale(scale)` with `transform-origin: 0 0`. Pan/zoom uses direct DOM mutation — not React state — for 60fps performance. React state only updates for zoom display and `selectedId`.

**flyTo transform math**:
```
targetScale = min((vw - 2*pad) / frame.w, (vh - 2*pad) / frame.h, 1.3)
targetX     = vw/2 - (frame.x + frame.w/2) * targetScale
targetY     = vh/2 - (frame.y + frame.h/2) * targetScale
```
Zoom toward cursor: `newPanX = cursorScreenX - (cursorScreenX - panX) * (newScale / oldScale)`

**CanvasHandle**: `Canvas.tsx` uses `useImperativeHandle` to expose `flyTo`, `fitAll`, and `setTool` to `page.tsx`, avoiding lifting transform state into React.

**Frame registry**: `lib/frames.ts` holds the `FRAMES` array (id, label, x/y/w/h, color). `Canvas.tsx` has a `FRAME_CONTENT` map from frame id → component. Frame positions are in pixels; `getFramesBounds()` is used for the initial fit-all on load.

## Presentation mode

`BottomNav` has a "Present" button → sets `presentationMode` state in `page.tsx` → `PresentationSlides` renders as a fullscreen overlay. Canvas is locked. Keyboard: `←`/`→` navigate slides, `Escape` exits. Current slide index is derived from `selectedId` — presentation navigates by calling `flyTo` on the canvas so the canvas frame and slide stay in sync.

## Shared graphic primitives (in PresentationSlides.tsx)

Reusable animation components defined at the top of `PresentationSlides.tsx` (not exported):
- `SpinArc` — rotating arc ring (autonomous, `repeat: Infinity`)
- `OrbDot` — dot orbiting at a given radius
- `ConcentricRings` — pulsing concentric circles
- `Bracket` — corner bracket decoration (`tl/tr/bl/br`)
- `ScanLine` — horizontal sweep across full height
- `StatChip` — mini animated stat card

## Font variables

Defined in `app/layout.tsx`, available globally as CSS variables:
- `--font-antonio` → Antonio (display/heading font)
- `--font-inter` → Inter (body)

Use `fontFamily: 'var(--font-antonio)'` in inline styles for display numbers.

## Additional pages

**`app/work/[slug]/page.tsx`** — Static server component. All four case studies (`rum`, `metric`, `dashboard`, `system`) are hardcoded in `CASE_STUDIES`. `generateStaticParams` pre-renders all four. `WorkFrame.tsx` links to these pages.

**`app/resume/page.tsx`** — Client component. Printable resume page at `/resume`. Uses `@media print` CSS to switch from the dark portfolio theme to a clean white A4 layout for PDF export via `window.print()`. All content is hardcoded in the file — update it directly when resume details change.

## Adding a new frame

1. Add an entry to `FRAMES` in `lib/frames.ts` with unique `id`, position, and dimensions.
2. Create `components/frames/YourFrame.tsx`.
3. Add to the `FRAME_CONTENT` map in `components/Canvas.tsx`.
4. Add a corresponding `SlideYour` function in `PresentationSlides.tsx` and register it in the slide map at the bottom.

## Contact form

`app/api/contact/route.ts` currently logs to console. To wire email:
1. `npm install resend`
2. Add `RESEND_API_KEY` to `.env.local`
3. Call `resend.emails.send(...)` inside the route handler.

## Keyboard shortcuts (useCanvas.ts)

| Key | Action |
|-----|--------|
| `V` | Select tool |
| `H` | Pan tool |
| `Space` + drag | Pan |
| `Ctrl/⌘ + scroll` | Zoom |
| `Ctrl/⌘ + 0` / `Escape` | Fit all frames |

## Assets

Static assets live in `public/` and are referenced as `/filename`. `app/opengraph-image.tsx` is a Next.js image route for social sharing previews.

**Design work images** — raw source files live in `me/designs work/` (Dashboard, Website, mobile app subfolders — not served by Next.js). Exported copies with clean filenames live in:
- `public/work/dashboard/` — desktop-1…20, desktop-26.png, mobile-1.jpg, mobile-2.jpg
- `public/work/mobile/` — mobile-1…4.jpg (mobile app screenshots)
- `public/work/freelance/` — web-1…59.jpg, web-60…71.png (website designs)

`me/details.md` contains Kishan's raw biographical notes used as source of truth for resume and bio copy.
