# Domain glossary

The single vocabulary for Foundation. Use these terms **exactly** — in code,
tests, commits, docs and Figma. Read this before naming anything.

Format: each term gets a definition and an _Avoid_ list of banned synonyms. Two
names for one concept is how a codebase stops being searchable.

## Foundation

The design system: the Figma file, the tokens generated from it, and the React
components published as `@laurensbooij/foundation-ds`.

_Avoid:_ the design system, foundation-ds (as a spoken name), Default design
system, Slider Puzzle.

## Component set

A Figma component with variant properties. **The public API contract** — its
variant property names and values are the component's prop names and values
(ADR-0001).

_Avoid:_ symbol, master component, variant group.

## Documentation frame

A Figma frame that _describes_ a component set — grids, usage notes, axis
labels. Explanatory only. **Loses to the component set** whenever the two
disagree (ADR-0001).

_Avoid:_ doc page, spec frame.

## Token

A named design value generated from `tokens/figma/*.json` into a CSS custom
property. `space/3` becomes `--space-3`.

_Avoid:_ variable, constant, design value.

## Primitive

A raw token in a colour ramp — `ink`, `teal`, `amber`, `rose`. Never referenced
directly by a component.

_Avoid:_ base token, palette entry.

## Semantic token

A token that names a _role_ rather than a value: `text/strong`,
`surface/card`, `border/default`. What components actually reference.

_Avoid:_ alias token, applied token.

## Tone

`Badge` and `Dialog`'s variant property — the meaning a component carries
(`accent`, `warning`, `danger`, `neutral`, `inverse`). Never `kind`, and never
`win`: both are `sliding-puzzle` residue (ADR-0001).

_Avoid:_ kind, type, status, intent, severity.

## Variant

`Button` and `IconButton`'s colour-treatment property — `primary`, `secondary`,
`ghost`, `soft`, `danger`, `solid`, `outline`. Distinct from **tone**: variant
is treatment, tone is meaning.

_Avoid:_ style, appearance, look.

## State

A control's interaction state — `default`, `hover`, `pressed`, `focus`,
`invalid`, `disabled`. **Documentation-only as a Figma property**; in code the
browser and the DOM own it. Never accept it as a prop.

_Avoid:_ status, mode, phase.

## Glyph

One entry in `Icon`'s curated Lucide set. Named in Figma, keyed in
`ICON_GLYPHS` (ADR-0005).

_Avoid:_ symbol, pictogram, svg, icon (when you mean the glyph, not the
component).

## Consumer

An application that installs the package. Not a "user" — a user is a human
using that application.

_Avoid:_ client, host app, downstream.
