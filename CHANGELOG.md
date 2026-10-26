# Changelog

Notable changes to the foundation. Versions follow the rules in
[`docs/governance.md`](docs/governance.md#versioning); generated projects
record the applied version in `.engineering-foundation.yml`. The
[user manual](docs/manual.md) describes the current behavior.

Issue numbers in this file and in the commit messages up to 3.1.0 refer to
[`Lestat86/software-engineering-foundation`](https://github.com/Lestat86/software-engineering-foundation/issues).

## 3.1.0 — 2026-10-23

Fixes for the issues the pilot project opened. Minor: the new ESLint block is
opt-in for existing projects, and only the pilot uses the deploy axis.

### Added

- `process.env` is read only in the configuration module (#10).
- Plans accept a `superseded` status for plans never implemented (#11).
- `CLOUDRUN-PROXY-001`: trusted proxies on Cloud Run are a measured hop
  count (#7).
- `SERVERLESS-CONFIG-001`: each entry point validates and receives only its
  own configuration (#6).

### Changed

- `SERVERLESS-OUTBOX-001`: sent rows are retained for a recorded period and
  claimed with a lease, with no queue call inside a transaction (#8).
  Enumeration-sensitive endpoints stay timing-neutral (#9).

### Fixed

- `generated-clients-only-in-adapters` confines generated clients to
  adapters (#5).

## 3.0.0 — 2026-10-21

The foundation is now enforced after the bootstrap, not only at it: checks
run on every commit and before every pull request, existing projects receive
foundation updates, and existing codebases can adopt the foundation.

### Breaking

- Lint rejects `TODO`/`FIXME` without an issue reference, commented-out code,
  suppressions without a reason and functions above the complexity bounds
  ([ADR 0012](docs/adr/0012-code-health-rules.md)).
- Infrastructure sits behind ports the project owns
  ([ADR 0023](docs/adr/0023-infrastructure-ports.md), which describes the
  migration).

### Added

- Secret scanning of staged and committable files
  ([ADR 0013](docs/adr/0013-secret-scanning.md)).
- A checked project record with an expiring exception register
  ([ADR 0014](docs/adr/0014-checked-project-record.md)).
- Dependency classes and workspace boundaries
  ([ADR 0015](docs/adr/0015-dependency-rules.md)).
- Fastify refuses to register a route without its contract
  ([ADR 0016](docs/adr/0016-fastify-route-contracts.md)).
- Pull and merge request templates, and secret detection in CI.
- `premerge`: lint, typecheck, build, Knip and diff coverage of the changed
  lines ([ADR 0017](docs/adr/0017-premerge-diff-coverage.md),
  [ADR 0018](docs/adr/0018-unused-code-detection.md)).
- `sync-foundation` updates foundation-owned files of existing projects
  without overwriting local changes
  ([ADR 0019](docs/adr/0019-asset-synchronization.md)).
- Projects receive the requirements and a checked plan template
  ([ADR 0020](docs/adr/0020-project-knowledge.md)).
- The `sef` Claude Code plugin with a pre-PR reviewer
  ([ADR 0021](docs/adr/0021-claude-code-plugin.md)).
- The `retrofit-project` skill, a read-only inventory and baseline guards
  ([ADR 0022](docs/adr/0022-retrofit.md)).
- The `--deploy` axis with serverless and Cloud Run requirements
  ([ADR 0024](docs/adr/0024-deploy-axis.md)).
- The [user manual](docs/manual.md).

### Fixed

- `premerge` captures git output beyond 1 MB (#2), never passes on an empty
  or stale coverage report, and measures one-line functions.
- `sync-foundation` renders root template scripts and accepts a retrofitted
  root (#1).
- Retrofit runs `lint:deps` from the root and rejects a bare
  `--ignore-known`.

## 2.0.0 and earlier

See the history of
[`francescocretti/software-engineering-foundation`](https://github.com/francescocretti/software-engineering-foundation).
