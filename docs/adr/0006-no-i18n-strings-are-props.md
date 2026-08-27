# ADR-0006 — No i18n: every string is a prop

**Status**: accepted

## Decision

Foundation contains **no localization layer and no user-facing copy**. It does
not depend on `react-intl`, on any i18n library, or on a translation facade.
Every string a consumer can read is passed in as a prop.

Components that need an accessible name for a control they own — `Dialog`'s
close button, `Select`'s chevron — take that name as a **required prop**. They
never default it to an English literal.

## Rationale

- A design system that ships copy ships an opinion about language. Foundation's
  consumers own their own vocabulary and their own translation pipeline.
- Bundling an i18n runtime would force every consumer onto it, or force a peer
  dependency onto consumers who do not localize at all.
- This inverts `react-ts-template`'s ADR-0004, which routes all localization
  through an `@i18n` facade. That is correct **for an app**. The rule does not
  survive the move to a library, and the inversion is deliberate.
- In `sliding-puzzle`, exactly one component reached for `@i18n`: `Dialog`, for
  its close button's label. That is the whole coupling, and it becomes a
  required prop here.

## Consequences

- **Never import `react-intl` or any i18n package** in this repo — not in
  components, not in stories, not in tests.
- A missing accessible name is a **type error**, not a silent English fallback.
  Required beats defaulted: an untranslated default ships to production looking
  like it works.
- Stories and tests pass literal English strings. That is fixture data, not
  product copy.
- Consumers localize at the call site, with whatever they already use.
