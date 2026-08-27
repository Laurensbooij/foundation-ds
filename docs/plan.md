# Build plan

**Temporary.** Delete this file once Foundation `0.1.0` is published and
`react-ts-template` consumes it.

Decisions with rationale live in [adr/](adr/). This file is only the order of
work.

## Phase 1 — Figma pass

Run this **before writing any component code**, so the file is the contract by
the time it is ported. File:
[Foundation](https://www.figma.com/design/mXleT3Wlwak23iOXkE5yHd/).

- [x] Cover wordmark → **Foundation**
- [x] **Deleted the brand wordmark group** (`3:3786`) from Foundations
- [x] Type specimen → _"Foundation design system"_ (`3:3352`); Brand card
      subtitle rewritten
- [x] **TextInput** (`24:1293`) — refit the focus ring at every size
- [x] **Select** (`3:6439`) — refit the focus ring at every size
- [x] **Dialog** (`3:6534`) — full `win` strip: recast the `warning` variant as
      a caution, corrected badge glyphs, renamed puzzle layers, fixed the
      swapped axis labels, added the missing `danger` column, corrected the
      usage and subtitle copy
- [x] **Renamed the file** → **Foundation** — done manually in the Figma UI. The
      Plugin API rejects it: `Setting the document name is currently not
supported`.
- [x] **Select** — brought up to TextInput's structure and given an `invalid`
      state (see below)
- [x] **Dialog** `accent` — given neutral-confirm copy so the specimen matches
      its documented purpose

**Phase 1 is complete.**

### Premises that turned out to be wrong

Recorded so they are not re-litigated:

- **The field radius was never `pill`.** Both fields are `radius: 14` =
  `radius/md`, as specified. The real defect was that `focus spacer` and
  `focus ring` had their **heights hardcoded to the `md` size** — drawn right
  for `md`, then copied to `sm` and `lg` without resizing. At `sm` the ring
  overhung 16px into the hint; at `lg` it sat flush on the border.
- **TextInput's `invalid` was already correct** — 2px, bound to a danger
  variable, at all three sizes.
- **Button already has `Icon left` and `Icon right` boolean properties.**
  Nothing to add. Boolean component properties do not appear in variant names,
  which is why the earlier metadata read missed them.
- **Dialog's component set was already clean** (`Tone` =
  `accent | warning | danger`). All the `win` residue was in layer names, copy
  and documentation.

### Icon `Size` — deliberately NOT a Figma property

Adding `Size` as a variant property would take Icon from **29 variants to 145**.
Figma's own usage note says _"Name is the only property. Resize the instance to
the context size."_ Foundations already documents the scale
(`xs` 12 · `sm` 16 · `md` 20 · `lg` 24 · `xl` 32) at `3:3534`, which is what the
code's `size` prop implements. Instance resizing is the correct Figma idiom.

**This is a deliberate, bounded exception to ADR-0001.** `Icon`'s `size` prop
has no matching Figma variant property, and should not gain one. The scale it
implements is the one Foundations documents.

### Select — rebuilt to match TextInput

`Select` had no hint node and no component properties at all — only `State` and
`Size` variants. WCAG SC 3.3.1 requires an error be **described in text**, so
`invalid` was unimplementable until Select had somewhere to put that text.

What changed:

- Added a `hint` node to all 12 existing variants, using TextInput's text style
  and `text/muted` binding. Heights now match TextInput exactly: 75 · 83 · 91.
- Added `invalid` at all three sizes — 2px `border/danger` field, hint tinted
  `text/danger`.
- Added the five component properties TextInput already had: `Label` and `Hint`
  booleans, plus `Label text`, `Value` and `Hint text`, bound across all 15
  variants.
- Laid the set out as a 5-state × 3-size grid, and corrected the axis labels,
  which listed four states across three size columns.

**Both field components are now structurally identical.** The port should treat
them as one shell with two contents.

## Phase 2 — Toolchain

- [x] Vite library mode, ESM output, `'use client'` preserved (ADR-0002)
- [x] CSS Modules → per-component CSS + bundled `styles.css` (ADR-0002)
- [x] Style Dictionary token build, `tokens/figma/` sources (ADR-0003)
- [x] Font build, variable faces, woff2 only (ADR-0004)
- [x] ESLint + Stylelint + Prettier, TypeScript, Vitest + axe helper
- [x] Storybook + `addon-a11y` + `storybook-addon-pseudo-states`
- [x] Changesets + GitHub Actions (CI + provenance release)
- [x] `pnpm verify:package` — publint + attw

**Phase 2 is complete.** Every gate passes: format, lint, stylelint,
typecheck, test, build, verify:package.

### What the tree-shaking test found

The pipeline was validated against a packed tarball consumed by a real Vite app
before any component was written. Three defects it caught, none visible from
inside this repo:

- **The `.module.css` trap** — the emitted stylesheets must not keep the
  `.module` infix, or a consumer's bundler re-hashes them as CSS Modules and the
  component ships **unstyled with no error**. `assetFileNames` strips it.
- **Build ordering** — `vite build` empties `dist/`, so the font and style steps
  have to run after it, not before.
- **A duplicated `'use client'`** — Rolldown already preserves directives, so
  the directive plugin was emitting the banner twice. Plugin removed.

The harness is worth keeping: `pnpm build && pnpm pack`, install the tarball in
a throwaway app, build, grep the output. See ADR-0002.

### Toolchain notes

- **axe's colour-contrast rule cannot run in jsdom** (no canvas). Unit specs
  cover structure and naming; contrast is covered by `addon-a11y` in Storybook,
  which runs in a real browser. Do not assume a green `pnpm test` means contrast
  is checked.
- **Prettier's `embeddedLanguageFormatting` is `off`.** The sort-imports plugin
  reorders code inside markdown fences, which silently inverted a documented
  import example.
- `vitest` runs with `passWithNoTests` until Phase 3 lands the first spec.

### Story architecture

- **One story per component** covering the variant matrix in a grid — not one
  story per variant.
- A shared story-chrome module (`VariantGrid` with axis labels) so Storybook
  mirrors Figma's documentation frames 1:1.

## Phase 3 — Components

Ported from `sliding-puzzle`, adapted per ADR-0001. Order follows the dependency
graph — `Icon` first, since `Button`, `IconButton`, `Badge` and `Select` all
need it.

| #   | Component    | Work                                                                                                                                                   |
| --- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | `Icon`       | Keep the component. **Replace all 26 glyphs with Figma's 29** — only 9 overlap. Map Lucide's renamed aliases.                                          |
| 2   | `Button`     | Variants match exactly. Keep `iconStart` / `iconEnd`.                                                                                                  |
| 3   | `IconButton` | **Strip the `onWood` variant.**                                                                                                                        |
| 4   | `Badge`      | Straight port.                                                                                                                                         |
| 5   | `Card`       | Straight port.                                                                                                                                         |
| 6   | `Switch`     | **Add the `Description` slot** — new in Figma.                                                                                                         |
| 7   | `Modal`      | Straight port. Exported (ADR-0001).                                                                                                                    |
| 8   | `Dialog`     | **`kind`(`win`\|`confirm`) → `tone`(`accent`\|`warning`\|`danger`).** Strip the `@i18n` import; close-button label becomes a required prop (ADR-0006). |
| 9   | `Tooltip`    | Straight port.                                                                                                                                         |
| 10  | `Select`     | Port, plus the new `invalid` state.                                                                                                                    |
| 11  | `TextInput`  | **Build new** from the corrected Figma design.                                                                                                         |

Cross-cutting, every component:

- Strip `@i18n` / `@messages` imports (ADR-0006)
- `cx` moves in as an internal util — **not exported**
- `"use client"` on interactive components
- Consolidated grid story + spec ending in `expectNoAxeViolations` (ADR-0007)

## Phase 4 — Publish

- [ ] Verify the tree-shaking contract before the first publish: `publint`,
      `arethetypeswrong`, and a throwaway consumer app importing one component
      with the emitted bundle inspected. ADR-0002's `sideEffects` value is
      load-bearing and untested until this runs.
- [ ] Publish **`0.1.0`**

## Phase 5 — Cut `react-ts-template` over

One PR, after `0.1.0` is on npm.

- [ ] Add `@laurensbooij/foundation-ds`; import `tokens.css` and `fonts.css`
- [ ] Delete `tokens/`, `scripts/build-tokens.mjs`, `src/styles/tokens.css`,
      `src/styles/fonts.ts`, `src/components/Button/`
- [ ] **Amend ADR-0001** — retier on _published vs app-local_, not _reusable vs
      not_. `@components/*` survives as the app-local shared tier.
- [ ] **Supersede ADR-0003** — tokens are no longer generated in the template
- [ ] **New ADR-0008** — the template consumes Foundation
- [ ] Update `CLAUDE.md` and `docs/conventions/styling.md`
