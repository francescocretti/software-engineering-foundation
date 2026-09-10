# Optional GitLab CI profile

Apply this profile only when the user selects GitLab CI.

## Intended baseline

The minimal pipeline verifies:

1. immutable Yarn installation;
2. ESLint;
3. TypeScript;
4. tests;
5. build.

It contains no deployment workflow and makes no assumption about environments,
cloud providers or release strategy.

## Secret safety

- Never echo a secret or authentication variable.
- Never dump the complete environment with `env`, `printenv`, `export` or
  equivalent commands.
- Do not enable shell tracing around secret-consuming commands.
- Treat masking as defense in depth, not as permission to print a value.
- Review pipeline changes before exposing protected variables to them.

GitLab Secret Detection may be offered as a separate opt-in include. Its
availability does not weaken the prohibition on committing or printing secrets.
