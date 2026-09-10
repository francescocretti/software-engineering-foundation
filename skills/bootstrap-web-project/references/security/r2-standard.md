# R2 — Standard assurance profile

R2 is the default for authenticated applications, internal management tools and
applications processing ordinary business or personal data. Apply the
[shared baseline](baseline.md) and applicable OWASP ASVS 5.0.0 L1 and L2
requirements.

## `SEC-R2-THREAT-001` — lightweight threat analysis for sensitive features

- **Level:** MUST
- **Applies to:** R2 projects
- **Risk levels:** R2
- **Requirement:** Before implementing a security-sensitive feature, record its
  actors, assets, trust boundaries, data flow, abuse cases and chosen controls.
  Update the analysis when the design changes.
- **Rationale:** Authorization, data and integration flaws are cheaper to prevent
  in design than discover after implementation.
- **Verification:** The feature review links a current analysis to implemented
  controls and negative tests.
- **Sources:** [OWASP Threat Modeling Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html), [OWASP Top 10:2025 A06](https://owasp.org/Top10/2025/A06_2025-Insecure_Design/), NIST SSDF PW.1.
- **Exceptions:** Pure presentation changes with no trust, data or control impact
  may mark the analysis not applicable.

## `SEC-R2-IDENTITY-001` — documented identity and session design

- **Level:** MUST
- **Applies to:** R2 projects with authentication
- **Risk levels:** R2
- **Requirement:** Document identity sources, login and recovery, session or token
  lifecycle, account linking, administrative impersonation and logout or
  revocation behavior. Implement only the reviewed mechanisms.
- **Rationale:** Identity controls fail when related flows evolve independently
  or rely on implicit provider behavior.
- **Verification:** Trace each identity flow through configuration, code and tests
  and compare it with the documented design.
- **Sources:** ASVS 5.0.0 V6, V7, V9 and V10; [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html).
- **Exceptions:** Omit mechanisms the application does not support and record
  them as not applicable.

## `SEC-R2-AUTHZ-001` — authorization matrix and tenant isolation

- **Level:** MUST
- **Applies to:** R2 projects with roles, ownership or tenants
- **Risk levels:** R2
- **Requirement:** Maintain a matrix of actors, operations and resource scopes.
  Enforce it at server or database boundaries and test cross-user, cross-role and
  cross-tenant denial for every material resource type.
- **Rationale:** Scattered positive checks do not prove consistent object- and
  function-level isolation.
- **Verification:** Reconcile routes and data operations with the matrix and run
  parameterized denial tests for each role and tenant boundary.
- **Sources:** ASVS 5.0.0 V8; [OWASP Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html); OWASP API1, API3 and API5:2023.
- **Exceptions:** A single-user system may omit tenant cases but still documents
  and tests its actor and resource policy.

## `SEC-R2-MFA-001` — protect privileged accounts with MFA

- **Level:** MUST
- **Applies to:** R2 projects with administrative or materially privileged users
- **Risk levels:** R2
- **Requirement:** Require MFA for privileged accounts and sensitive privilege
  elevation. Prefer phishing-resistant methods where the identity provider and
  user environment support them.
- **Rationale:** Privileged credential compromise has disproportionate impact.
- **Verification:** Test enrollment, challenge, recovery, reset, step-up and
  revocation, including attempts to bypass MFA through alternate flows.
- **Sources:** ASVS 5.0.0 V6; [OWASP Multifactor Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html).
- **Exceptions:** A time-bounded provider limitation requires compensating access
  restriction, monitoring and an owned migration date.

## `SEC-R2-REVIEW-001` — security review before significant release

- **Level:** MUST
- **Applies to:** R2 projects
- **Risk levels:** R2
- **Requirement:** Before the first and each significant security-affecting
  release, review the threat analysis, ASVS L1 and L2 evidence, authorization
  tests, dependency findings, production configuration and open exceptions.
- **Rationale:** Controls implemented at different times must be evaluated as one
  released system.
- **Verification:** A revision-specific review record names reviewer, evidence,
  accepted findings and release decision.
- **Sources:** [NIST SSDF 1.1](https://csrc.nist.gov/pubs/sp/800/218/final), [OWASP ASVS 5.0.0](https://github.com/OWASP/ASVS/tree/v5.0.0/5.0).
- **Exceptions:** Emergency releases may complete the review immediately after
  deployment only when delay creates greater documented risk.

## `SEC-R2-RESPONSE-001` — owned detection and response

- **Level:** MUST
- **Applies to:** R2 projects
- **Risk levels:** R2
- **Requirement:** Assign owners and response paths for authentication abuse,
  authorization anomalies, secret exposure, dependency vulnerabilities and data
  incidents. Define containment, rotation and notification decisions before they
  are needed.
- **Rationale:** Detection without ownership prolongs exposure and improvises
  high-impact decisions during an incident.
- **Verification:** Follow a representative alert or tabletop scenario through
  triage, containment, recovery and follow-up ownership.
- **Sources:** [NIST SSDF 1.1](https://csrc.nist.gov/pubs/sp/800/218/final), [OWASP Logging Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html).
- **Exceptions:** Response may use a shared organizational process when the
  project-specific contacts, assets and rotation steps are linked.
