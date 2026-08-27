# ADR-0002 — Published as ESM with per-component CSS

**Status**: accepted

## Decision

Foundation publishes **ESM only**, built by Vite in library mode. Each component
emits its own stylesheet, and the `import './Button.css'` statement **survives
into the published module**. `package.json` declares:

```json
"type": "module",
"sideEffects": ["**/*.css"]
```

A bundled `dist/styles.css` ships alongside, reachable at the
`./styles.css` subpath, as an escape hatch.

## Rationale

- A consumer importing one component should ship one component — **JS and CSS
  both**. Per-component stylesheets are the only layout where a bundler can drop
  the CSS of a component nobody imported.
- CSS has no export graph. It is reachable solely through a JS import statement,
  which is precisely the statement tree-shaking wants to delete. `sideEffects`
  is what resolves that tension, and **both halves of the value matter**:
  - **Field omitted** → bundlers assume every module is impure, drop nothing,
    and **all CSS ships**. Silent, and the common failure.
  - **`"sideEffects": false`** → bundlers are told the CSS imports are safe to
    delete, so they do, and **components render unstyled**. Loud, and worse.
- CSS Modules hash every class per module, so `.primary` in `Button` and
  `.primary` in `Badge` are different selectors. Cross-component collisions are
  structurally impossible, which is why bundler-chosen CSS order is not a hazard
  here.

## Consequences

- **The `sideEffects` value is load-bearing.** Do not "simplify" it.
- Three conditions must hold for a consumer to actually shake: ESM resolution,
  the `sideEffects` field, and a bundler that follows CSS imports from
  `node_modules`. Vite, webpack + css-loader and Next.js all qualify; plain
  `tsc`, Node without a bundler, and Vitest/Jest without a CSS transform do not.
- Those last cases are why `./styles.css` exists. It is the documented fallback,
  not a second-class path.
- **`tokens.css` is always an explicit import** and is not shakeable — it is
  `:root` custom properties that every component's CSS depends on. That is the
  contract, not a wart. See [ADR-0003](0003-tokens-ship-in-the-package.md).
- Interactive components carry a `"use client"` banner so Next.js App Router
  consumers can import them. Vite's lib build strips directives by default; a
  Rollup `banner` step puts them back.
