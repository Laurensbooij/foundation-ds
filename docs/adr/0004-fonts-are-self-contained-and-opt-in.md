# ADR-0004 — Fonts are self-contained and opt-in

**Status**: accepted

## Decision

Foundation ships its three typefaces — **Outfit** (display), **Public Sans**
(UI) and **IBM Plex Mono** (numerals) — as **woff2 files copied into `dist/`**
at build time, with a generated `dist/fonts.css` that points at them by relative
URL. It is reachable at the `./fonts.css` subpath and is **opt-in**:

```js
import "@laurensbooij/foundation-ds/tokens.css"; // required
import "@laurensbooij/foundation-ds/fonts.css"; // optional
```

`@fontsource-variable/*` are **devDependencies**. Consumers never install them.

Variable faces where they exist, **woff2 only**, latin subsets.

## Rationale

- `tokens.css` **names** the families (`--family-display: Outfit`). `fonts.css`
  **loads** them. Splitting those two jobs is what makes "bring your own
  typeface" a one-line override rather than a fork.
- The rejected alternative was re-exporting: `fonts.css` as
  `@import '@fontsource/outfit/latin-400.css'`. A **bare specifier in a CSS
  `@import` is not resolvable by a browser** — only by a bundler with node
  resolution. That would make `fonts.css` silently broken as a plain `<link>`,
  and would push `@fontsource` onto every consumer's install.
- Copying the files instead costs package size and buys correctness everywhere.
- Variable faces replace ~12 static weight files with 3–4 files, cutting both
  total bytes and request count. `woff2` has had universal support for years, so
  the `woff` fallbacks `@fontsource` also emits are dead weight.

## Consequences

- The package is meaningfully larger than a code-only library. That is the
  trade, taken knowingly.
- A consumer with their own typefaces imports `tokens.css`, overrides
  `--family-*`, skips `fonts.css`, and pays **zero font bytes**.
- `font-display: swap` comes from the `@fontsource` sources — preserve it.
- Preload hints (`<link rel="preload" as="font" crossorigin>`) are the
  consumer's job. The package documents them; it cannot emit them.
