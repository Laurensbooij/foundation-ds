# Changesets

Every user-facing change needs one. Run `pnpm changeset`, pick the bump, and
describe the change as a consumer would read it in the changelog.

Releases are automated: merging to `main` opens a release PR, and merging that
publishes to npm with provenance.
