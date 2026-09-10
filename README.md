# Software Engineering Foundation

Shared, model-agnostic foundations for starting and maintaining TypeScript web
projects across Mezzo Forte and BlackBytes.

This repository combines:

- normative engineering standards;
- stack-specific guidance;
- reusable project assets;
- the `bootstrap-web-project` Agent Skill.

The repository is the source of truth. The skill is the primary executable
entrypoint for agents, while every document remains usable by humans and agents
without native Agent Skills support.

## Status

The repository structure, shared standards, mandatory accessibility standard,
risk-based security standard, shared tooling assets and the React with Vite,
Fastify, Nest and Supabase profiles are established. Every template is verified
on each test run by generating a project and running its lint, typecheck,
tests and build. The full-stack monorepo profile and optional GitLab CI are
introduced in separate, reviewable stages before the first stable release.

## Supported scope

- TypeScript
- React single-page applications built with Vite
- Fastify backends
- Nest backends
- Supabase and PostgreSQL
- Single-package repositories and full-stack monorepos
- Optional basic GitLab CI

Next.js is intentionally outside the initial scope.

## Fixed decisions

- Yarn is the only package manager.
- New projects use a pinned Yarn Modern release through Corepack and the
  `node-modules` linker.
- ESLint is the only JavaScript and TypeScript linting and formatting engine.
- Prettier is not used.
- WCAG 2.2 AA is mandatory for every frontend.
- Security controls are graduated through the R1, R2 and R3 risk levels.
- R2 is the default for authenticated applications.
- CI templates are optional.
- Secrets, credentials and authentication keys must never be printed.

## Entry points

- Agents bootstrapping a project start at
  [`skills/bootstrap-web-project/SKILL.md`](skills/bootstrap-web-project/SKILL.md).
- Contributors changing a standard start at
  [`docs/governance.md`](docs/governance.md).
- Provenance and research sources are recorded in
  [`docs/source-register.md`](docs/source-register.md).

## Repository layout

```text
docs/                         Governance, provenance and decisions
skills/bootstrap-web-project Agent workflow, references and generated assets
tests/                        Structural and behavioral validation
```

The skill uses progressive disclosure: it reads the shared foundation first,
then only the risk and stack references relevant to the selected project.
