# Foundation

An accessible React design system. Tokens generated from Figma, components built
to WCAG 2.2 AA, published as ESM so consumers ship only what they import.

> **Status: skeleton.** Docs and decisions only — no components yet. See
> [docs/plan.md](docs/plan.md).

## Install

```bash
pnpm add @laurensbooij/foundation-ds
```

React 19 or newer is a peer dependency.

## Use

Import the tokens once, in your entry file. Every component's styles depend on
them.

```js
import '@laurensbooij/foundation-ds/tokens.css'
import '@laurensbooij/foundation-ds/fonts.css' // optional — see Fonts
```

Then import components normally:

```tsx
import { Button, TextInput } from '@laurensbooij/foundation-ds'

export const SignupForm = () => (
  <form>
    <TextInput label="Email" hint="We only use this to sign you in." />
    <Button iconStart="plus">Create account</Button>
  </form>
)
```

## Components

|          |              |           |          |
| -------- | ------------ | --------- | -------- |
| `Badge`  | `Button`     | `Card`    | `Dialog` |
| `Icon`   | `IconButton` | `Modal`   | `Select` |
| `Switch` | `TextInput`  | `Tooltip` |          |

## Tree shaking

Each component ships its own stylesheet, and `package.json` declares
`"sideEffects": ["**/*.css"]`. A bundler that resolves ESM drops the JS **and
the CSS** of every component you do not import.

That needs a bundler which follows CSS imports from `node_modules` — Vite,
webpack with `css-loader`, and Next.js all do. For environments that do not
(plain Node, Vitest or Jest without a CSS transform, a single `<link>` tag),
import the bundled sheet instead:

```js
import '@laurensbooij/foundation-ds/styles.css'
```

See [ADR-0002](docs/adr/0002-published-as-esm-with-per-component-css.md).

## Fonts

Foundation is drawn in **Outfit**, **Public Sans** and **IBM Plex Mono**, shipped
self-hosted as woff2. `fonts.css` is opt-in.

Bringing your own typefaces means skipping it and overriding three variables:

```css
:root {
  --family-display: 'Your Display', sans-serif;
  --family-ui: 'Your UI', sans-serif;
  --family-numeric: 'Your Mono', monospace;
}
```

`tokens.css` **names** the families; `fonts.css` **loads** them. Skipping
`fonts.css` costs you zero font bytes. See
[ADR-0004](docs/adr/0004-fonts-are-self-contained-and-opt-in.md).

## Accessibility

WCAG 2.2 AA is a design constraint, not a review step — this package ships the
accessibility contract its consumers inherit.

- Accessible names are **required props**, never defaulted to English. Foundation
  ships no copy ([ADR-0006](docs/adr/0006-no-i18n-strings-are-props.md)).
- `Icon` is decorative by default and only becomes meaningful with a `label`.
- Every control is keyboard-operable, with a focus ring that reads on any
  surface.
- Every component spec ends with an axe assertion
  ([ADR-0007](docs/adr/0007-tests-query-by-accessible-identity.md)).

## Contributing

Figma is the contract. A component ships only once Figma draws it as a component
set, and its variant properties are its props
([ADR-0001](docs/adr/0001-figma-is-the-contract-for-the-public-api.md)).

Design values come from `tokens/figma/*.json` via `pnpm tokens` — never edit
`src/styles/tokens.css` by hand
([ADR-0003](docs/adr/0003-tokens-ship-in-the-package.md)).

## License

MIT
