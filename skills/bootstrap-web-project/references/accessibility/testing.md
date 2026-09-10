# Accessibility verification standard

Accessibility verification is layered because static analysis, DOM automation,
manual inspection and evaluation with assistive technology find different
classes of defects. Every frontend applies all layers; project risk may increase
their frequency or breadth but never remove one.

## `A11Y-TEST-STATIC-001` — reject detectable JSX defects early

- **Level:** MUST
- **Applies to:** React frontends
- **Risk levels:** R1, R2, R3
- **Requirement:** Enable the strict `eslint-plugin-jsx-a11y` Flat Config rules
  in the React ESLint preset. Map design-system components and polymorphic props
  to their rendered semantics so linting covers abstractions, not only raw JSX.
- **Rationale:** Immediate feedback prevents common semantic defects from
  reaching rendered tests or review.
- **Verification:** Run `yarn lint` on representative native, custom and
  polymorphic controls; confirm invalid names, roles and interactions fail.
- **Sources:** [`eslint-plugin-jsx-a11y`](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y).
- **Exceptions:** Disable a rule only at the narrowest location with a reason and
  an equivalent rendered or manual verification.

## `A11Y-TEST-COMPONENT-001` — test through the accessibility surface

- **Level:** MUST
- **Applies to:** React component and integration tests
- **Risk levels:** R1, R2, R3
- **Requirement:** Prefer queries by semantic role and accessible name, then by
  label or visible text. Drive interactions through user-level keyboard and
  pointer events; do not use test IDs when an accessible query can express the
  contract.
- **Rationale:** Tests that use the accessibility tree reward usable semantics
  and resemble how users discover controls.
- **Verification:** Review queries in changed interaction tests and confirm they
  fail when a required name, role or state is removed.
- **Sources:** [Testing Library query priority](https://testing-library.com/docs/queries/about/), [Testing Library `ByRole`](https://testing-library.com/docs/queries/byrole/).
- **Exceptions:** Test IDs may identify non-interactive implementation surfaces
  with no semantic or visible representation; document why in the test.

## `A11Y-TEST-AXE-001` — scan rendered states and critical flows

- **Level:** MUST
- **Applies to:** every frontend
- **Risk levels:** R1, R2, R3
- **Requirement:** Run axe-core against representative component states and
  critical browser flows, including content revealed after interaction. New
  code has zero unreviewed violations; every `incomplete` result is manually
  resolved or recorded for manual verification.
- **Rationale:** Rendered scans find detectable issues that source linting cannot,
  while explicit state coverage avoids scanning only an empty initial DOM.
- **Verification:** Inspect axe assertions and confirm flows open dialogs, menus,
  errors and asynchronous results before the scan. The provided component and
  browser assertions fail on both `violations` and unreviewed `incomplete`
  results. After manual verification, suppress only the affected rule and
  target and link the evidence, owner and review date beside that suppression.
- **Sources:** [axe-core](https://github.com/dequelabs/axe-core), [Playwright accessibility testing](https://playwright.dev/docs/accessibility-testing).
- **Exceptions:** A false positive may be suppressed only by rule and smallest
  target, with evidence, owner and review date; never snapshot an entire
  violation list as an accepted baseline.

## `A11Y-TEST-MANUAL-001` — manual checks accompany interaction changes

- **Level:** MUST
- **Applies to:** every frontend change affecting UI or content
- **Risk levels:** R1, R2, R3
- **Requirement:** Manually verify keyboard order and operation, visible focus,
  zoom and reflow, contrast states, reduced motion and meaningful reading order
  wherever the change can affect them. Record the applicable checks in review.
- **Rationale:** Human judgment is required for usability, meaning, order and
  criteria that automation cannot determine.
- **Verification:** The change record identifies tested states, viewport or zoom
  conditions and any non-applicable checks rather than reporting only a score.
- **Sources:** [W3C Evaluating Web Accessibility](https://www.w3.org/WAI/test-evaluate/), [W3C Easy Checks](https://www.w3.org/WAI/test-evaluate/easy-checks/).
- **Exceptions:** A change with no rendered or interaction effect may mark the
  manual layer non-applicable with a short reason.

## `A11Y-TEST-AT-001` — critical journeys work with assistive technology

- **Level:** MUST
- **Applies to:** every frontend before a significant release
- **Risk levels:** R1, R2, R3
- **Requirement:** Test critical user journeys with keyboard-only operation and
  at least one supported screen-reader and browser combination. Include another
  platform combination when the audience or product risk warrants it, and
  record versions, journeys and results.
- **Rationale:** Actual assistive-technology behavior cannot be inferred fully
  from source, the DOM or an automated rule engine.
- **Verification:** A release accessibility record names the combinations and
  journeys exercised and links unresolved defects to owned work.
- **Sources:** [W3C Evaluating Web Accessibility](https://www.w3.org/WAI/test-evaluate/), [ARIA APG support considerations](https://www.w3.org/WAI/ARIA/apg/practices/read-me-first/).
- **Exceptions:** A release with no frontend change may reuse recent evidence
  only when dependencies and supported browser or assistive-technology versions
  have not materially changed.

## `A11Y-TEST-CONFORMANCE-001` — claims require complete evidence

- **Level:** MUST
- **Applies to:** every frontend claiming WCAG conformance
- **Risk levels:** R1, R2, R3
- **Requirement:** Base a WCAG 2.2 AA conformance claim on an evaluation of the
  complete defined scope against every Level A and AA criterion. Do not infer
  conformance from Lighthouse, axe or another automated score.
- **Rationale:** No automated tool can determine full WCAG conformance, and a
  claim without scope or evidence is misleading.
- **Verification:** Review the scope, page and state sample, criterion-by-criterion
  results, evaluation methods, defects and date using WCAG-EM or an equivalent
  documented process.
- **Sources:** [WCAG-EM](https://www.w3.org/TR/WCAG-EM/), [W3C Evaluating Web Accessibility](https://www.w3.org/WAI/test-evaluate/).
- **Exceptions:** None. A project may accurately report partial test results
  without describing them as conformance.

## `A11Y-TEST-USERS-001` — involve users where impact justifies it

- **Level:** SHOULD
- **Applies to:** public, high-impact or novel frontends
- **Risk levels:** R1, R2, R3
- **Requirement:** Include people with disabilities in evaluation of critical or
  unfamiliar journeys, while keeping standards-based conformance evaluation as
  a separate requirement.
- **Rationale:** User evaluation exposes practical barriers and assumptions that
  technical checks miss, but a small participant set does not prove conformance.
- **Verification:** Record participant context, evaluated journeys, findings and
  the limits of conclusions drawn.
- **Sources:** [W3C — Involving Users in Evaluation](https://www.w3.org/WAI/test-evaluate/involving-users/).
- **Exceptions:** Document why direct user evaluation is disproportionate and
  which expert or assistive-technology evaluation substitutes for it.
