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
  is what resolves that tension.
- CSS Modules hash every class per module, so `.primary` in `Button` and
  `.primary` in `Badge` are different selectors. Cross-component collisions are
  structurally impossible, which is why bundler-chosen CSS order is not a hazard
  here.

## Verified, not assumed

Measured against a packed tarball consumed by a real Vite 8 app importing one of
two components. **Re-run this before the first publish and after any build
change** — `pnpm build && pnpm pack`, install the tarball in a throwaway app,
build it, and grep the output.

| `sideEffects`  | used component's CSS | unused component's CSS |
| -------------- | -------------------- | ---------------------- |
| omitted        | ships                | **ships — the leak**   |
| `false`        | ships                | dropped                |
| `["**/*.css"]` | ships                | dropped                |

Two things this corrected, both of which had been asserted here from memory:

- **`"sideEffects": false` did not break styling** under Vite 8 / Rolldown; the
  reached CSS still shipped. It stays wrong to publish, because webpack _does_
  drop the import — but that failure is unverified here, so do not repeat the
  claim as though it were measured.
- **`**/*.module.js` in `sideEffects` is unnecessary.** It was added while
  chasing the wrong cause and made no difference.

### The `.module.css` trap

The emitted stylesheets must **not** keep the `.module` infix. Published as
`Alpha.module.css`, a consumer's bundler treats the file as a CSS Module to
re-hash rather than a plain sheet to include — the rule is silently dropped
while the hashed class name stays baked into the JS, so the component renders
**unstyled with no error anywhere**. `assetFileNames` in `vite.config.ts` strips
it. This cost an hour to find and is invisible in the library's own build.

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
- Interactive components carry a `'use client'` directive so Next.js App Router
  consumers can import them. **Vite 8's Rolldown preserves it natively** — a
  directive plugin is not needed and emits the banner twice.
- The CSS import lands in the CSS-module proxy chunk (`Button.module.js`), not
  in `Button.js` itself. That is fine: the proxy is reachable only through the
  component, so it shakes identically.

### Relative imports carry explicit extensions

Every relative import in `src/` ends in `.js` — `'../Icon/index.js'`, not
`'../Icon'`. Rolldown rewrites the runtime JS either way, but **`vite-plugin-dts`
does not rewrite the declarations**, so extensionless directory imports survive
into `dist/**/*.d.ts` where Node 16 ESM resolution cannot follow them. The
package builds, publishes and runs; only consumers on
`"moduleResolution": "node16"` see it, as broken types.

`attw` catches this as `InternalResolutionError`, which is why
`pnpm verify:package` runs in CI.

## Package verification

`pnpm verify:package` runs `publint` and `attw` in CI. Three suppressions, all
deliberate:

- **`--profile node16`** — Node 10 predates `exports`. `engines` requires Node
  20, so its resolution failure is not a defect.
- **`--ignore-rules cjs-resolves-to-esm`** — the package is ESM-only by
  decision. A CJS consumer must use dynamic `import()`; that is the contract,
  not a bug to fix.
- **`--exclude-entrypoints ./tokens.css ./fonts.css ./styles.css`** — `attw`
  checks type resolution, and stylesheets have no types.

Remove a suppression only if the decision behind it changes.
