# React with Vite profile

Use this profile for React single-page applications built with Vite. Next.js
is not covered. Apply it after the [shared foundation](../foundation.md), the
[shared tooling](../tooling.md) and the [accessibility standard](../accessibility.md).
The toolchain decisions are recorded in ADR 0005 of the foundation repository.

## Profile asset

The production template lives in `assets/stacks/react-vite/`:

| File | Purpose |
| --- | --- |
| `package.json` | Script contract, exact runtime pin and empty dependency blocks filled from `versions.json` |
| `index.html` | Accessible document shell: `lang`, viewport, `color-scheme`, title, `noscript` |
| `vite.config.ts` | Vite 8 with `@vitejs/plugin-react` and the Vitest `test` block (jsdom, setup file, no globals) |
| `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json` | Solution-style TypeScript split between browser code and Node-run configuration |
| `eslint.config.mjs` | Root composition of the copied `.config/eslint/` modules with strict JSX accessibility and Vite refresh rules |
| `playwright.config.ts`, `e2e/home.spec.ts` | Browser-level critical-flow test with keyboard operation and an axe-core scan |
| `src/main.tsx`, `src/app/App.tsx`, `src/app/App.test.tsx` | Minimal accessible application and its component tests |
| `src/styles/global.css` | Visible focus, skip link, target size and reduced-motion defaults |
| `test/setup.ts`, `test/accessibility.ts` | Testing Library matchers, cleanup and the axe-core component scan helper |
| `.gitignore` | Ignores build output, test artifacts and every `.env` file except `.env.example` |

## Files to apply

1. Complete the [shared tooling steps](../tooling.md). Copy the
   ESLint modules into `.config/eslint/` and the TypeScript presets into
   `.config/typescript/`; the template's `eslint.config.mjs` and tsconfig files
   import them from those paths.
2. Copy every file of `assets/stacks/react-vite/` to the project root and
   replace the placeholders:

   | Placeholder | Value |
   | --- | --- |
   | `{{PROJECT_NAME}}` | Package name, also used as the initial document title |
   | `{{HTML_LANG}}` | Primary content language as a BCP 47 tag, agreed with the user |
   | `{{YARN_VERSION}}` | `runtime.yarn` from `versions.json` |
   | `{{NODE_ENGINES}}` | `>=<nodeMajor>.0.0 <<nodeMajor + 1>` from `versions.json` |

3. Fill `dependencies` from the `reactDependencies` group and `devDependencies`
   from `commonDevDependencies`, `nodeDevDependencies`, `reactDevDependencies`
   and `reactViteDevDependencies`. Keep every version exact.
4. Register design-system wrappers in `createReactConfig({ components,
   attributes })` as soon as they exist, so `jsx-a11y` lints abstractions.
5. Install with Corepack, then run `corepack yarn validate`. Run
   `corepack yarn playwright install chromium` followed by
   `corepack yarn test:e2e` wherever a browser can be installed, and report it
   as a documented follow-up otherwise.

In a full-stack monorepo the template is applied inside `apps/client` and the
root composition passes that directory's `tsconfigRootDir`; the monorepo profile
defines the workspace wiring.

## Toolchain notes

- Vite 8 bundles with Rolldown and transforms with Oxc; `@vitejs/plugin-react`
  6 no longer ships Babel. TypeScript is type-stripped, so the application
  tsconfig enables `erasableSyntaxOnly` and forbids enums, namespaces and
  parameter properties.
- Vitest reads the `test` block from `vite.config.ts`. `globals` stays off, so
  tests import from `vitest` and `test/setup.ts` performs Testing Library
  cleanup explicitly.
- `test/accessibility.ts` disables only `color-contrast` and `region` for
  component fragments; both run in the browser-level Playwright scan.
- Playwright starts the production preview through its `webServer` option, so
  `test:e2e` exercises the built application rather than the dev server.

## `REACT-BUILD-001` — Vite owns the browser build and dev server

- **Level:** MUST
- **Applies to:** React with Vite projects
- **Risk levels:** R1, R2, R3
- **Requirement:** Expose `dev`, `build` and `preview` through Vite and keep the
  shared `lint`, `lint:fix`, `typecheck`, `test`, `build` and `validate`
  contract. `typecheck` covers both the browser project and the Node-run
  configuration project. Do not add a second bundler or transpiler for the same
  source.
- **Rationale:** One build tool keeps development, test and production
  transforms aligned and makes the quality gate reproducible.
- **Verification:** Run `corepack yarn validate` and `corepack yarn preview`
  from a clean install; confirm `dist/index.html` retains the document shell.
- **Sources:** [Vite guide](https://vite.dev/guide/), [Vite 8 migration](https://vite.dev/guide/migration).
- **Exceptions:** A documented deployment target may add a post-build step, but
  it must consume the Vite output rather than replace it.

## `REACT-ENV-001` — client configuration is public by definition

- **Level:** MUST
- **Applies to:** React with Vite projects
- **Risk levels:** R1, R2, R3
- **Requirement:** Read runtime configuration only through `import.meta.env`
  variables prefixed with `VITE_`. Treat every such value as public: never place
  secrets, service-role keys or privileged tokens in client configuration, and
  commit only `.env.example` with placeholder values.
- **Rationale:** Vite inlines exposed variables into the shipped bundle; a
  secret in the client is disclosed to every user.
- **Verification:** Review `.env.example` and the `VITE_` usages; confirm the
  `.gitignore` excludes real `.env` files and the built bundle contains no
  credentials.
- **Sources:** [Vite env variables and modes](https://vite.dev/guide/env-and-mode), [OWASP ASVS 5.0.0 — Configuration](https://github.com/OWASP/ASVS/tree/v5.0.0/5.0).
- **Exceptions:** None. Public identifiers such as an anonymous API key are
  allowed only when the backend enforces authorization independently.

## `REACT-STRUCTURE-001` — capability-oriented application code

- **Level:** SHOULD
- **Applies to:** React with Vite projects
- **Risk levels:** R1, R2, R3
- **Requirement:** Organize product code by feature or domain boundary under
  `src/`, keep reusable design-system primitives separate from feature
  components and keep route composition distinct from data access. Store only
  essential state, derive values during render and use effects only to
  synchronize with external systems.
- **Rationale:** Capability-oriented modules and minimal state make change
  impact and rendering behavior predictable.
- **Verification:** Follow a representative feature change and review effects
  and duplicated state during code review.
- **Sources:** [React — Thinking in React](https://react.dev/learn/thinking-in-react), [React — You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect), `bailu-admin`, `fta-admin`.
- **Exceptions:** Cross-cutting infrastructure may be grouped by technical
  responsibility as allowed by `STRUCT-FEATURE-001`.

## `REACT-TEST-001` — layered component and browser testing

- **Level:** MUST
- **Applies to:** React with Vite projects
- **Risk levels:** R1, R2, R3
- **Requirement:** Test components with Vitest, jsdom and Testing Library using
  semantic queries and user-event interactions, and scan representative
  rendered states with `expectNoAccessibilityViolations`. Cover critical user
  journeys with Playwright against the built application, including an axe-core
  page scan. Keep `test` free of browser prerequisites and expose the browser
  suite separately as `test:e2e`.
- **Rationale:** Component tests give fast feedback on behavior and semantics,
  while browser tests verify focus, navigation and page-level accessibility that
  jsdom cannot represent.
- **Verification:** Run `corepack yarn test` in a clean checkout and
  `corepack yarn test:e2e` after installing a Playwright browser; review that
  new interaction states are scanned.
- **Sources:** [Vitest guide](https://vitest.dev/guide/), [Testing Library query priority](https://testing-library.com/docs/queries/about/), [axe-core](https://github.com/dequelabs/axe-core), [Playwright accessibility testing](https://playwright.dev/docs/accessibility-testing).
- **Exceptions:** A project without a runnable browser environment records the
  missing `test:e2e` run as a blocker in its report; it does not remove the
  suite.

## `REACT-SHELL-001` — preserve the accessible application shell

- **Level:** MUST
- **Applies to:** React with Vite projects
- **Risk levels:** R1, R2, R3
- **Requirement:** Keep the document `lang`, a descriptive `<title>`, the
  viewport meta, a skip link to a focusable `main` landmark, visible focus
  styles and the reduced-motion rule from the template. When adding client-side
  routing, update the document title and manage focus for each navigation as
  required by `A11Y-SPA-001`.
- **Rationale:** The shell provides orientation and bypass mechanisms that every
  later feature inherits; removing them silently regresses WCAG 2.2 AA.
- **Verification:** The component and browser tests exercise the skip link and
  `main` focus; review `index.html` and `global.css` changes against this list.
- **Sources:** [WCAG 2.2 — 2.4.1, 2.4.2, 2.4.7, 3.1.1](https://www.w3.org/TR/WCAG22/), [WCAG technique C39](https://www.w3.org/WAI/WCAG22/Techniques/css/C39.html).
- **Exceptions:** Visual styling may change freely as long as focus visibility,
  contrast and target size remain compliant.
