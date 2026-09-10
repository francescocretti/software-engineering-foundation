# ADR 0008: full-stack monorepo composes the stack profiles

- **Status:** accepted
- **Date:** 2026-09-10

## Context

`STRUCT-SHAPE-001` fixes the full-stack layout to `apps/client`,
`apps/server` and `packages/shared`. The stack templates were written as
standalone projects with their own ESLint composition, hooks and manifests.
The internal `fta-admin` monorepo shares code through TypeScript path aliases
to `shared/src`, which Vite and a bundler-style loader resolve but native Node
ESM and `tsc` emit do not.

## Decision

- Compose the existing stack templates instead of maintaining separate
  monorepo variants. Templates reference the shared configuration through the
  `{{CONFIG_ROOT}}` placeholder, which resolves to `./.config` standalone and
  `../../.config` inside a workspace.
- Keep tooling at the root only: one ESLint configuration for every workspace,
  hooks, commitlint, lint-staged, Yarn and Node pins. Workspace manifests drop
  root-only fields and scripts, and lint dependencies are hoisted to the root.
- Ship `packages/shared` as a built package with declarations and an
  `exports` map, consumed through `workspace:^`. Root scripts delegate
  topologically and `validate` builds before typechecking and testing.
- Verify both server variants by generating monorepos in the repository tests,
  linting from the root, typechecking and testing every workspace, building
  both applications and proving a server module consumes the shared schema.
  A separate installation with Yarn confirms the workspace manifests and the
  root scripts.

## Consequences

Stack templates evolve once and the monorepo inherits their changes. A clean
checkout must build the shared package before typechecking its consumers,
which `validate` and the topological scripts do automatically. Source-level
sharing without a build step is deliberately not supported, so the same
package works for Vite, native Node ESM and CommonJS Nest projects.
