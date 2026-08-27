# foundation-ds

**Foundation** — an accessible React design system, published as
`@laurensbooij/foundation-ds`. React 19 + TypeScript, CSS Modules, tokens
generated from a Figma export, ESM with per-component CSS so consumers can tree
shake it.

Read [CONTEXT.md](CONTEXT.md) for the domain vocabulary and use it exactly.
Decisions with rationale live in [docs/adr/](docs/adr/). The current build order
is [docs/plan.md](docs/plan.md) — delete it once `0.1.0` ships.

> **Status: skeleton.** Only docs and `package.json` exist. The toolchain and
> components land in phases 2 and 3 of the plan.

## Commands

Land with the toolchain in phase 2. Intended surface:

- **Lint** — `pnpm lint` · **Fix** — `pnpm lint:fix`
- **Typecheck** — `pnpm typecheck` · **Test** — `pnpm test`
- **Build** — `pnpm build` · **Storybook** — `pnpm storybook`
- **Tokens** — `pnpm tokens` (rebuilds `src/styles/tokens.css` from
  `tokens/figma/*.json`)

## Must-follow rules

- **Figma is the contract** (ADR-0001). A component ships only once Figma draws
  it; its **variant properties are the props**. Where a documentation frame
  disagrees with the component set, the component set wins. `Modal` is the one
  recorded exception — exported with no Figma page.
- **Never edit `src/styles/tokens.css`** — it is generated (ADR-0003). Change
  `tokens/figma/*.json`, then run `pnpm tokens`.
- **Never import `react-intl` or any i18n package** (ADR-0006). Foundation ships
  no copy. Every string is a prop; accessible names are **required** props,
  never defaulted to English.
- **`"sideEffects": ["**/*.css"]` in `package.json` is load-bearing** (ADR-0002).
  Omitting it ships all CSS to every consumer. Setting it to `false` deletes the
  CSS imports and renders components unstyled. Do not "simplify" it.
- **Query by accessible identity in tests** (ADR-0007); `getByTestId` only where
  no accessible identity exists. Testids stay **mandatory** on interactive and
  state-bearing elements. Every component spec ends with
  `expectNoAxeViolations`.
- **WCAG 2.2 AA is the product**, not a review step — this package ships the
  accessibility contract every consumer inherits.
- **Adding an icon glyph means drawing it in Figma first** (ADR-0005), then
  adding the `ICON_GLYPHS` entry.
- **`cx` is internal** — bundled, never exported. It is not part of the public
  API.
- **One story per component**, covering the variant matrix as a grid via the
  shared `VariantGrid` chrome. Never one story per variant.

## Adapting from `sliding-puzzle`

Most implementations come from `../sliding-puzzle`. It is a **source of code,
not of truth** — it carries game-specific variants that must not ship here.
Known strips: `IconButton`'s `onWood`, `Dialog`'s `win`, and 17 of its 26 icon
glyphs. Check every port against Figma.

## Git workflow

- Conventional Commits (`<type>(<scope>): <desc>`); branch names
  `<type>/<short-desc>`.
- PRs **squash-merge**; the PR title becomes the commit subject on main, so PR
  titles are Conventional Commits too.
- Feature branches may be pushed; **main is never pushed directly**.
- Releases go through **Changesets** — every user-facing change needs a
  changeset. Merging the "version packages" PR publishes to npm via **trusted
  publishing** (ADR-0008); there is no local publish and no stored npm token.
