# Shared tooling implementation

This reference turns the normative foundation into files that can be copied to
a generated project. Read it for every profile.

## Compatibility snapshot

The exact versions live in
[`assets/tooling/versions.json`](../assets/tooling/versions.json). They were
verified against the npm registry on 2026-09-10.

- ESLint remains on major 9 because the selected React, accessibility and
  import plugins do not yet share support for ESLint 10.
- TypeScript remains on 5.9 because `typescript-eslint` 8 supports TypeScript
  versions below 6.1, while TypeScript 7 is already published.
- Vite stays on 8.2.2 and React on 19.2.8 because the newer releases were
  published less than 24 hours before verification and are held by the Yarn
  package-age gate; `@vitejs/plugin-react` 6 requires Vite 8 and Vitest 5
  supports it.
- jsdom stays on 29 because jsdom 30 requires Node 24.15 while the foundation
  pins only the Node major. Raise both together.
- Nest stays on 11 because Nest 12 schematics require TypeScript 6 and
  `@nestjs/throttler` targets Nest 11; zod stays on 4.5 because 4.6 was held
  by the package-age gate at verification.
- Upgrade the matrix as a focused dependency change. Verify peer ranges, run
  the representative config tests and run `yarn validate`; do not advance one
  major in isolation.

Exact manifest versions and a committed Yarn lockfile make a generated project
reproducible. They do not replace periodic dependency and vulnerability review.
Keep Yarn's package-age gate enabled; if a selected version is quarantined,
prefer the newest compatible version old enough to pass rather than bypassing
the gate.

The shared `.yarnrc.yml` contains a documented `packageExtensions` workaround
for peers omitted by `@commitlint/load`. Re-check and remove the workaround when
upgrading commitlint; do not accumulate unexplained package extensions.

## Files to apply

For every JavaScript or TypeScript project:

1. Copy `.node-version` and `.yarnrc.yml` from `assets/common/` to preserve the
   runtime major, `node-modules` linker and 24-hour package-age gate.
2. Copy the modules under `assets/tooling/eslint/` that match the profile into
   `.config/eslint/`.
3. Compose them from a root `eslint.config.mjs`. Always include `base.mjs` and
   `stylistic.mjs`; TypeScript projects also include `typescript.mjs`.
4. Copy the applicable files from `assets/tooling/typescript/`.
5. Copy `assets/tooling/git/commitlint.config.mjs` and
   `assets/tooling/git/lint-staged.config.mjs` when Conventional Commits is
   selected, then copy both hooks. If the documented exception to
   `GIT-MESSAGE-001` is used, omit commitlint and the `commit-msg` hook only.
6. Merge the dependency groups listed for the selected profiles under
   `profiles` in `assets/tooling/versions.json`: each profile names its
   `template` directory, its runtime `dependencies` groups and its
   `devDependencies` groups. Overlay profiles such as `supabase` are applied
   after a base profile. Then create the scripts below.
7. Add `"prepare": "husky"`, install once and ensure Git records the hook files
   as executable.

React profiles include `react.mjs` and the Vite refresh configuration; Node
backends and Node-run configuration or test files include `node.mjs` with
deliberately scoped file globs. Each stack reference describes its template and
composition: [React](stacks/react.md), [Fastify](stacks/fastify.md),
[Nest](stacks/nest.md) and [Supabase](stacks/supabase.md); the
[monorepo reference](monorepo.md) composes them under one root.

## Script contract

Use these root scripts, adjusting workspace delegation without changing their
public names:

```json
{
  "lint": "eslint . --max-warnings=0",
  "lint:fix": "eslint . --fix --max-warnings=0",
  "typecheck": "tsc --noEmit",
  "validate": "yarn lint && yarn typecheck && yarn test && yarn build",
  "prepare": "husky"
}
```

`lint-staged` runs `eslint --fix --max-warnings=0` only for staged JavaScript
and TypeScript files. The pre-commit hook does not run repository-wide
typechecking or tests. The complete gate runs explicitly before merge and in CI
when CI is enabled.

## Style baseline

The preset uses two-space indentation, single quotes, no semicolons, trailing
commas where valid in multiline syntax and a 100-column code limit with
pragmatic exceptions for URLs and unbreakable literals. It avoids visual
alignment rules that cause unrelated diff churn.

Formatting rules apply only to JavaScript, TypeScript and JSX/TSX. Do not add
Prettier for JSON, Markdown or YAML; preserve those formats deliberately or add
a format-specific non-overlapping validator through a documented exception.

## Deliberate boundaries

The preset enforces typed linting, promise safety, documented TypeScript
suppressions, import validity, React Hooks and strict JSX accessibility. It does
not prescribe domain naming prefixes, file-per-type organization, universal
named exports, class bans, inline-handler bans or coverage percentages.

Pass design-system component and attribute mappings to `createReactConfig` so
the accessibility plugin understands wrappers around native controls. Static
linting supplements but never replaces the accessibility testing requirements.
