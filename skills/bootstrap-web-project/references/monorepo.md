# Full-stack monorepo profile

Use this profile when one repository contains a React client and a Fastify or
Nest server. It composes the stack profiles into the layout required by
`STRUCT-SHAPE-001`: `apps/client`, `apps/server` and `packages/shared`. The
decisions are recorded in ADR 0008 of the foundation repository.

## Profile assets

| Asset | Purpose |
| --- | --- |
| `assets/stacks/monorepo/package.json` | Root manifest with Yarn workspaces and the delegating script contract |
| `assets/stacks/monorepo/eslint.config.mjs` | One root ESLint composition covering every workspace |
| `assets/stacks/monorepo/.gitignore` | Root ignore list for build output, test artifacts and `.env` files |
| `assets/stacks/shared/` | The `packages/shared` package: portable zod schemas and types built to `dist/` |

## Files to apply

`generate-project.mjs --profile monorepo --client <profile> --server <profile>`
performs steps 1 to 3; overlays are added as further `--profile` options.

1. Apply the common assets, `.config/`, Git hooks and the `monorepo` template
   at the repository root. The root receives `commonDevDependencies`,
   `nodeDevDependencies` and `reactDevDependencies`, so lint tooling exists
   once.
2. Apply the client profile into `apps/client`, the server profile into
   `apps/server` and the `shared` profile into `packages/shared`. In each
   workspace set `{{CONFIG_ROOT}}` to `../../.config`, name the package
   `@<project>/<workspace>`, remove `packageManager`, `engines` and the
   `lint`, `lint:fix`, `validate` and `postinstall` scripts, delete the workspace
   `eslint.config.mjs`, and add `"@<project>/shared": "workspace:^"` to both
   applications. Workspace `devDependencies` omit the groups already present
   at the root.
3. Apply overlays such as Supabase at the root.
4. Install with Corepack and run `corepack yarn validate`; it builds the shared
   package before typechecking and testing the consumers.

## `MONO-SCRIPTS-001` — the root owns the quality gate

- **Level:** MUST
- **Applies to:** full-stack monorepos
- **Risk levels:** R1, R2, R3
- **Requirement:** Keep `lint`, `lint:fix`, `typecheck`, `test`, `build` and
  `validate` at the root. `lint` runs the single root ESLint configuration;
  `build`, `typecheck` and `test` delegate topologically to workspaces with
  `yarn workspaces foreach -At --exclude <root>`; `validate` builds before
  typechecking and testing so consumers see the shared package output.
- **Rationale:** One entrypoint keeps hooks, CI and agents framework-agnostic
  and guarantees the shared package is compiled before it is consumed.
- **Verification:** Run `corepack yarn validate` in a clean checkout; the
  generated-project test lints, typechecks, tests and builds every workspace.
- **Sources:** [Yarn workspaces](https://yarnpkg.com/features/workspaces), [`yarn workspaces foreach`](https://yarnpkg.com/cli/workspaces/foreach), `GIT-HOOK-001`.
- **Exceptions:** A workspace may add local scripts for its own development
  loop; it does not redefine the root contract.

## `MONO-SHARED-001` — a built, portable shared package

- **Level:** MUST
- **Applies to:** full-stack monorepos
- **Risk levels:** R1, R2, R3
- **Requirement:** `packages/shared` contains only portable schemas, types and
  pure functions, has no runtime-specific dependencies and is published to
  consumers through its built `dist/` with declarations via `exports`.
  Applications depend on it with the `workspace:^` protocol and never import
  its `src/` files directly.
- **Rationale:** A built package with a stable export surface works identically
  in Vite, native Node ESM and CommonJS Nest projects and enforces
  `STRUCT-BOUNDARY-001`.
- **Verification:** The generated-project test compiles the shared package and
  proves a server module consumes its schema after build; review new shared
  dependencies for runtime coupling.
- **Sources:** [Node.js package entry points](https://nodejs.org/api/packages.html#package-entry-points), `STRUCT-SHARED-001`, `STRUCT-BOUNDARY-001`, practitioner experience with TypeScript monorepos.
- **Exceptions:** A second shared package is justified only by a distinct
  consumer set or responsibility, recorded per `STRUCT-SHARED-001`.

## `MONO-CONFIG-001` — configuration lives once at the root

- **Level:** MUST
- **Applies to:** full-stack monorepos
- **Risk levels:** R1, R2, R3
- **Requirement:** Keep `.config/`, `.yarnrc.yml`, `.node-version`, Git hooks,
  `commitlint` and `lint-staged` configuration, `AGENTS.md` and
  `.engineering-foundation.yml` only at the root. Workspaces extend
  `../../.config/typescript/*` and declare no package manager, engine or
  hook configuration of their own. Environment files stay per application.
- **Rationale:** Duplicated tooling configuration drifts silently and makes
  the workspaces disagree about the same rules.
- **Verification:** The generated-project test asserts the absence of workspace
  ESLint configurations, hooks and root-only manifest fields.
- **Sources:** [ESLint configuration files](https://eslint.org/docs/latest/use/configure/configuration-files), `DEP-YARN-001`, `DEP-RUNTIME-001`.
- **Exceptions:** None.
