# Standards governance

## Normative language

- **MUST** identifies a non-negotiable baseline. A deviation requires a
  documented exception.
- **SHOULD** identifies the expected default. A project may choose differently
  when it records a concrete reason.
- **MAY** identifies an optional technique or capability.

The words are used only when they materially clarify the force of a rule.

## Requirement shape

Normative requirements use the following fields:

```text
ID: A11Y-SEMANTICS-001
Level: MUST
Applies to: react
Risk levels: R1, R2, R3
Requirement: Prefer native semantic HTML over reconstructing semantics with ARIA.
Rationale: Native elements provide established browser and assistive-technology behavior.
Verification: Static analysis plus keyboard and accessibility-tree inspection.
Sources: WCAG 2.2; WAI-ARIA Authoring Practices Guide.
Exceptions: Document why no suitable native element exists and test the full interaction contract.
```

Identifiers are stable. Renaming or removing an identifier is a versioned
change and must preserve a migration note.

## Source hierarchy

Use sources in this order:

1. Normative standards and official specifications.
2. OWASP, NIST and other recognized security authorities.
3. Official language, runtime and framework documentation.
4. Maintainer-owned documentation for selected tools.
5. Practitioner experience with production applications as evidence of proven
   practice.
6. Public skills and community material as workflow inspiration only.

When sources disagree, document the conflict and the reason for the local
decision. Do not silently blend incompatible recommendations.

## Rule placement

- Shared invariant: `references/standards/`.
- Risk-specific security control: `references/security/`.
- Framework-specific decision: `references/stacks/`.
- File copied into a generated project: `assets/`.
- Repository-level decision: `docs/adr/`.

Each rule has one canonical location. Other documents link to it.

## Exceptions

An exception records:

- requirement identifier;
- affected scope;
- technical or business justification;
- compensating control, when applicable;
- owner;
- review or expiry date.

Inline suppressions such as ESLint disable comments must include a reason and
remain as narrow as possible.

## Versioning

Repository releases use semantic versioning:

- patch: clarification or compatible asset fix;
- minor: new optional profile or compatible requirement;
- major: changed mandatory behavior, removed profile or migration requirement.

Generated projects record the applied foundation version in
`.engineering-foundation.yml`.
