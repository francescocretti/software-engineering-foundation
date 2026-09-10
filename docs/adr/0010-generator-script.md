# ADR 0010: the bootstrap generator is a skill script

- **Status:** accepted
- **Date:** 2026-09-10

## Context

The skill described project generation as prose: copy these assets, replace
these placeholders, merge these manifests, strip these workspace fields. The
repository tests exercised a JavaScript generator that implemented the same
procedure to verify the templates. Two implementations of one procedure
existed, and only the one hidden in the tests was verified. Every refinement
found by validation, such as copying only the ESLint modules a profile uses,
had to be re-described in prose and re-executed by hand at each bootstrap. The
test generator also began by deleting its target, which is acceptable for
fixtures and unacceptable for a tool run on a developer machine.

## Decision

- Ship the generator as `skills/bootstrap-web-project/scripts/generate-project.mjs`,
  a library with a command-line interface, next to `ensure-git-root.mjs`. The
  skill workflow runs it; the references keep the written steps as the
  specification it implements and as the fallback when it cannot run.
- Keep the script self-contained: asset paths are relative to the skill and the
  foundation version is read from `versions.json`, which the repository tests
  keep equal to the package version.
- Never delete or overwrite: the target must not exist or must be empty, with
  only a fresh `.git` directory tolerated. Composition errors are reported
  before any file is written. There is no force option.
- Record the complete composition in `.engineering-foundation.yml`: every
  applied profile in order, including workspace profiles, and a map from each
  workspace directory to its profile.
- Tests import the script from its location and clean their fixtures through a
  helper that can only delete inside `tests/.generated`.

## Consequences

Agents and tests run the same code, so validation findings reach every
bootstrap immediately. The skill requires Node.js to run the script, which any
environment able to bootstrap a TypeScript project already has. Re-generating
into an existing directory is a deliberate act performed by the person who
empties it, not by the tool.
