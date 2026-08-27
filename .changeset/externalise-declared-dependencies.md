---
'@laurensbooij/foundation-ds': patch
---

Stop bundling declared dependencies into the published package.

`0.1.0` shipped a second copy of `lucide-react` inside
`dist/node_modules/.pnpm/lucide-react@1.34.0_react@19.2.8/`, with the build
machine's store path baked in — while also declaring `lucide-react` as a
dependency, so consumers installed it twice and could never dedupe the two.

Externals are now derived from `package.json` rather than hand-listed, so a
dependency added later cannot be silently inlined the same way. The package
drops from 359 kB to 292 kB unpacked, and from 211 files to 135.
