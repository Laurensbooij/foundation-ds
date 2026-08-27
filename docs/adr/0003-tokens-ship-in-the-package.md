# ADR-0003 — Tokens ship in the package, as CSS only

**Status**: accepted

## Decision

Foundation **owns the design tokens**. `tokens/figma/*.json` (DTCG, TokensBrücke
export format) and the Style Dictionary build (`pnpm tokens`) live in this repo,
and generate `dist/tokens.css`, reachable at the `./tokens.css` subpath.

Tokens ship as **CSS custom properties only**. There is no JS or TS mirror.

Consumers import it once:

```js
import '@laurensbooij/foundation-ds/tokens.css'
```

`react-ts-template` deletes its own `tokens/` directory and
`scripts/build-tokens.mjs`, and consumes this file instead.

## Rationale

- Every component stylesheet references `var(--color-text-strong)` and its kin.
  If the consumer can load the components without the variables, the components
  render broken. One source of truth is the only version of this that holds.
- Two sources drift. The template and the package would have disagreed within a
  release.
- A JS mirror (`spacing[4]`) is a second source of truth for the same values,
  maintained by hand or by a second build step. No component needs it — they are
  all styled in CSS — so it would exist only to drift.

## Consequences

- **Never edit `src/styles/tokens.css`.** Change `tokens/figma/*.json`, then run
  `pnpm tokens`. CI fails on drift.
- Stylelint's strict-value rule forces components to consume tokens, never
  literals. A new design value becomes a new token, never a hex in a module.
- `tokens.css` is global and unshakeable by design. See
  [ADR-0002](0002-published-as-esm-with-per-component-css.md).
- Regenerating tokens from Figma is now **this repo's job**. The template can no
  longer do it.
- Token names mirror the Figma path: `space/3` → `--space-3`. Never invent an
  alias for a token that already exists.
