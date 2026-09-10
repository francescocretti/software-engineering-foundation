# Security risk classification

Classify the application before selecting security controls. Classification is
based on impact, data, privileges, exposure and business flows rather than the
chosen framework. The highest applicable trigger wins; a smaller implementation
budget never lowers the level.

Read the [shared security baseline](baseline.md), the
[ASVS verification contract](asvs.md), and exactly one assurance profile:

- [R1 — Basic](r1-basic.md)
- [R2 — Standard](r2-standard.md)
- [R3 — High](r3-high.md)

## Classification matrix

| Dimension | R1 — Basic | R2 — Standard | R3 — High |
| --- | --- | --- | --- |
| Identity | No accounts or authentication | Authenticated users or workforce access | Broad administration, security operators or high-value identities |
| Data | Public, non-sensitive | Ordinary personal, customer or business data | Highly sensitive, regulated, credential, health or high-impact data |
| Actions | Read-only or low-impact public behavior | Data changes and normal business operations | Money, safety, physical systems or critical operations |
| Exposure | Small public surface and limited integrations | Internet or internal application with APIs and integrations | High-value target, large multi-tenant reach or critical dependencies |
| Impact | Limited and readily reversible | Material confidentiality, integrity or availability impact | Severe legal, financial, physical, societal or operational impact |

R1 is valid only when every dimension remains in the R1 column. Any R2 trigger
makes the project at least R2. Any R3 trigger makes it R3.

## `SEC-RISK-001` — classify before implementation

- **Level:** MUST
- **Applies to:** all projects
- **Risk levels:** R1, R2, R3
- **Requirement:** Record the selected level and a short rationale covering
  identities, data, actions, exposure, integrations and worst credible impact
  before application code is generated.
- **Rationale:** Security controls can be proportionate only when the assets and
  consequences they protect are explicit.
- **Verification:** Review `.engineering-foundation.yml` and confirm each matrix
  dimension has evidence for the selected level.
- **Sources:** [OWASP ASVS 5.0.0 — Which level to achieve](https://github.com/OWASP/ASVS/blob/v5.0.0/5.0/en/0x03-What-is-the-ASVS.md#which-level-to-achieve), [NIST SSDF 1.1](https://csrc.nist.gov/pubs/sp/800/218/final).
- **Exceptions:** None. When information is missing, choose the higher plausible
  level until the uncertainty is resolved.

## `SEC-RISK-002` — R2 is the authenticated default

- **Level:** MUST
- **Applies to:** projects with authentication, privileged operations or
  non-public data
- **Risk levels:** R2, R3
- **Requirement:** Classify authenticated applications, internal management
  tools and applications handling ordinary personal or business data as at
  least R2. A project cannot use R1 merely because it is internal or small.
- **Rationale:** Authentication, authorization and non-public data introduce
  trust boundaries absent from the narrow R1 profile.
- **Verification:** Compare features and data classification with the recorded
  level; reject an R1 selection when any R2 trigger exists.
- **Sources:** [OWASP ASVS 5.0.0 verification levels](https://github.com/OWASP/ASVS/blob/v5.0.0/5.0/en/0x03-What-is-the-ASVS.md#application-security-verification-levels).
- **Exceptions:** None.

## `SEC-RISK-003` — reassess when the system changes

- **Level:** MUST
- **Applies to:** all projects
- **Risk levels:** R1, R2, R3
- **Requirement:** Reassess classification before adding authentication,
  sensitive data, privileged actions, financial or physical effects, major
  integrations, new exposure or materially larger scale.
- **Rationale:** A valid initial classification becomes unsafe when the threat
  model or impact changes.
- **Verification:** Security-sensitive design and review templates include a
  classification check; the manifest and evidence are updated before release.
- **Sources:** [NIST SSDF 1.1](https://csrc.nist.gov/pubs/sp/800/218/final), [OWASP ASVS 5.0.0](https://github.com/OWASP/ASVS/tree/v5.0.0/5.0).
- **Exceptions:** None.

## `SEC-RISK-004` — project-specific controls may raise the baseline

- **Level:** MUST
- **Applies to:** all projects
- **Risk levels:** R1, R2, R3
- **Requirement:** Add controls required by regulation, contract, threat model,
  customer commitment or platform policy even when they belong to a higher ASVS
  level. The selected profile is a floor, not a complete risk decision.
- **Rationale:** Generic assurance levels cannot encode every domain threat or
  obligation.
- **Verification:** Review applicable obligations and threat findings against the
  selected checklist and record added requirements by stable identifier.
- **Sources:** [OWASP ASVS 5.0.0 — Flexibility](https://github.com/OWASP/ASVS/blob/v5.0.0/5.0/en/0x03-What-is-the-ASVS.md#flexibility-with-the-asvs), [NIST SSDF 1.1](https://csrc.nist.gov/pubs/sp/800/218/final).
- **Exceptions:** None.
