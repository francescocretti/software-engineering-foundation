# Fastify profile

Use this profile for a TypeScript Fastify backend.

## Structural direction

- Organize code by bounded feature and encapsulated Fastify plugin.
- Keep transport schemas, application logic and infrastructure integrations
  separable and testable.
- Define schemas for body, parameters, query, headers and responses.
- Treat accepted schemas as application code; never compile user-provided
  schemas.
- Perform asynchronous authorization and data access after initial structural
  validation.
- Return stable, safe error contracts without exposing internal exceptions.

Security headers, CORS, rate limiting, authentication and observability are
selected according to the security profile rather than enabled as unexplained
boilerplate.
