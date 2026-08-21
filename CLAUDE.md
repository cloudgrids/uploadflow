# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

The public marketing/product site for UploadFlow (a Chrome extension), served at `https://uploadflow.cloudgrids.tech`. Next.js 16 App Router + React 19 + Tailwind 4, TypeScript strict, pnpm.

This directory is its own git repository (`cloudgrids/uploadflow`), separate from the sibling `extension/` and `server/` trees. Run all git commands from `web/`, never from the parent directory. See the parent `../CLAUDE.md` for the container layout.

**If `gh pr create` says `No commits between cloudgrids:main and arijitchhatui:<branch>`, the remote URL is stale, not the branch.** Older clones point `origin` at `arijitchhatui/uploadflow`, which is a rename redirect to this same repo. Git follows it silently, so pushes succeed and nothing looks wrong — but `gh` reads `arijitchhatui` as a different owner and attempts a cross-fork PR. The error names an empty diff, which sends you off checking commits that are fine. Fix the remote rather than working around it per command:

```bash
git remote set-url origin git@github.com:cloudgrids/uploadflow.git
gh repo set-default cloudgrids/uploadflow
```

Remotes live in the shared `.git`, so this fixes every worktree at once. Confirm with `gh repo view --json nameWithOwner`.

> ## ⚠ This repository is PUBLIC
>
> It is the only one of the three that is. `uploadflow-extension` and `uploadflow-server` are
> private, and **anything written here — including this file, commit messages, branch names and pull
> request descriptions — is world-readable the moment it is pushed.** Assume a competitor reads every
> commit.
>
> Nothing internal belongs in this repo. Not extension or server source, not architecture notes, not
> file paths into the private trees, not internal mechanism names, not unreleased plans, and not the
> names of features the product does not advertise. A previous attempt to ship the extension's 18
> theme palettes here was explicitly reverted as "keep it internal" — the same test applies to prose.
>
> Working notes that need any of that live in the private workspace repo's `CLAUDE.md`, one directory
> up. When something must be referred to here, refer to it by what a customer would call it.

Product copy and feature claims come from `README.md` and the `content.ts` modules.

## Commands

```bash
pnpm dev        # dev server on port 3002 (extension/ uses 3000; they coexist)
pnpm build      # next build --webpack
pnpm start      # production server on 3002
pnpm lint       # eslint . — see below, currently fails on every file
npx tsc --noEmit  # typecheck — there is no package script for this
```

**`pnpm lint` fails repo-wide whenever a git worktree exists under `.claude/worktrees/`.** That
nested checkout gives `typescript-eslint` two candidate `tsconfigRootDir`s — the repo root and the
worktree — so it refuses to pick one and every file errors at `0:0` with a parsing error rather than
a lint finding. It looks like the code is catastrophically broken; it is the config. Either remove
the worktree or set `tsconfigRootDir` explicitly in the parser options. Until then a clean `pnpm
lint` is not evidence of anything, and neither is a dirty one — compare the error count against
`main` before believing a change caused it.

**`npx tsc --noEmit` reads stale generated types.** After deleting or renaming a route, `.next` still
holds validators importing the old path and typecheck fails on files you did not touch. `rm -rf
.next` first.

**Turbopack does not reliably invalidate `globals.css`.** `pnpm dev` uses Turbopack and will serve a stale CSS chunk across edits *and across server restarts*. After changing `globals.css`, `rm -rf .next` and restart, or you will debug a stylesheet the browser never loaded. This has produced several false readings; verify a rule is live (`getComputedStyle`, or search `document.styleSheets`) before concluding a CSS change didn't work.

There is no test runner and no `format` script. Prettier config exists (140 columns, single quotes, semicolons, no trailing commas) but only editors apply it; ESLint does not enforce formatting. The ESLint config has **no Next plugin**, so `@next/next/*` rule directives fail as unknown rules.

## Design system (`uf-`)

Everything visual lives in `src/app/globals.css`, namespaced `uf-` and scoped under a single `.uf` root element. It deliberately matches the extension's own UI — dark ground, `#eefb7a` lime, Figtree headings, Inter body, `--radius: 0.625rem` scale — so the site and the tool read as one product.

**Two accent roles, and they are not interchangeable:**

- `--uf-accent` is what you **fill** with (button backgrounds, the logo tile). Lime works on any ground.
- `--uf-accent-ink` is what you **set type in**. Lime text is illegible on a light ground, so in the light palette this becomes a deep olive `#55670f` while the fill stays lime.

Theming uses **next-themes** through shadcn's `ThemeProvider` pattern (`src/components/site/ThemeProvider.tsx`), mounted in the root layout with `attribute="class" defaultTheme="system" enableSystem`. That is why the palette is `:root` (light) overridden by **`.dark`** rather than a `prefers-color-scheme` media query — an explicit choice has to beat the OS. next-themes injects its own pre-paint script, so there is no flash and no bootstrap script of ours.

`ThemeToggle` (Auto / Light / Dark) sits in the header. It resolves the pressed state only after hydration via `useSyncExternalStore` — the active theme is unknowable during SSR, and a plain `mounted` effect trips the `react-hooks/set-state-in-effect` rule this repo enforces.

Both palettes clear WCAG AA: worst case 6.00 dark, 5.47 light.

**Heading treatment** ships as Geist, upright, sentence case, weight 400, tracking `-0.035em` (`-0.055em` for h1) — set via the `--uf-head-*` tokens, referenced from vercel.com and antigravity.google. Both sites carry their scale with tracking rather than weight.

**Nothing in the `uf-` system is uppercase.** `globals.css` contains zero `text-transform: uppercase`, and that is a deliberate, verified state — eyebrows, chips, captions, status lines, the in-page nav, the wordmark and every small label are sentence case. Labels are set around 11–12.5px at weight 500 with slightly negative tracking; the old treatment (8.5–10px, weight 700, `+0.1em`) is gone. Two consequences worth knowing:

- Source strings must already read correctly, because nothing re-cases them. They do today.
- `text-transform` **inherits**, so a sentence-case component nested inside an uppercase ancestor silently re-uppercases. `.uf-chip` sets `text-transform: none` explicitly for this reason — it nests inside `.uf-shot-cap`.

Uppercase was also destroying real identifiers: `.uf-log-src` renders `TEST_METHODS` entries such as `showOpenFilePicker` and `XMLHttpRequest.send`, which were rendering as `SHOWOPENFILEPICKER`. Wide tracking survives in exactly one place — `.uf-code-value`, the handoff pairing code, where character separation is the point.

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

**Source order matters as much as specificity.** Component base rules must sit *above* the `@container` bands in the file. A base rule appended at the end of `globals.css` beats a same-specificity override inside an earlier band, because later wins — this silently hid the theme toggle at every width, and the layout audit then passed precisely *because* the element had disappeared. If an audit starts passing right after you change a component's visibility, confirm the element still renders before believing it.

When auditing, compare each element's width against the container **and** check `scrollWidth > clientWidth` (children spilling out of their own parent); a width-only check misses case 3, because each flex item is individually narrower than the page. Skip elements inside an `overflow-x: auto` scroller (`.uf-toc`) — those legitimately scroll.

## Structure

- `src/components/site/SiteChrome.tsx` — `SitePage`, `SiteHeader`, `SiteFooter`, `PageHero`, `StatusLine`, `Logo`, `StoreLink`. Every page except the landing wraps in `SitePage`.
- `src/components/site/SiteLanding.tsx` — the landing page, composed inline (its own header/footer usage, not `SitePage`).
- `src/components/site/content.ts` — nav, hero chips, flow, surfaces, tools, transfers, compatibility. Edit copy here, not in components.
- `src/components/site/Clip.tsx` — the only client component in the site set. Autoplaying muted product recordings, with reduced-motion handled *at runtime* (poster + real controls, and it re-applies if the preference changes mid-session).
- `src/app/error.tsx` / `src/app/global-error.tsx` — the two error boundaries. `error.tsx` renders inside the root layout, so it reuses `SitePage`. `global-error.tsx` replaces the root layout, so it renders its own `<html>`/`<body>`, imports `globals.css` itself, and deliberately imports nothing from `components/site` — the layout, `ThemeProvider` included, is what failed. Neither is reachable in `pnpm dev`; the dev overlay takes over, so verifying a change to either means `next build && next start` plus a route rigged to throw.
- `public/site/` — two trimmed product recordings (`handoff.mp4`, `capture.mp4`) with WebP posters, plus the workspace screenshots. ~1.6 MB total.

Data modules `components/landing/content.ts`, `components/how-it-works/content.ts` and `components/whats-new/content.ts` are still the source of copy for their pages.

## Plan gate — the site must not outrun the product

The extension gates features two ways at once: by plan (free / silver / gold / platinum) **and** by
how mature a feature is in the build that actually ships. A stable free install therefore offers less
than the product contains, and a claim that is true of the product can still be false of the release
a visitor installs.

**Verify every feature claim against the internal notes before writing it** — not against the
feature's name, and not against this file. The current plan split, the maturity ladder, and the list
of what a stable build genuinely reaches are all maintained in the private workspace repo, because
enumerating what this site does *not* advertise is precisely the kind of thing this repo must never
contain. If you cannot confirm a claim from a customer-facing source, ask rather than infer.

Two tools are switched off in the current release and the site says so on purpose — see
`whats-new/content.ts` and the landing page. Telling users what is disabled is deliberate; listing
what is unreleased is not.

**Which tier a feature belongs to is moving out of the extension and into the service.** It is
becoming a value the backend states and signs rather than one compiled into the installed build. Two
things follow for this repo, and both are about not being the last to find out:

- **A tier can change without any release.** Plan assignments will be repriceable server-side, so
  copy that was accurate when written can go stale with nothing in any changelog to prompt a check.
  Treat a tier claim as perishable, and re-verify before a campaign rather than trusting that it was
  right last quarter.
- **Confirming a claim against a shipped build stops being sufficient.** During the migration the
  build and the service can disagree with no visible symptom. Ask for the current answer rather than
  reading it off a running install.

Prices are the exception and stay here — see below. This is about *which tier a feature sits in*, not
what a tier costs.

## Prices

The product itself still defines no prices; the **site** does, and
`src/components/site/plansContent.ts` is the single source for them. Free is `price: null` (no price,
rather than a price of zero); Silver, Gold and Platinum are `{ monthly, annual }` in whole US
dollars, where `annual` is the total charged once a year:

| Plan | Monthly | Annual | Effective | Saving |
| --- | --- | --- | --- | --- |
| Silver | $4 | $36 | $3/mo | $12 (25%) |
| Gold | $9 | $84 | $7/mo | $24 (22%) |
| Platinum | $19 | $180 | $15/mo | $48 (21%) |

Every other figure on the site is **derived**, never typed a second time — `monthlyEquivalent()` and
`annualSaving()` compute the effective rate and the saving, and the landing page's separate tier
cards in `content.ts` read theirs through `priceForPlanName()`. Change the two numbers per plan and
the whole site follows. The discount is not a round "two months free" and differs per tier, so do not
write a blanket saving claim in prose; the per-card note states the real figure.

`PlanExplorer` owns the monthly/annual toggle, the recommended-tier treatment, and the pointer
highlight. Three things about that card are easy to break:

- **One flag slot.** `recommended: true` on a plan yields to `data-current` — a card renders either
  "Your plan" or "Most popular", never both. Two account states (`active`, `offline`) put the user on
  Gold, which is also the recommended tier, so this collision is reachable, not theoretical. It is a
  single real element rather than two pseudo-elements precisely so they cannot share a corner.
- **The ring must stay masked.** `.uf-plan[data-recommended]::after` is a conic gradient clipped to a
  1px border by `mask-composite: exclude`. Without the mask the conic fills the whole box and sweeps a
  wedge of light across the card face — and `z-index: -1` will not save you, because `.uf-rise`
  animates `transform` and so makes the card its own stacking context.
- **The flag leaves the border at the floor.** Below 200px "Most popular" needs two lines, and a
  two-line pill at `top: -10px` rides down over the plan name. Base CSS puts it in flow; the 200px
  band restores the absolute straddle.

### The plan deck

The plans are a **swipeable stack at every width** — one card on top, the rest behind it, moved with
a drag, the arrows, the dots, or the arrow keys. Positions are circular, so it never runs out in
either direction. It sits in a 520px centred column; the billing row above is capped to the same
width so the two line up.

There is no longer a grid fallback. An earlier version showed the deck only below 620px and reverted
to a 2×2 grid above it, which meant a desktop visitor never saw the deck at all — that is why the
breakpoint, the `--uf-deck-on` CSS-to-JS flag, and the ResizeObserver that read it are all gone.

Four things hold it together, and each breaks quietly:

- **`transform` is contested.** The stack needs it for offset and scale, and `uf-rise` animates it.
  An animation wins over a static rule for the whole time it fills, so the two cannot coexist on one
  element — the plan cards carry no `uf-rise` class at all.
- **All cards share one grid cell** (`grid-area: 1 / 1`), so the stack is always as tall as the
  tallest plan and swiping never shifts the page. Measured 506px before and after a change.
- **The fan is symmetric about the active card.** Each card carries a signed `--uf-d` (shorter way
  round the rotation: negative left, positive right, zero centre) and its magnitude `--uf-depth`.
  Sign drives direction — offset and tilt — and magnitude drives recession — scale, fade, stacking.
  Anything past `DECK_DEPTH` has no side of its own and is hidden, so with four plans you always see
  three: previous, active, next. Never reintroduce a single unsigned position; that was the old
  one-directional stack and it put the active card off-centre.
- **The half-card spread needs two card widths.** From 380px the neighbours are offset
  `--uf-fan-x: 50%` — 50% of the card's *own* width — so roughly half of each stays visible either
  side. One card each side means the spread spans two full card widths, which is why the deck widens
  to 1100px and the card column becomes `min(520px, 48%)` of it: 48% is what guarantees it fits. The
  cost is real — the active card halves, down to ~170px at 380px — and that is why 380px is the
  floor for this: below it the halved card drops under the 130px the base layout is authored for, so
  the tucked stack stays.
- **Set `--uf-fan-x` in exactly one place.** The 620px band re-stating it as `7px` silently collapsed
  the spread back to a 3% peek at every width above 620, while the bands below kept working. Higher
  bands should only widen the *tilt*.
- **The fan angle scales with room, and must.** Cards behind recede in opacity (1 · 0.65 · 0.3) at
  every width, but they only *tilt* from 380px. Rotating a card adds `height × sin(angle)` to its
  bounding box, and these are several hundred pixels tall: a fixed 3.2°/card looked right at 900px
  and sliced 20px off the third card's corner at 380px against `html { overflow-x: hidden }`. Hence
  `--uf-fan-a` / `--uf-fan-x`, at 0 below 380, 1.5°/5px to 619, and 3.2°/7px above. Re-tune those
  two numbers, never the transform.
- **The `I:` audit check cannot judge this deck.** The fan deliberately paints outside the deck's
  box, so `scrollWidth > clientWidth` is by design and propagates up every ancestor — `.uf-deck`,
  `.uf-deck-stack`, `.uf-stack-l`, `.uf-inner`, `MAIN`. None of it is overflow. The two checks that
  actually mean something here are whether each visible card sits inside `.uf`, and whether
  `document.documentElement` scrolls horizontally. Both hold at every width.
- **`inert` waits for hydration.** It is a DOM attribute, not a style. Applied server-side it would
  strip three of the four plans from the accessibility tree for anyone whose JavaScript never
  arrives — and without JavaScript there is no way to swipe them back. `useSyncExternalStore` gates
  it, the same shape ThemeToggle uses. The served HTML has zero `inert` and all four plan names.

  **`MaintenanceOverlay` does the exact opposite, deliberately — do not "fix" one to match the
  other.** It marks its covered region `inert` in the served HTML, because the rule above turns on
  *recovery*: the deck's hidden cards can be swiped back, so blocking them before hydration would
  strand a no-JavaScript reader. The overlay's controls do nothing in every case, JavaScript or not,
  so there is nothing to recover and making them unreachable server-side is the honest state. One
  attribute also covers the accessibility tree and the tab order, which is why the component sets no
  `aria-hidden` or `tabIndex` of its own.
- **`width: 100%` is load-bearing.** `.uf-stack-l` is a column flex container, so `max-width` alone
  leaves the deck shrink-to-fit — it rendered 353px instead of 520px until the explicit width.

Drag sets `--uf-drag` (px) and `--uf-drag-n` (unitless) on the deck. Both are needed because `calc()`
cannot turn px into deg for the tilt. The dismiss threshold is `max(36px, 22% of width)` — a fixed
60px would be 40% of the card at the 150px floor.

The nav row is the tightest thing on the page at 150px: two arrows, four dots and the gaps have to
fit a 130px content box, so they start small and grow at 200px. It overflowed on the first pass.

The per-plan discount is why the shared hint above the grid says only "up to 25% less" — 25% is
Silver's, and Gold and Platinum save less.

Prices are deliberately absent from the extension, the `/handoff` surface, and anything the extension
renders — keep them on marketing surfaces only.

## Gotchas

- `/demo` is a re-export of `/test` — both URLs render the interceptor harness.
- `interceptorTestTypes.ts` exposes `TEST_METHODS`; log entries and the progress meter index into it **positionally**, so reordering that array silently mislabels results.
- `/api/test-upload` is a byte-count sink used only by the harness, and is now the only route under `src/app/api/`. The `/api/upscale` proxy that used to sit beside it was removed in #10 — it forged browser headers to fetch a third-party page and served `Access-Control-Allow-Origin: *`, and nothing ever called it. Do not reintroduce that shape; upscaling runs locally in the extension.
- `/handoff` parses a base64url `#pair=` fragment inside a `setTimeout(0)` so the fragment never reaches the server render; malformed payloads fall through to an invalid state.
- Navigation uses plain `<a>` and `<img>` — `next/link` and `next/image` are not used anywhere.
- **Tailwind preflight strips `list-style`,** and `.uf-prose ul` only restores margin and padding — so a plain `<ul>` renders as an indent with no markers at all. Use `.uf-dots` for bullets or `.uf-flow` for numbers; both draw their own markers via `::before`. (`src/app/privacy/page.tsx` still has two plain `<ul>`s and is showing this today.)
- **`global-error.tsx` applies the theme twice, and needs to.** Its inline pre-paint script covers a server-render failure. When the failure happens during *hydration* instead, React discards the tree and renders the boundary client-side — a script inserted that way never executes, and re-rendering `<html>` drops the class the script had set. An effect covers that second path. Delete either half and the page renders light with `"dark"` in storage.

## Heading tokens

The heading treatment stays token-driven: `--uf-head`, `--uf-head-style`, `--uf-head-case`,
`--uf-head-weight`, `--uf-head-track` and `--uf-head-track-lg` (h1 sits tighter than the rest of the
scale). Change a heading in the tokens, not in the two rules that consume them — the base `h1–h6`
rule and `.uf h1–h4` must not drift apart.

The `TypePreview` dev control that once drove these tokens has been removed along with its
`.uf-typedock*` CSS; the chosen values are the token defaults now.
