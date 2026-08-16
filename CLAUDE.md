# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

The public marketing/product site for UploadFlow (a Chrome extension), served at `https://uploadflow.cloudgrids.tech`. Next.js 16 App Router + React 19 + Tailwind 4, TypeScript strict, pnpm.

This directory is its own git repository (`arijitchhatui/uploadflow`), separate from the sibling `extension/` and `server/` trees. Run all git commands from `web/`, never from the parent directory. See the parent `../CLAUDE.md` for the container layout.

**Content boundary:** `extension/` is a private repo. Product copy and feature claims come from `web/README.md` and the `content.ts` modules. Do not copy extension source, architecture, internal docs, or its theme registry into this repo — a previous attempt to ship the extension's 18 theme palettes here was explicitly reverted as "keep it internal".

## Commands

```bash
pnpm dev        # dev server on port 3002 (extension/ uses 3000; they coexist)
pnpm build      # next build --webpack
pnpm start      # production server on 3002
pnpm lint       # eslint .
npx tsc --noEmit  # typecheck — there is no package script for this
```

**Turbopack does not reliably invalidate `globals.css`.** `pnpm dev` uses Turbopack and will serve a stale CSS chunk across edits *and across server restarts*. After changing `globals.css`, `rm -rf .next` and restart, or you will debug a stylesheet the browser never loaded. This has produced several false readings; verify a rule is live (`getComputedStyle`, or search `document.styleSheets`) before concluding a CSS change didn't work.

There is no test runner and no `format` script. Prettier config exists (140 columns, single quotes, semicolons, no trailing commas) but only editors apply it; ESLint does not enforce formatting. The ESLint config has **no Next plugin**, so `@next/next/*` rule directives fail as unknown rules.

## Design system (`uf-`)

Everything visual lives in `src/app/globals.css`, namespaced `uf-` and scoped under a single `.uf` root element. It deliberately matches the extension's own UI — dark ground, `#eefb7a` lime, Figtree headings, Inter body, `--radius: 0.625rem` scale — so the site and the tool read as one product.

**Two accent roles, and they are not interchangeable:**

- `--uf-accent` is what you **fill** with (button backgrounds, the logo tile). Lime works on any ground.
- `--uf-accent-ink` is what you **set type in**. Lime text is illegible on a light ground, so in the light palette this becomes a deep olive `#55670f` while the fill stays lime.

Theming uses **next-themes** through shadcn's `ThemeProvider` pattern (`src/components/site/ThemeProvider.tsx`), mounted in the root layout with `attribute="class" defaultTheme="system" enableSystem`. That is why the palette is `:root` (light) overridden by **`.dark`** rather than a `prefers-color-scheme` media query — an explicit choice has to beat the OS. next-themes injects its own pre-paint script, so there is no flash and no bootstrap script of ours.

`ThemeToggle` (Auto / Light / Dark) sits in the header. It resolves the pressed state only after hydration via `useSyncExternalStore` — the active theme is unknowable during SSR, and a plain `mounted` effect trips the `react-hooks/set-state-in-effect` rule this repo enforces.

Both palettes clear WCAG AA: worst case 6.22 dark, 5.80 light.

**Heading treatment** ships as Avenir Next, uppercase, italic, weight 700, tracking `-0.045rem` — set via the `--uf-head-*` tokens. Note `rem` is a fixed −0.72px at every size; the `em` equivalent would scale with the heading.

`--uf-text-3` carries real body copy here (`.uf-small`, tool descriptions, captions, limits), **not** muted labels as in the extension. Do not lower it to the extension's 0.4 alpha — that measures 3.8:1 and fails AA.

The legacy design system and its variable aliases have been removed — `globals.css` is now only base rules plus the `uf-` system (621 lines, down from 1415).

## Header budget

The header holds logo, nav, theme toggle and CTA, and they compete for width. Each addition has to be re-budgeted or the wordmark ellipsizes (it has `overflow: hidden; text-overflow: ellipsis`, so it fails silently). Current bands: **<380** logo only · **380–899** + toggle icons + CTA · **900+** + nav · **1100+** + toggle text labels.

## The 150px floor

The extension's side panel can be dragged narrower than any phone, so every surface is authored at a **150px floor** and widened with **container queries** on `.uf` (bands at 200 / 380 / 620 / 900 / 1200). Base CSS *is* the narrow design; wider containers add clarity, never a different layout.

Four traps produce overflow at the floor, and all four have bitten this codebase:

1. **`min-width: auto`** — grid and flex children refuse to shrink below min-content. `.uf-grid > *`, `.uf-stack > *` etc. are given `min-width: 0` for this reason.
2. **`overflow-wrap: break-word` does not reduce min-content.** It breaks text visually but a flex item still cannot shrink below its longest word. Use **`overflow-wrap: anywhere`** where the box itself must shrink — this is why `.uf-chip` and `.uf h1–h4` use it at the floor and revert above 380px.
3. **Flex rows of label + value.** A leading `<b>` and its trailing text are two flex items and sit side by side. `.uf-limit` is `display: block` for exactly this reason; `.uf-statline`, `.uf-rel-head` and `.uf-handoff-foot` stack at the floor and go horizontal at 380/620.
4. **`white-space: nowrap`** on chips and buttons — set to `normal` at the floor, `nowrap` only once there is room.

When auditing, compare each element's width against the container **and** check `scrollWidth > clientWidth` (children spilling out of their own parent); a width-only check misses case 3, because each flex item is individually narrower than the page. Skip elements inside an `overflow-x: auto` scroller (`.uf-toc`) — those legitimately scroll.

## Structure

- `src/components/site/SiteChrome.tsx` — `SitePage`, `SiteHeader`, `SiteFooter`, `PageHero`, `StatusLine`, `Logo`, `StoreLink`. Every page except the landing wraps in `SitePage`.
- `src/components/site/SiteLanding.tsx` — the landing page, composed inline (its own header/footer usage, not `SitePage`).
- `src/components/site/content.ts` — nav, hero chips, flow, surfaces, tools, transfers, compatibility. Edit copy here, not in components.
- `src/components/site/Clip.tsx` — the only client component in the site set. Autoplaying muted product recordings, with reduced-motion handled *at runtime* (poster + real controls, and it re-applies if the preference changes mid-session).
- `public/site/` — two trimmed product recordings (`handoff.mp4`, `capture.mp4`) with WebP posters, plus the workspace screenshots. ~1.6 MB total.

Data modules `components/landing/content.ts`, `components/how-it-works/content.ts` and `components/whats-new/content.ts` are still the source of copy for their pages.

## Gotchas

- `/demo` is a re-export of `/test` — both URLs render the interceptor harness.
- `interceptorTestTypes.ts` exposes `TEST_METHODS`; log entries and the progress meter index into it **positionally**, so reordering that array silently mislabels results.
- `/api/upscale` is a permissive-CORS proxy that spoofs browser headers to fetch the iLoveIMG page for the extension. `/api/test-upload` is a byte-count sink used only by the harness.
- `/handoff` parses a base64url `#pair=` fragment inside a `setTimeout(0)` so the fragment never reaches the server render; malformed payloads fall through to an invalid state.
- Navigation uses plain `<a>` and `<img>` — `next/link` and `next/image` are not used anywhere.

## Temporary: TypePreview

`src/components/site/TypePreview.tsx` is a **development-only** control mounted in `SitePage` and `SiteLanding`. It swaps the heading treatment live (typeface, uppercase, italic, weight, tracking) so real pages can be compared before committing to a direction, and persists the choice in localStorage.

It returns `null` in production and does not appear in any prerendered HTML or JS chunk — only its ~20 lines of CSS ship. Its localStorage key is **versioned** (`uf-type-preview-v2`); bump it whenever `DEFAULTS` changes, or a stale stored value will silently mask the shipped design. **Delete the component, its two mounts, and the `.uf-typedock*` CSS block once a direction is chosen**, then hard-code the winning values into the `--uf-head-*` tokens.

The heading treatment is token-driven for this reason: `--uf-head`, `--uf-head-style`, `--uf-head-case`, `--uf-head-weight`, `--uf-head-track` and `--uf-head-track-lg` (h1 sits tighter than the rest of the scale). If you remove TypePreview, keep the tokens or inline their values consistently in both the base `h1–h6` rule and `.uf h1–h4`.
