# Nest profile

Use this profile for a TypeScript Nest backend.

## Structural direction

- Organize modules around product capabilities rather than technical layers
  shared across the entire application.
- Keep controllers thin and place use-case behavior behind injectable services.
- Use explicit DTOs at transport boundaries.
- Apply global validation with allowlisted properties and reject unexpected
  properties by default.
- Configure security middleware before routes.
- Apply authorization at both function and resource level.
- Add throttling to authentication and abuse-sensitive flows.
- Add CSRF protection when browser authentication relies on cookies or
  sessions.

The detailed asset will choose concrete Nest configuration only after the
security standard and testing contract are approved.
