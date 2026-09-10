# Supabase and PostgreSQL profile

Use this profile whenever the project uses Supabase or exposes PostgreSQL data
through the Supabase Data API.

## Security direction

- Enable RLS on every table in an exposed schema.
- Configure grants as well as policies; policies do not replace grants.
- Test allowed and denied `select`, `insert`, `update` and `delete` paths for
  the relevant anonymous and authenticated roles.
- Keep secret or elevated keys server-side; they bypass RLS.
- Do not use user-editable metadata as authorization data.
- Treat views, functions and storage policies as part of the authorization
  surface.

## Database direction

- Manage schema, grants and policies through reproducible migrations.
- Use constraints to preserve invariants at the database boundary.
- Index foreign keys and columns used by authorization policies when the query
  plan requires them.
- Keep generated database types synchronized with migrations.

Use the current `publishable` and `secret` key terminology while explaining
legacy `anon` and `service_role` mappings where an existing tool requires them.
