# Shared foundation

Apply this reference to every generated project.

## Required standards

Read and apply every shared standard before generating a project:

- [Core engineering](standards/core.md)
- [TypeScript](standards/typescript.md)
- [Project structure](standards/project-structure.md)
- [Testing](standards/testing.md)
- [Dependencies and toolchain](standards/dependencies.md)
- [Git workflow](standards/git-workflow.md)

Then apply the [shared tooling implementation](tooling.md).

## Project record

Generate `.engineering-foundation.yml` with the foundation version, selected
profiles, security level, accessibility target, package manager and CI choice.

## Required commands

Every generated project exposes consistent Yarn scripts for:

- `lint`
- `lint:fix`
- `typecheck`
- `test`
- `build`
- `validate`, which runs the complete local quality gate

The exact command contracts and tool choices are defined in the linked
standards. Stack references may extend them but must not weaken them.
