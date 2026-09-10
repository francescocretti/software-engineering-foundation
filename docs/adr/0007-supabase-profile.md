# ADR 0007: Supabase profile as a database overlay

- **Status:** accepted
- **Date:** 2026-09-10

## Context

Supabase exposes PostgreSQL directly to clients, so authorization lives in the
database. Internal repositories show mature migrations and RLS policies but no
repeatable test of what policies deny, and mix legacy `anon` and
`service_role` terminology with the current publishable and secret keys.
The Supabase CLI and Docker are required to run the local stack, which the
repository cannot assume in every environment.

## Decision

- Model Supabase as an overlay applied after a Fastify, Nest or React profile
  or on a monorepo root. It contributes `db:*` scripts, key names, the CLI
  configuration, a reference migration and a pgTAP suite; it does not add
  application code.
- Require, for every exposed table, RLS plus revoked default grants plus
  explicit grants plus policies written with `(select auth.uid())`. Functions
  default to invoker rights with an empty `search_path`.
- Verify the overlay statically on every test run, rejecting migrations that
  create tables without that structure, and live through pgTAP behind an
  explicit opt-in when Docker is available.
- Use publishable and secret key terminology in generated files and map legacy
  names only where tools still require them.

## Consequences

Generated projects start with a tested authorization model instead of an open
Data API. Live verification depends on Docker and is opt-in, so the reference
migration and suite were executed against the local stack when the profile
was introduced and must be re-run whenever they change. Generated database
types are produced by the CLI and committed by the project rather than shipped
by the template.
