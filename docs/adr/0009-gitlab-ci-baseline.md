# ADR 0009: optional GitLab CI is a minimal verification baseline

- **Status:** accepted
- **Date:** 2026-09-10

## Context

Teams host projects on GitLab and elsewhere, and deployment strategies differ
per project. Internal pipelines have mixed verification with deployment and,
in one case, printed authentication material into job logs. The foundation
fixes CI as optional and basic.

## Decision

- Ship one `.gitlab-ci.yml` asset selected explicitly by the user. It runs an
  immutable Yarn installation on the pinned Node.js major and then the root
  `lint`, `typecheck`, `test` and `build` scripts as parallel jobs on merge
  requests, the default branch and tags.
- Cache only the project-local Yarn cache keyed on `yarn.lock`; disable Husky
  in CI; never dump the environment or trace shell commands.
- Exclude deployment, environments, browser tests and Docker-dependent
  database tests from the baseline; projects add them with their own images.
- Verify the asset statically in the repository tests: image major, immutable
  install, the four commands and the absence of environment dumps.

## Consequences

Every generated project with GitLab CI runs the same gate as `validate`
without assuming a hosting or release model. Projects that need browsers,
Docker or deployments extend the pipeline deliberately, and secret handling
stays subject to the shared standard rather than to CI masking.
