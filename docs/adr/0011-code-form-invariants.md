# ADR 0011: named constants and arrow functions are enforced invariants

- **Status:** accepted
- **Date:** 2026-09-21

## Context

Two code-form decisions were being made per file, by each contributor and each
agent, with no criterion recorded anywhere.

Numeric literals were written inline across the templates: port bounds and body
limits in configuration schemas, HTTP status codes in route definitions and in
the error contract, a name length repeated in the request schema of two stacks
and in the shared package. The same value appeared in several places with no
link between them, so a change had to find every occurrence by search.

Function definitions mixed `function` declarations and arrow functions with no
rule. The shared ESLint modules, the generator script, the tests and every
stack template each chose differently, sometimes within one file.

Both are the kind of decision that is cheap to fix once and expensive to
relitigate on every review. `CORE-CLARITY-001` asks for intention-revealing
code but is a SHOULD with no observable check, so neither decision was
verifiable.

## Decision

- Add `CORE-CONSTANT-001`: a numeric literal with domain, protocol or
  operational meaning is an `UPPER_SNAKE_CASE` export of a
  `<feature>.constants.ts` module colocated with its feature. `-1`, `0`, `1`
  and array indices stay inline.
- Add `CORE-ARROW-001`: functions are arrow functions bound to a `const`;
  `function` is reserved for generators, for code that needs its own `this`,
  `arguments` or `new.target`, and for required hoisting.
- Enforce both in the shared ESLint modules rather than by review alone:
  `no-magic-numbers` with its typed counterpart and
  `@typescript-eslint/naming-convention` for the first, `func-style`,
  `prefer-arrow-callback` and a `no-restricted-syntax` selector for the second.
- Exempt tests and tool configuration from literal checking only. An assertion
  and a configuration entry declare their value at its single site, so naming
  it adds indirection without adding a single source of truth. The arrow
  requirement has no such exemption.
- Apply both to the repository's own scripts, tests and templates, so the
  foundation is verified by the same gate it ships.

## Consequences

Both requirements are checked by the lint gate that every generated project and
this repository already run, so they fail on the first violation rather than at
review. The generated projects gained five constants modules, and the Fastify
response maps now use computed keys; the end-to-end generation tests confirm
lint, typecheck, tests and build still pass on every profile.

`no-restricted-syntax` is an array rule, so a project that adds its own entry
replaces the shared selector. `base.mjs` exports `arrowFunctionRules` and
`defaultLiteralExemptFiles` so a project extends the shared configuration
instead of silently dropping it.

This is a breaking change for projects generated on 1.x: code that passed the
previous gate fails the new one. The foundation moves to 2.0.0. To migrate, run
`corepack yarn lint`, convert the reported declarations to arrow functions and
move the reported literals into a colocated constants module; no runtime
behavior changes.
