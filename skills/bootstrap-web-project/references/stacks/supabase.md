# Supabase and PostgreSQL profile

Use this profile whenever the project uses Supabase or exposes PostgreSQL data
through the Supabase Data API. It is an overlay: apply it on top of a Fastify,
Nest or React profile, or on the root of a full-stack monorepo. The decisions
are recorded in ADR 0007 of the foundation repository.

## Profile asset

The overlay lives in `assets/stacks/supabase/`:

| File | Purpose |
| --- | --- |
| `package.json` | `db:*` scripts merged into the base manifest |
| `.env.example`, `.gitignore` | Key names appended to the base files; CLI state ignored |
| `supabase/config.toml` | Local stack with exposed schemas, `max_rows` and confirmed email sign-up |
| `supabase/migrations/*.sql` | Reference migration: RLS, revoked defaults, column grants, owner policies, `updated_at` trigger |
| `supabase/tests/*.test.sql` | pgTAP suite covering anonymous, owner and cross-user paths |
| `supabase/seed.sql` | Synthetic local seed data only |

## Files to apply

1. Apply the base profile first.
2. Copy `assets/stacks/supabase/`: merge `scripts` into `package.json`, append
   `.env.example` and `.gitignore`, copy the `supabase/` directory and replace
   `{{PROJECT_NAME}}` in `config.toml`.
3. Add the `supabase` profile groups from `versions.json`:
   `@supabase/supabase-js` as a dependency and the `supabase` CLI as a
   development dependency.
4. Replace the reference `profiles` migration with the real initial schema,
   keeping its RLS, grant and policy structure and its pgTAP test as the model.
5. With Docker running, execute `corepack yarn db:start`,
   `corepack yarn db:test` and `corepack yarn db:types`, and commit the
   generated types.

## Client integration

- Browsers receive only the publishable key and reach data through RLS.
- Backends create one client per request with the user's access token so
  policies apply, and keep a separate secret-key client for administrative
  tasks that are authorized in application code.

```ts
import { createClient } from '@supabase/supabase-js'

import type { Database } from './database.types.ts'

export function createUserClient(
  url: string,
  publishableKey: string,
  accessToken: string,
) {
  return createClient<Database>(url, publishableKey, {
    auth: { autoRefreshToken: false, persistSession: false },
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
  })
}
```

## `SUPA-RLS-001` — Row Level Security with explicit grants on every table

- **Level:** MUST
- **Applies to:** Supabase projects
- **Risk levels:** R1, R2, R3
- **Requirement:** Enable RLS on every table in an exposed schema, revoke the
  default grants from `anon` and `authenticated`, grant only the operations and
  columns the policies allow, and write policies with `(select auth.uid())`.
  Views, functions and storage policies are part of the same authorization
  surface. Do not use user-editable metadata as authorization data.
- **Rationale:** Grants define what is possible and policies define which rows;
  either one alone leaves the Data API open.
- **Verification:** The generated-project test rejects migrations that create a
  table without RLS, revocation and policies; `corepack yarn db:test` runs the
  pgTAP suites.
- **Sources:** [Supabase Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security), [Supabase column-level privileges](https://supabase.com/docs/guides/database/postgres/column-level-security), `SEC-AUTHZ-001`.
- **Exceptions:** A deliberately public table documents its policy and still
  enables RLS with an explicit `select` policy.

## `SUPA-KEYS-001` — publishable in clients, secret on servers

- **Level:** MUST
- **Applies to:** Supabase projects
- **Risk levels:** R1, R2, R3
- **Requirement:** Use the publishable key in browsers and mobile clients and
  the secret key only in server-side code and CI. Never place the secret key in
  `VITE_` variables, client bundles, logs or fixtures. Map the legacy `anon`
  and `service_role` names to these roles only where a tool still requires
  them.
- **Rationale:** The secret key bypasses RLS; its exposure defeats every
  database policy.
- **Verification:** Search tracked files and built bundles for `sb_secret_` and
  service-role material; review `.env.example` names.
- **Sources:** [Supabase API keys](https://supabase.com/docs/guides/api/api-keys), `SEC-SECRETS-001`, `REACT-ENV-001`.
- **Exceptions:** None.

## `SUPA-MIGRATION-001` — reproducible schema and synchronized types

- **Level:** MUST
- **Applies to:** Supabase projects
- **Risk levels:** R1, R2, R3
- **Requirement:** Change schema, grants, policies, functions and storage
  configuration only through versioned migrations. Preserve invariants with
  constraints, index foreign keys and policy columns when query plans require
  it, regenerate `database.types.ts` after each migration and keep
  `seed.sql` synthetic.
- **Rationale:** Migrations make environments reproducible and reviewable;
  drifting types hide contract changes from the type checker.
- **Verification:** `corepack yarn db:reset` applies the migrations from
  scratch; a typecheck after `db:types` shows no drift.
- **Sources:** [Supabase migrations](https://supabase.com/docs/guides/deployment/database-migrations), [Supabase generating types](https://supabase.com/docs/guides/api/rest/generating-types), `DEP-LOCK-001`.
- **Exceptions:** Emergency production fixes are captured as a migration
  immediately afterwards.

## `SUPA-TEST-001` — pgTAP proves allowed and denied paths

- **Level:** MUST
- **Applies to:** Supabase projects
- **Risk levels:** R1, R2, R3
- **Requirement:** For every table, view and function reachable through the
  Data API, keep a pgTAP test that exercises anonymous, owning and non-owning
  identities for `select`, `insert`, `update` and `delete` as applicable. Run
  `corepack yarn db:test` before merge and in CI when CI is enabled.
- **Rationale:** Policies are code paths that fail silently by returning no
  rows; only negative tests show they deny what they should.
- **Verification:** Review the plan count against the authorization matrix;
  `corepack yarn db:test` reports every suite successful.
- **Sources:** [Supabase testing overview](https://supabase.com/docs/guides/local-development/testing/overview), [pgTAP](https://pgtap.org/documentation.html), `SEC-TEST-001`, `SEC-R2-AUTHZ-001`.
- **Exceptions:** None for exposed objects.

## `SUPA-FUNCTION-001` — invoker rights by default

- **Level:** MUST
- **Applies to:** Supabase projects with database functions
- **Risk levels:** R1, R2, R3
- **Requirement:** Create functions as `security invoker` with an empty
  `search_path`. A `security definer` function needs a documented reason, an
  explicit `search_path`, input validation and revoked `execute` from roles
  that must not call it.
- **Rationale:** Definer functions run with the owner's privileges and bypass
  RLS, turning any caller into a privileged actor.
- **Verification:** The generated-project test rejects `security definer` in
  template migrations; review each definer function against the exception
  record.
- **Sources:** [Supabase database functions](https://supabase.com/docs/guides/database/functions), [PostgreSQL CREATE FUNCTION](https://www.postgresql.org/docs/current/sql-createfunction.html), `SEC-AUTHZ-001`.
- **Exceptions:** As stated in the requirement, with owner and review date.
