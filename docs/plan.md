# Build plan

**Temporary.** Delete this file once Foundation `0.1.0` is published and
`react-ts-template` consumes it.

Decisions with rationale live in [adr/](adr/). This file is only the order of
work.

## Phase 1 — Figma pass

Run this **before writing any component code**, so the file is the contract by
the time it is ported. File:
[Foundation](https://www.figma.com/design/mXleT3Wlwak23iOXkE5yHd/).

- [ ] Rename the file **Default design system** → **Foundation**
- [ ] **Delete the brand wordmark** (`3:3789`) — it still reads "Slider Puzzle"
- [ ] Update the type specimen string _"Default design system"_ (`3:3352`)
- [ ] **TextInput** (`24:1293`) — radius `pill` → `md`; refit the focus ring;
      `invalid` → 2px `border/danger`
- [ ] **Select** (`3:6439`) — radius `pill` → `md`; refit the focus ring;
      **add an `invalid` state**
- [ ] **Dialog** (`3:6534`) — delete the `win` variant; `tone` =
      `accent | warning | danger`; fix the stale "Kind" doc grid
- [ ] **Button** (`3:1984`) — add the `Icon` property
- [ ] **Icon** (`3:1879`) — add the `Size` property (12 · 16 · 20 · 24 · 32)

**On the focus ring.** In both `TextInput` and `Select` the field is drawn at
`radius/pill` while its focus ring is drawn at ~`radius/md`, so the ring's
corners cut inside the field's. The ring is correct and the field is wrong —
TextInput's own usage note says _"Same 40px shell as Select — radius md."_ One
fix resolves both symptoms in both components.

## Phase 2 — Toolchain

- [ ] Vite library mode, ESM output, `"use client"` banner step for interactive
      components
- [ ] CSS Modules → per-component CSS + bundled `styles.css` (ADR-0002)
- [ ] Style Dictionary token build, `tokens/figma/` sources (ADR-0003)
- [ ] Font copy step, variable faces, woff2 only (ADR-0004)
- [ ] ESLint + Stylelint + Prettier, TypeScript, Vitest + `vitest-axe`
- [ ] Storybook + `addon-a11y` + `storybook-addon-pseudo-states`
- [ ] Changesets + GitHub Actions publish with provenance

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
