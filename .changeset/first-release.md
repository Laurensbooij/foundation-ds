---
'@laurensbooij/foundation-ds': minor
---

First release of Foundation.

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
