# ADR 0004: shared tooling is copied, modular and compatibility-pinned

- **Status:** accepted
- **Date:** 2026-09-10

## Context

Generated projects need strict defaults without depending on this private
repository at runtime. Internal repositories provide useful ESLint and Git-hook
patterns, but also contain conventions that are too project-specific and hooks
that perform more work than the shared standard permits.

The latest package major is not always a compatible choice. At the decision
date, TypeScript 7 is published while `typescript-eslint` supports TypeScript
below 6.1. The React, accessibility and import plugins share ESLint 9 as their
supported major.

## Decision

- Copy versioned tooling assets into each generated repository. Generated
  projects do not import configuration from this repository or a private npm
  package.
- Compose ESLint Flat Config from small JavaScript, TypeScript, Node, React and
  stylistic modules. A profile selects only the modules it needs.
- Use ESLint 9.39.5 and TypeScript 5.9.3 until the complete plugin matrix is
  verified against later majors.
- Use ESLint plus `@stylistic` as the sole formatter for JavaScript and
  TypeScript. Do not install Prettier.
- Apply `eslint-plugin-jsx-a11y` strict rules to every React profile.
- Run only lint-staged from `pre-commit`. Run commitlint from `commit-msg` when
  the default Conventional Commits policy is selected. Invoke both through
  Yarn/Corepack and never through `npx`.
- Keep exact source versions in `assets/tooling/versions.json`; the lockfile
  remains the resolved dependency record in generated projects.

## Consequences

Projects own their copied configuration and can work without access to the
foundation repository. Updating the foundation does not silently change an
existing project, so upgrades are explicit reviewed changes. The repository
must test that its production presets compose and continue to expose the
intended strict rules.

The shared preset intentionally does not copy internal naming prefixes,
separate `*.types` files, universal default-export bans, inline-handler bans or
alignment-heavy formatting rules. A project may add a documented convention
when its domain justifies it.
