# ADR-0005 — Icon ships a curated glyph map, not per-glyph exports

**Status**: accepted

## Decision

`Icon` takes a **name**, not a node:

```tsx
<Icon name="search" size="md" />
<Button iconStart="plus">Add item</Button>
```

The names resolve through a runtime map (`ICON_GLYPHS`) over the **29 glyphs
Figma draws**. `lucide-react` is a regular **dependency**, not a peer.

The consequence is accepted deliberately: **importing `Icon` ships all 29
glyphs**, roughly 11 kB raw / 3.5 kB gzip, regardless of how many render.

## Rationale

`Icon` is not a re-export of `lucide-react`. Three things earn its place:

- **A bounded vocabulary.** 29 names as a union type. Without it, any consumer
  reaches into ~1,600 Lucide glyphs and the design system has no say in its own
  iconography.
- **An accessibility contract.** Decorative by default (`aria-hidden`);
  `role="img"` + `aria-label` only when `label` is passed. `role`, `aria-hidden`,
  `aria-label` and `tabIndex` are **omitted from the props type**, so a caller
  physically cannot break it. A bare `<Plus />` gets this wrong by default.
- **The size scale.** `width` and `height` are omitted from props; sizing goes
  through the token-driven scale (`xs` 12 · `sm` 16 · `md` 20 · `lg` 24 ·
  `xl` 32), which Foundations already defines.

The rejected alternatives, and why:

- **`icon={Plus}` (a component prop)** — fully shakeable, but it destroys the
  name union, ends the curation, and contradicts Figma's own spec text: _"Icons
  are Lucide names, not nodes."_
- **Per-glyph subpath exports** — shakeable and verbose, and still cannot feed
  `Button`'s named `iconStart` prop.
- **Both APIs at once** — two public surfaces for the same job, to save 3.5 kB.

An object literal keyed by name is **unshakeable in principle**, not by
oversight: a bundler cannot prove which key a runtime lookup will read, so every
value stays reachable. This is the cost of the name union, and it is the trade
being made.

## Consequences

- Tree-shaking's real prize here is **not shipping unused components**, which
  [ADR-0002](0002-published-as-esm-with-per-component-css.md) delivers. The
  glyph floor is a known, bounded exception to it.
- Adding a glyph means **drawing it in Figma first**, then adding the entry.
- Map keys mirror Lucide's own kebab-case names so the two stay comparable by
  eye. Several Figma names are Lucide's **older aliases** and need mapping to
  current exports: `alert-circle` → `CircleAlert`, `alert-triangle` →
  `TriangleAlert`, `check-circle` → `CircleCheck`, `more-horizontal` →
  `Ellipsis`. Figma's name stays the public API.
- If the set grows past roughly 60 glyphs, revisit this ADR. The trade is sized
  for a small curated set, not an open library.
