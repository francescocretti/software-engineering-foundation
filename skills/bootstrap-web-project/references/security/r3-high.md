# R3 — High assurance profile

R3 applies when compromise could materially affect highly sensitive data,
money, regulated activity, physical systems, critical operations or broad
privileged administration. Apply the [shared baseline](baseline.md) and every
applicable OWASP ASVS 5.0.0 L1, L2 and L3 requirement. Domain regulation and
safety engineering may add stricter controls beyond this web foundation.

## `SEC-R3-MODEL-001` — formal threat model before implementation

- **Level:** MUST
- **Applies to:** R3 projects
- **Risk levels:** R3
- **Requirement:** Create and review a versioned threat model covering system and
  data-flow diagrams, assets, actors, trust boundaries, threats, abuse cases,
  mitigations, residual risk and validation before implementing the affected
  architecture.
- **Rationale:** High-impact systems need systematic design evidence rather than
  feature-local intuition.
- **Verification:** Independent reviewers can trace every material threat to an
  implemented control, test, accepted residual risk and accountable owner.
- **Sources:** [OWASP Threat Modeling Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html), ASVS 5.0.0 V15, NIST SSDF PW.1.
- **Exceptions:** None for new R3 systems or material architecture changes.

## `SEC-R3-INDEPENDENT-001` — independent critical-control review

- **Level:** MUST
- **Applies to:** R3 projects
- **Risk levels:** R3
- **Requirement:** A qualified reviewer who did not implement the control reviews
  authentication, authorization, cryptography, high-impact business rules,
  trust-boundary code and threat-model closure before release.
- **Rationale:** Independence reduces confirmation bias in controls whose failure
  has severe consequences.
- **Verification:** Review records identify scope, reviewer, evidence, findings
  and resolution without self-approval of critical findings.
- **Sources:** [NIST SSDF 1.1](https://csrc.nist.gov/pubs/sp/800/218/final), [OWASP ASVS 5.0.0](https://github.com/OWASP/ASVS/tree/v5.0.0/5.0).
- **Exceptions:** An emergency hotfix may receive retrospective independent
  review within a predefined short window when immediate deployment reduces
  greater risk.

## `SEC-R3-ASSESS-001` — independent adversarial assessment

- **Level:** MUST
- **Applies to:** R3 projects
- **Risk levels:** R3
- **Requirement:** Perform scoped penetration testing or equivalent adversarial
  assessment before initial production use and after material changes to attack
  surface or critical controls. Include authenticated and business-logic abuse,
  not only unauthenticated scanning.
- **Rationale:** High-assurance verification needs attacker-oriented exploration
  beyond deterministic implementation tests.
- **Verification:** The assessment scope matches the deployed architecture;
  findings have severity, evidence, owner, remediation and retest status.
- **Sources:** [OWASP Web Security Testing Guide](https://owasp.org/www-project-web-security-testing-guide/), [OWASP ASVS 5.0.0](https://github.com/OWASP/ASVS/tree/v5.0.0/5.0).
- **Exceptions:** Timing may be risk-accepted only by the accountable security
  owner with compensating controls and a scheduled assessment date.

## `SEC-R3-IDENTITY-001` — phishing-resistant privileged access

- **Level:** MUST
- **Applies to:** R3 projects with human privileged access
- **Risk levels:** R3
- **Requirement:** Require phishing-resistant MFA for privileged and high-impact
  actions, prohibit shared administrator identities and use time-bounded
  elevation with explicit re-authentication where supported.
- **Rationale:** Persistent broad privilege and phishable factors create a direct
  path to catastrophic compromise.
- **Verification:** Test enrollment, recovery, elevation, expiry and revocation;
  audit provider policy and eliminate alternate weaker administrator paths.
- **Sources:** ASVS 5.0.0 V6 and V8; [NIST SP 800-63B-4](https://pages.nist.gov/800-63-4/sp800-63b.html).
- **Exceptions:** Non-human identities use workload identity or equivalent
  short-lived credentials with no interactive MFA path.

## `SEC-R3-AUDIT-001` — protected and reviewable audit trail

- **Level:** MUST
- **Applies to:** R3 projects
- **Risk levels:** R3
- **Requirement:** Protect security audit events from application-user deletion
  or alteration, centralize them outside the originating trust boundary, monitor
  critical patterns and test retention and clock consistency.
- **Rationale:** A powerful attacker may attempt to erase evidence or act through
  low-signal sequences.
- **Verification:** Attempt unauthorized alteration, trigger detection rules and
  reconstruct a representative privileged action across services.
- **Sources:** ASVS 5.0.0 V16; [OWASP Logging Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html).
- **Exceptions:** None for material privileged or high-impact actions.

## `SEC-R3-SUPPLY-001` — release provenance and component inventory

- **Level:** MUST
- **Applies to:** R3 projects
- **Risk levels:** R3
- **Requirement:** Produce an SBOM for each release, preserve source and build
  provenance, protect the build pipeline, verify release integrity and restrict
  dependency and publication changes through independent approval.
- **Rationale:** High-assurance application code is insufficient if components or
  release artifacts can be substituted.
- **Verification:** Trace a deployed artifact to reviewed source, locked
  dependencies, build identity, SBOM and integrity evidence.
- **Sources:** NIST SSDF PS.3 and PW.4; [OWASP Top 10:2025 A03](https://owasp.org/Top10/2025/A03_2025-Software_Supply_Chain_Failures/) and A08.
- **Exceptions:** A platform limitation requires equivalent provenance evidence
  and a documented migration path; the component inventory remains mandatory.

## `SEC-R3-RESILIENCE-001` — exercise response, recovery and rotation

- **Level:** MUST
- **Applies to:** R3 projects
- **Risk levels:** R3
- **Requirement:** Define and rehearse incident response, secret and key rotation,
  compromised-identity revocation, data recovery and safe degraded behavior.
  Feed exercise and incident root causes back into requirements and tests.
- **Rationale:** Controls can fail; severe-impact systems need demonstrated
  containment and recovery rather than untested procedures.
- **Verification:** Time-boxed exercises produce measured outcomes, gaps, owners
  and regression protections, including restoration validation.
- **Sources:** [NIST SSDF 1.1](https://csrc.nist.gov/pubs/sp/800/218/final), ASVS 5.0.0 V11, V14 and V16.
- **Exceptions:** Exercises may use isolated representative environments but
  cannot be replaced by document review alone.

## `SEC-R3-RELEASE-001` — accountable residual-risk decision

- **Level:** MUST
- **Applies to:** R3 projects
- **Risk levels:** R3
- **Requirement:** Do not release with unresolved critical findings. An
  accountable security owner reviews high findings, ASVS evidence, threat-model
  residual risks, assessment results and operational readiness and records the
  release decision.
- **Rationale:** High-assurance evidence needs an explicit owner who can evaluate
  combined residual risk.
- **Verification:** The release record is revision-specific and no critical item
  is open, suppressed or unowned.
- **Sources:** [NIST SSDF 1.1](https://csrc.nist.gov/pubs/sp/800/218/final), [OWASP ASVS 5.0.0](https://github.com/OWASP/ASVS/tree/v5.0.0/5.0).
- **Exceptions:** None for unresolved critical findings.
