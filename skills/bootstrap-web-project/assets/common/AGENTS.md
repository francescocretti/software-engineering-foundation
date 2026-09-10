# Project instructions

This project follows Software Engineering Foundation version
`{{FOUNDATION_VERSION}}` with profiles `{{PROFILES}}` and security level
`{{SECURITY_LEVEL}}`.

## Commands

Use Yarn through Corepack:

```sh
corepack yarn lint
corepack yarn typecheck
corepack yarn test
corepack yarn build
corepack yarn validate
```

## Invariants

- Use TypeScript strict mode.
- Use ESLint for linting and JavaScript or TypeScript formatting.
- Do not add Prettier or another package manager.
- Never commit, print or log secrets and authentication material.
- Validate external input at the appropriate trust boundary.
- Preserve or improve tests for changed behavior.
{{ACCESSIBILITY_INVARIANTS}}

Read `.engineering-foundation.yml` for the selected profiles and security
classification. Apply the matching security profile and keep ASVS evidence
versioned with the project. Document any intentional deviation from a MUST
requirement with its identifier, reason, compensating control, owner and review
date.
