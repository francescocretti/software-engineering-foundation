# ADR 0006: Fastify and Nest backend profiles

- **Status:** accepted
- **Date:** 2026-09-10

## Context

The backend profiles must start from the same quality gate as the React
profile, share one validation language with the frontend where possible and
satisfy the shared security baseline without framework-specific boilerplate
that nobody reviews. Internal repositories use Fastify with hand-written zod
parsing and Nest 11 with class-validator, Jest and Prettier.

At the decision date, Nest 12 has just shipped as ESM: its schematics require
TypeScript 6, `@nestjs/throttler` still targets Nest 11, and the foundation
pins TypeScript 5.9. Node 24 runs TypeScript directly through type stripping,
which removes the need for a development loader in plain Node services.

## Decision

- Fastify 5 with `fastify-type-provider-zod` and zod 4: route schemas are the
  validation and serialization contract, request objects are strict, and the
  same zod schemas can be shared with a React client through a workspace
  package. The runtime is native ESM with `.ts` extension imports, Node type
  stripping in development and `tsc` with rewritten extensions for `dist/`.
- Nest 11 on Express with `class-validator` as the official DTO mechanism, a
  global `ValidationPipe` with allowlisting, zod for environment validation
  and `unplugin-swc` so Vitest emits decorator metadata. Nest projects stay
  CommonJS until the ecosystem aligns with Nest 12 and TypeScript 6.
- Both profiles ship the same protective defaults from validated
  configuration: Helmet, a CORS origin allowlist, rate limiting, body limits,
  fail-fast configuration that names variables but never values, and one
  error contract `{ error: { code, message, issues? } }`.
- Both profiles are verified by generated projects in the repository tests:
  lint, typecheck, behavioral tests for validation, limits and the error
  contract, a production build and a boot check against the built output.

## Consequences

Teams get the same script contract, error shape and configuration discipline
on either framework. Fastify projects have no bundler or loader beyond `tsc`;
Nest projects depend on the Nest CLI and SWC, as the framework does. Upgrading
Nest to 12 is an explicit change that revisits TypeScript, the throttler and
the module format together. The repository installs both toolchains to keep
the templates executable.
