# ADR-0008 — Releases publish through trusted publishing

**Status**: accepted

## Decision

Foundation publishes from GitHub Actions using **npm trusted publishing**
(OIDC). The workflow mints a short-lived, workflow-scoped credential at publish
time; there is no long-lived npm token stored anywhere.

Two consequences shape `release.yml`:

- **The npm CLI publishes, not pnpm.** `changeset publish` shells out to the
  repo's own package manager, and pnpm 11's OIDC support is broken
  ([pnpm/pnpm#11513](https://github.com/pnpm/pnpm/issues/11513),
  [pnpm/pnpm#9812](https://github.com/pnpm/pnpm/issues/9812)). Changesets is
  kept for the version PR; the publish step is a plain `npm publish`.
- **The first release is the exception.** npm cannot configure a trusted
  publisher for a package that does not exist yet
  ([npm/cli#8544](https://github.com/npm/cli/issues/8544)), so `0.1.0` goes out
  on a bootstrap token.

## Rationale

- A long-lived npm token is the single most valuable secret a package repo
  holds. Anyone who reads it can publish anything, to any version, forever —
  and it is exactly the credential that leaks through a compromised action, a
  log line, or a fork.
- OIDC replaces it with a credential that is minted per run, expires in
  minutes, and is bound to this repository and workflow. There is nothing to
  rotate and nothing worth stealing from the repo settings.
- It also sidesteps 2FA entirely. A token would need **Bypass 2FA** to publish
  unattended, which is precisely the property that makes a leaked one so
  dangerous. npm's own guidance is to prefer trusted publishing over
  bypass-2FA tokens.
- Provenance comes free: the npm CLI attests the commit and workflow that built
  the tarball, and consumers can verify it.

## Consequences

- **`id-token: write` in `release.yml` is load-bearing.** Removing it breaks
  publishing, and the failure reads as an auth error rather than a missing
  permission.
- **Never set `NODE_AUTH_TOKEN` in the publish step.** `actions/setup-node`
  writes `_authToken=$NODE_AUTH_TOKEN` into `.npmrc`, so an empty value leaves a
  blank token line — npm reads that as "auth is configured" and fails with
  `ENEEDAUTH` without ever attempting OIDC. An absent variable is not the same
  as an empty one, and the 0.1.1 release failed on exactly this.
- **Delete the `NPM_TOKEN` secret and the npm token itself** once the trusted
  publisher is configured. A bootstrap token left in place re-introduces exactly
  the risk this ADR removes.
- npm >= 11.5.1 and Node >= 22.14 are required; the workflow asserts the npm
  floor rather than trusting the runner image.
- There is no `release` script. Publishing is a CI action, and a local one
  would ship whatever happens to be in `dist/` at whatever version is checked
  out.
- Self-hosted runners are not supported by trusted publishing today.
