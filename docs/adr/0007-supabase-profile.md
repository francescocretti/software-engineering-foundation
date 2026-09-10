# ADR 0007: Supabase profile as a database overlay

- **Status:** accepted
- **Date:** 2026-09-10
- **Amended:** 2026-09-10

## Context

Supabase exposes PostgreSQL directly to clients, so authorization lives in the
database. Existing production applications show mature migrations and RLS
policies, and
mix legacy `anon` and `service_role` terminology with the current publishable
and secret keys. The Supabase CLI and live database tests require a container
runtime and add material installation and CI cost. That conflicts with the
foundation's primary purpose: bootstrapping small, high-quality projects
quickly without imposing infrastructure they may not use.

## Decision

- Model Supabase as an overlay applied after a Fastify, Nest or React profile
  or on a monorepo root. It contributes the runtime client, key names and a
  reference migration; it does not add application code or local
  infrastructure tooling.
- Require, for every exposed table, RLS plus revoked default grants plus
  explicit grants plus policies written with `(select auth.uid())`. Functions
  default to invoker rights with an empty `search_path`.
- Verify the overlay statically on every foundation test run, rejecting
  migrations that create tables without that structure.
- Do not install the Supabase CLI, add `db:*` scripts, require Docker, or ship
  local-stack configuration, seed data or pgTAP suites in the baseline.
  Projects may adopt database tooling and live authorization tests separately
  when their delivery model and risk justify the operational cost.
- Use publishable and secret key terminology in generated files and map legacy
  names only where tools still require them.

## Consequences

Generated projects start with a structurally hardened authorization model
without inheriting a container runtime or a database toolchain. The baseline
does not prove policy behavior against a live database; projects that need that
assurance add an isolated provider-specific workflow deliberately. Database
types and migration application remain project-owned because they depend on
the selected hosted or local Supabase workflow.
