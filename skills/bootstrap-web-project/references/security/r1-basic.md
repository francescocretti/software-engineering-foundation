# R1 — Basic assurance profile

R1 is deliberately narrow: a public application with no identity, privileged
operation, sensitive data or material business impact. Apply the
[shared baseline](baseline.md) and applicable OWASP ASVS 5.0.0 L1 requirements.

## `SEC-R1-REVIEW-001` — lightweight attack-surface review

- **Level:** MUST
- **Applies to:** R1 projects
- **Risk levels:** R1
- **Requirement:** Before release, enumerate public routes, inputs, assets,
  dependencies and integrations and identify how each could be abused or exhaust
  resources. Confirm the application still satisfies every R1 classification
  condition.
- **Rationale:** Even unauthenticated applications expose parsers, dependencies
  and resources to hostile traffic.
- **Verification:** Review the recorded surface against runtime routes, build
  output and integrations; resolve or own every identified control gap.
- **Sources:** [OWASP ASVS 5.0.0 L1](https://github.com/OWASP/ASVS/tree/v5.0.0/5.0), [OWASP Top 10:2025](https://owasp.org/Top10/2025/).
- **Exceptions:** None.

## `SEC-R1-EVIDENCE-001` — release evidence for minimum controls

- **Level:** MUST
- **Applies to:** R1 projects
- **Risk levels:** R1
- **Requirement:** Complete the applicable ASVS 5.0.0 L1 checklist and retain
  evidence for boundary validation, configuration, dependency, error, logging
  and resource controls before the first production release and significant
  security-affecting releases.
- **Rationale:** “Basic” defines a smaller verified scope, not an absence of
  security work.
- **Verification:** No applicable L1 item is failed or unexplained, and evidence
  points to the released revision and environment.
- **Sources:** [OWASP ASVS 5.0.0 verification levels](https://github.com/OWASP/ASVS/blob/v5.0.0/5.0/en/0x03-What-is-the-ASVS.md#level-1).
- **Exceptions:** An accepted temporary gap follows the repository exception
  process and means the project cannot claim full ASVS L1 conformance.

## `SEC-R1-SCOPE-001` — stop when R1 assumptions change

- **Level:** MUST
- **Applies to:** R1 projects
- **Risk levels:** R1
- **Requirement:** Stop feature implementation and reclassify before adding
  accounts, access-controlled content, user-specific writes, sensitive data,
  privileged integration or material business consequences.
- **Rationale:** R1 omits assurance expected for authenticated and sensitive
  systems.
- **Verification:** Feature review explicitly confirms whether an R2 or R3
  trigger is introduced.
- **Sources:** [OWASP ASVS 5.0.0 — Which level to achieve](https://github.com/OWASP/ASVS/blob/v5.0.0/5.0/en/0x03-What-is-the-ASVS.md#which-level-to-achieve).
- **Exceptions:** None.
