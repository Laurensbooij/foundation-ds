# ADR-0001 — Figma is the contract for the public API

**Status**: accepted

## Decision

The Figma file **Foundation** defines what Foundation exports. A component ships
only once Figma draws it as a component set; its **variant properties are the
prop names and values**. Where a Figma documentation frame disagrees with the
component set it documents, the **component set wins** — doc frames go stale,
variant properties do not.

Foundation v1 exports eleven components. Ten come from Figma:

`Icon` · `Button` · `IconButton` · `Badge` · `Card` · `Switch` · `Dialog` ·
`Tooltip` · `TextInput` · `Select`

**`Modal` is the one exception** — exported despite having no Figma page.

## Rationale

- The implementations are adapted from the `sliding-puzzle` repo, which carries
  variants that exist only for that game. Anchoring on Figma is what strips them:
  `IconButton`'s `onWood`, and `Dialog`'s `win`, both die here.
- The reverse pull is just as real. `sliding-puzzle` draws 26 Lucide glyphs;
  Figma draws 29, and **only 9 overlap**. Its set is a puzzle's vocabulary
  (`flame`, `trophy`, `shuffle`); Foundation's is a product's (`search`,
  `trash-2`, `calendar`). Code reuse without this rule would have shipped the
  wrong one.
- "The component set beats the doc frame" is not pedantry. `Dialog`'s doc grid
  says `Kind = win | confirm` while its component set says
  `Tone = accent | warning | danger`. One of them had to lose.

## The `Modal` exception

`Dialog` is a thin layer over `Modal`, which owns the top layer, focus landing,
the scroll lock and controlled Escape. Figma draws the card, never the shell —
so `Modal` has no page and never will unless someone draws one.

It is exported anyway, deliberately: a consumer who needs a bare modal should not
have to reimplement focus management that already ships here. This is recorded
so it reads as a decision rather than an oversight.

## Consequences

- A new component starts in Figma, not in an editor.
- `SegmentedControl` and `StatCard` exist in `sliding-puzzle` and are **not**
  ported — Figma does not draw them.
- Where Figma is thinner than the code needs, the fix is **to Figma first**.
  `Button` gains an `Icon` property and `Icon` gains a `Size` property in the
  file before either lands in code.
- `Modal` stays the only exception. A second one means this ADR was wrong and
  should be superseded, not quietly extended.
