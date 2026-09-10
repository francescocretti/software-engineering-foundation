# ADR 0003: Risk-based security assurance with ASVS 5.0.0

- Status: accepted
- Date: 2026-09-10

## Context

The foundation must cover unauthenticated public sites, ordinary authenticated
business applications and high-impact systems without applying a shallow common
checklist to all three. Existing production applications provide useful
implementation experience but are not sufficient as the normative security
source.

OWASP ASVS provides versioned, verifiable application requirements and three
cumulative assurance levels. NIST SSDF covers development lifecycle and
supply-chain outcomes outside the narrower application scope of ASVS. OWASP Top
10 documents provide threat awareness but are not complete verification
standards.

## Decision

Use three project profiles:

- R1 is allowed only for public applications without identity, privileged
  behavior, sensitive data or material impact and verifies applicable ASVS L1.
- R2 is the default for authenticated, internal or ordinary personal and
  business-data applications and verifies applicable ASVS L1 and L2.
- R3 covers highly sensitive, regulated, financial, physical, safety-critical or
  broadly privileged systems and verifies applicable ASVS L1, L2 and L3.

Pin the baseline to OWASP ASVS 5.0.0 and use version-qualified requirement IDs.
Require evidence or a reviewable not-applicable rationale for each requirement.
Apply common security controls at every risk level, then compose the selected
profile. Use NIST SSDF 1.1 and the current OWASP web and API Top 10 documents as
additional lifecycle and coverage sources.

## Consequences

- Classification is recorded before implementation and reassessed when risk
  changes.
- R1 remains a real verified baseline rather than “no security”.
- Selecting a profile does not itself establish ASVS conformance.
- R2 and R3 require progressively stronger design, review and operational
  evidence.
- Updating the pinned ASVS version requires deliberate mapping and migration
  work rather than silently following the upstream bleeding edge.
