# Contributing

Changes should make bootstrap behavior more reliable without turning the
foundation into an exhaustive software engineering encyclopedia.

## Before proposing a change

1. Identify the concrete project decision or failure the change addresses.
2. Check whether an existing requirement already covers it.
3. Prefer primary sources: standards bodies, security organizations and
   framework documentation.
4. Separate universal requirements from stack-specific guidance.
5. Add or update meaningful validation when behavior or assets change.

## Requirement changes

A new or changed MUST requirement includes:

- a stable identifier;
- the affected profiles and risk levels;
- a concise rationale;
- an observable verification method;
- source provenance;
- an exception process when exceptions are realistically possible.

Do not promote a single legacy incident or stylistic preference into a
universal requirement without showing that it generalizes.

## Pull request expectations

- Explain the user-visible or agent-visible outcome.
- List affected profiles and generated assets.
- Run `corepack yarn test`.
- Do not include credentials, production data or copied secret values.
