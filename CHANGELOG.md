# @laurensbooij/foundation-ds

## 0.1.1

### Patch Changes

- 6836a78: Stop bundling declared dependencies into the published package.

  `0.1.0` shipped a second copy of `lucide-react` inside
  `dist/node_modules/.pnpm/lucide-react@1.34.0_react@19.2.8/`, with the build
  machine's store path baked in — while also declaring `lucide-react` as a
  dependency, so consumers installed it twice and could never dedupe the two.

  Externals are now derived from `package.json` rather than hand-listed, so a
  dependency added later cannot be silently inlined the same way. The package
  drops from 359 kB to 292 kB unpacked, and from 211 files to 135.

## 0.1.0

### Minor Changes

- 5d51275: First release of Foundation.

  Eleven components, generated from the Foundation Figma file: `Badge`, `Button`,
  `Card`, `Dialog`, `Icon`, `IconButton`, `Modal`, `Select`, `Switch`,
  `TextInput` and `Tooltip`.

  - **Ships ESM with per-component CSS**, so a bundler drops the JS _and_ the
    stylesheet of every component you do not import.
  - **Design tokens** at `@laurensbooij/foundation-ds/tokens.css` — a required
    one-line import that every component's styles depend on.
  - **Opt-in self-hosted typefaces** at `@laurensbooij/foundation-ds/fonts.css`.
    Skip it and override three variables to bring your own, at zero font bytes.
  - **A bundled `styles.css`** for environments that cannot follow CSS imports
    out of `node_modules`.
  - **WCAG 2.2 AA is the contract**: accessible names are required props, icons
    are decorative by default, and every component spec ends in an axe assertion.

  React 19 or newer is a peer dependency.
