# ADR 0005: React + Vite profile toolchain

- **Status:** accepted
- **Date:** 2026-09-10

## Context

The first stack profile must produce a React single-page application that
passes the shared quality gate and the mandatory accessibility verification
layers without depending on this repository at runtime. Internal repositories
use Vite with Vitest, jsdom and Testing Library, but none of them integrates
axe-core or browser-level accessibility checks, and they rely on Babel-based
React transforms that Vite 8 no longer needs.

At the decision date, Vite 8 (Rolldown and Oxc) is the supported major for
`@vitejs/plugin-react` 6, Vitest 5 supports Vite 8, and the Yarn 24-hour
package-age gate excludes React 19.3.0 and Vite 8.3.0, both published within
the preceding day. jsdom 30 requires Node 24.15 while the foundation pins Node
major 24 without a minor floor.

## Decision

- Build with Vite 8 and `@vitejs/plugin-react` 6, without Babel. Enable
  `erasableSyntaxOnly` so TypeScript is limited to syntax that type-stripping
  transforms can erase.
- Test components with Vitest 5, jsdom 29, Testing Library, `jest-dom` and
  `user-event`, with `globals` disabled and explicit cleanup.
- Run axe-core inside component tests through a shared helper that fails on
  violations and returns `incomplete` results for manual resolution. Disable
  only `color-contrast` and `region` at component level.
- Verify critical flows with Playwright against the built preview and scan
  each page with `@axe-core/playwright`. Keep `test:e2e` separate from `test`.
- Pin React 19.2.8 and Vite 8.2.2 as the newest versions that pass the
  package-age gate; keep jsdom 29.1.1 until the Node floor rises to 24.15.
- Prescribe no router, state manager or CSS framework in the template. The
  reference states the accessibility obligations that apply when they are added.
- Verify the template through a generated project in the repository tests:
  lint, typecheck, component tests, production build and a negative
  accessibility lint case run on every `corepack yarn test`.

## Consequences

Generated projects start with a working accessibility test loop at static,
component and browser level. The foundation repository installs the complete
React toolchain to exercise the template, so dependency updates are verified
against a real build. Browser tests need a Playwright browser, which is
installed explicitly rather than assumed; the repository test suite does not
run them. Upgrading jsdom, React or Vite is a reviewed change to
`versions.json` that reruns the generated-project tests.
