# ADR-0007 — Tests query by accessible identity

**Status**: accepted

## Decision

Component specs query by **role, accessible name, and label** — the identity a
real user or assistive technology has. `getByTestId` is reserved for elements
with no accessible identity at all.

Testids stay **mandatory** on interactive and state-bearing elements. Every
component spec ends with `expectNoAxeViolations`.

Stack: **Vitest + Testing Library + `vitest-axe`**. Storybook carries
`@storybook/addon-a11y` and `storybook-addon-pseudo-states`.

## Rationale

- **WCAG 2.2 AA is a design constraint here, not a review step.** Foundation
  ships the accessibility contract its consumers inherit — if `Icon` gets
  `aria-hidden` wrong, it is wrong in every product downstream.
- A test that queries by role and name **fails when the accessible identity
  breaks**. A test that queries by testid passes through the regression. For a
  design system that is the whole point of testing.
- An axe assertion per spec is cheap and catches the class of defect that is
  invisible in a snapshot: contrast, missing names, bad ARIA relationships.
- Testids remain mandatory anyway, because consumers write their own end-to-end
  tests against Foundation's markup and need stable hooks.

## Consequences

- Prefer `getByRole('button', { name: 'Add item' })` over
  `getByTestId('button')`.
- A component whose behaviour cannot be asserted through its accessible identity
  is a **design smell** — fix the component, not the test.
- `expectNoAxeViolations` at the end of every component spec, without exception.
- Interactive states that CSS owns (`hover`, `pressed`, `focus`) are documented
  in Storybook via pseudo-states, mirroring the Figma grids, rather than
  asserted in unit tests.
