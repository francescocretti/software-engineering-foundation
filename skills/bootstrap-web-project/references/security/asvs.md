# OWASP ASVS verification contract

OWASP ASVS 5.0.0 is the pinned application-security verification baseline. The
stable release is authoritative; do not silently follow the repository's
bleeding-edge branch. Local requirements provide implementation direction but
do not replace the applicable ASVS requirements.

## `SEC-ASVS-001` — pin versioned requirement identifiers

- **Level:** MUST
- **Applies to:** all projects
- **Risk levels:** R1, R2, R3
- **Requirement:** Reference ASVS requirements as `v5.0.0-<chapter>.<section>.<id>`
  in checklists, findings and exceptions. Record the ASVS version in
  `.engineering-foundation.yml`.
- **Rationale:** ASVS identifiers may change between releases; versioned IDs keep
  evidence and decisions interpretable.
- **Verification:** Inspect project security records for the `v5.0.0-` prefix and
  compare the manifest with the pinned stable source.
- **Sources:** [ASVS 5.0.0 — How to reference requirements](https://github.com/OWASP/ASVS/blob/v5.0.0/5.0/en/0x03-What-is-the-ASVS.md#how-to-reference-asvs-requirements).
- **Exceptions:** None.

## `SEC-ASVS-002` — verify cumulative assurance levels

- **Level:** MUST
- **Applies to:** all projects
- **Risk levels:** R1, R2, R3
- **Requirement:** R1 verifies every applicable ASVS L1 requirement; R2 verifies
  every applicable L1 and L2 requirement; R3 verifies every applicable L1, L2
  and L3 requirement.
- **Rationale:** ASVS levels are cumulative assurance targets rather than
  independent menus.
- **Verification:** Filter the official ASVS 5.0.0 machine-readable artifact by
  level and reconcile every resulting requirement with project evidence or an
  approved not-applicable decision.
- **Sources:** [ASVS 5.0.0 verification levels](https://github.com/OWASP/ASVS/blob/v5.0.0/5.0/en/0x03-What-is-the-ASVS.md#application-security-verification-levels), [ASVS 5.0.0 JSON](https://raw.githubusercontent.com/OWASP/ASVS/v5.0.0/5.0/docs_en/OWASP_Application_Security_Verification_Standard_5.0.0_en.json).
- **Exceptions:** A requirement may be not applicable only because its feature
  or protocol is absent, never because implementation is inconvenient.

## `SEC-ASVS-003` — evidence is requirement-specific

- **Level:** MUST
- **Applies to:** all projects
- **Risk levels:** R1, R2, R3
- **Requirement:** For each applicable ASVS requirement record status, evidence,
  verification method, owner and last verification date. Documentation-only
  intent is not implementation evidence, and implementation without a testable
  decision is incomplete when ASVS requires both.
- **Rationale:** A generic statement such as “ASVS compliant” cannot be reviewed
  or reproduced.
- **Verification:** Sample checklist entries and follow each evidence link to a
  test, configuration, code path or reviewed decision that proves the outcome.
- **Sources:** [ASVS 5.0.0 — Verification and documented security decisions](https://github.com/OWASP/ASVS/blob/v5.0.0/5.0/en/0x03-What-is-the-ASVS.md#documented-security-decisions).
- **Exceptions:** None for a conformance claim. Work in progress must be reported
  as incomplete rather than compliant.

## `SEC-ASVS-004` — not-applicable decisions are reviewable

- **Level:** MUST
- **Applies to:** all projects
- **Risk levels:** R1, R2, R3
- **Requirement:** A not-applicable entry names the absent feature, protocol or
  trust boundary and includes evidence that it is not reachable. Reassess it
  when architecture or dependencies change.
- **Rationale:** Unexplained exclusions can hide missing controls and make an
  assurance level meaningless.
- **Verification:** Review every not-applicable entry and trace it against the
  current architecture, routes, protocols and dependencies.
- **Sources:** [ASVS 5.0.0 — Structure and applicability](https://github.com/OWASP/ASVS/blob/v5.0.0/5.0/en/0x03-What-is-the-ASVS.md#the-structure-of-the-asvs).
- **Exceptions:** None.

## `SEC-ASVS-005` — Top 10 lists are coverage checks, not substitutes

- **Level:** MUST
- **Applies to:** web applications and APIs
- **Risk levels:** R1, R2, R3
- **Requirement:** Review the OWASP Top 10:2025 and API Security Top 10:2023 for
  threat coverage, while using ASVS and project-specific threats as the
  verification baseline.
- **Rationale:** Top 10 lists are awareness documents and intentionally omit many
  detailed or non-API-specific requirements.
- **Verification:** Threat or review evidence maps relevant Top 10 categories to
  implemented requirements without claiming that a Top 10 scan proves security.
- **Sources:** [OWASP Top 10:2025](https://owasp.org/Top10/2025/), [OWASP API Security Top 10:2023](https://owasp.org/API-Security/editions/2023/en/0x11-t10/).
- **Exceptions:** A project with no HTTP API may mark the API-specific review not
  applicable; the web Top 10 and ASVS baseline remain where relevant.
