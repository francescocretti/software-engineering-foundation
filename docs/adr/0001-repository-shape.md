# ADR 0001: Knowledge repository with one bootstrap skill

- Status: accepted
- Date: 2026-09-10

## Context

The same engineering expectations must be reusable by different teams and by
agents using different models. A single large instruction file would load
irrelevant framework detail and make maintenance difficult. A skill without
human-readable source documentation would make the knowledge less accessible.

## Decision

Maintain one repository as the source of truth and expose one initial Agent
Skill named `bootstrap-web-project`.

The skill routes to conditional references for React, Fastify, Nest, Supabase,
accessibility, security and optional GitLab CI. Files intended for generated
projects are stored as assets. The generated project receives a concise
`AGENTS.md` and a manifest recording the applied foundation version and
profiles.

Do not split the skill by framework until independent workflows or reliable
activation require it.

## Consequences

- Agents load only relevant guidance.
- Humans can browse the same canonical content.
- Installed copies of the skill remain self-contained.
- Updating an already-generated project is not automatic in the first version.
- A future upgrade workflow can use `.engineering-foundation.yml` without
  changing the initial bootstrap contract.
