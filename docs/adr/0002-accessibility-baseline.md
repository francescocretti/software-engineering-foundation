# ADR 0002: Mandatory WCAG 2.2 AA accessibility baseline

- Status: accepted
- Date: 2026-09-10

## Context

Accessibility in the internal reference repositories is not complete enough to
serve as the future baseline. Automated tools detect only part of the problem,
and treating accessibility as a risk-dependent or late audit activity would
allow inaccessible foundations to spread across every generated project.

## Decision

Require WCAG 2.2 Level AA for every generated frontend, independent of the R1,
R2 or R3 security classification. Apply it to every user-visible page, state
and supported viewport rather than only representative static pages.

Use W3C specifications and guidance as the normative source. Use ARIA APG for
custom interaction contracts. Verification has mandatory static, component,
rendered automation, manual keyboard and assistive-technology layers. Automated
scores or scans do not establish conformance.

Maintain an explicit map from every WCAG 2.2 Level A and AA success criterion to
one or more local requirement IDs. Treat reusable UI primitives as the primary
place to encode accessible defaults.

## Consequences

- Accessibility work begins with component and interaction design.
- Frontend profiles require accessibility linting and rendered axe checks.
- Significant releases require recorded manual and assistive-technology checks.
- Projects need an exception record for any permitted WCAG exception; security
  risk classification cannot lower the accessibility target.
- Formal conformance claims require scoped criterion-by-criterion evidence.
