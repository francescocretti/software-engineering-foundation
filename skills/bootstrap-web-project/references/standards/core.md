# Core engineering standard

These requirements apply to production code, tests, scripts and configuration
unless a narrower scope is stated. Framework references may add constraints but
must not weaken this baseline.

## `CORE-CONTRACT-001` — explicit contracts at boundaries

- **Level:** MUST
- **Applies to:** all projects
- **Risk levels:** R1, R2, R3
- **Requirement:** Define explicit inputs, outputs and failure behavior at
  module, service and external-system boundaries. Validate untrusted data when
  it crosses into a trusted part of the application.
- **Rationale:** Boundary contracts localize uncertainty and prevent invalid
  data from spreading through otherwise typed code.
- **Verification:** Review public interfaces and trace each external input to a
  schema or equivalent runtime validation before business logic uses it.
- **Sources:** [OWASP Input Validation Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html), internal repository synthesis.
- **Exceptions:** Trusted compile-time-only inputs may omit runtime validation;
  document why the trust boundary is guaranteed.

## `CORE-ERROR-001` — intentional error handling

- **Level:** MUST
- **Applies to:** all projects
- **Risk levels:** R1, R2, R3
- **Requirement:** Handle failures at the layer that can recover, translate or
  add useful context. Do not silently swallow errors, expose internal failure
  details to untrusted clients or use a successful result to represent failure.
- **Rationale:** Consistent failure semantics make defects diagnosable and keep
  implementation details out of public interfaces.
- **Verification:** Exercise expected failure paths in tests and review empty
  catches, discarded promises and responses whose status contradicts failure.
- **Sources:** [OWASP Error Handling Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Error_Handling_Cheat_Sheet.html), internal repository synthesis.
- **Exceptions:** A deliberately ignored failure must have a narrow comment
  explaining why it is safe and, when relevant, an observable fallback.

## `CORE-LOG-001` — useful and safe telemetry

- **Level:** MUST
- **Applies to:** applications and operational scripts
- **Risk levels:** R1, R2, R3
- **Requirement:** Record failures and material state transitions with enough
  structured context to investigate them. Never log secrets, credentials,
  authentication tokens, complete environment dumps or unnecessary personal
  data.
- **Rationale:** Telemetry must support operations without creating a second
  source of sensitive-data exposure.
- **Verification:** Review logging calls and CI output; scan representative logs
  for prohibited values and confirm errors retain safe diagnostic context.
- **Sources:** [OWASP Logging Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html), lesson extracted from `agami-cloud`.
- **Exceptions:** None for credentials or authentication material. Approved
  sensitive-data logging requires a documented purpose, minimization, access
  control and retention policy.

## `CORE-CONFIG-001` — environment-independent configuration

- **Level:** MUST
- **Applies to:** all deployable projects
- **Risk levels:** R1, R2, R3
- **Requirement:** Keep environment-specific configuration outside source code.
  Commit `.env.example` or equivalent documentation containing names and safe
  placeholders only; fail clearly when required configuration is absent.
- **Rationale:** The same revision should be promotable across environments
  without embedding credentials or deployment-specific values.
- **Verification:** Search tracked files for real environment values, start the
  application with missing required configuration and inspect the resulting
  diagnostic.
- **Sources:** [The Twelve-Factor App — Config](https://12factor.net/config), [OWASP Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html).
- **Exceptions:** Non-sensitive defaults that are genuinely identical in every
  environment may remain in source.

## `CORE-CLARITY-001` — optimize code for comprehension

- **Level:** SHOULD
- **Applies to:** all projects
- **Risk levels:** R1, R2, R3
- **Requirement:** Prefer small cohesive units, intention-revealing names and
  direct control flow. Comments explain constraints and reasons that code
  cannot express; they do not narrate obvious implementation steps.
- **Rationale:** Readability reduces review cost and makes safe modification by
  humans and agents more reliable.
- **Verification:** Review changed code for mixed responsibilities, ambiguous
  names, avoidable nesting and comments that duplicate behavior.
- **Sources:** Internal repository synthesis.
- **Exceptions:** Generated code follows the generator's conventions and is not
  manually restyled.

## `CORE-DEBT-001` — visible and actionable debt

- **Level:** SHOULD
- **Applies to:** all projects
- **Risk levels:** R1, R2, R3
- **Requirement:** Remove dead code instead of commenting it out. Make deferred
  work actionable by linking `TODO` or `FIXME` notes to an issue or by recording
  enough owner and intent to resolve them.
- **Rationale:** Version control preserves removed code; anonymous markers tend
  to become permanent and lose context.
- **Verification:** Search changed files for commented-out implementations and
  unqualified debt markers.
- **Sources:** Internal repository synthesis.
- **Exceptions:** A short-lived marker in an unmerged branch may omit an issue
  link when the same change resolves it.
