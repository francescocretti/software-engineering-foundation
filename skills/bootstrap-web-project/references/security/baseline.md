# Shared security baseline

Apply every applicable requirement in this file. Most apply at R1, R2 and R3;
identity and sensitive-data controls become applicable when those capabilities
exist, which makes the project at least R2. These controls extend the
[core boundary, error and logging requirements](../standards/core.md); their
security-specific constraints are canonical here.

## `SEC-TRUST-001` — explicit trust boundaries

- **Level:** MUST
- **Applies to:** all applications
- **Risk levels:** R1, R2, R3
- **Requirement:** Treat browser state, client validation, headers, cookies,
  tokens, files, webhooks and third-party responses as untrusted until verified
  at the server boundary. Document every external entry and exit point.
- **Rationale:** Trusting transport location or client behavior enables boundary
  bypass and unsafe downstream processing.
- **Verification:** Trace representative data flows from source to privileged
  action and confirm the first trusted component performs validation.
- **Sources:** [OWASP ASVS 5.0.0](https://github.com/OWASP/ASVS/tree/v5.0.0/5.0), [OWASP API10:2023](https://owasp.org/API-Security/editions/2023/en/0xaa-unsafe-consumption-of-apis/).
- **Exceptions:** None.

## `SEC-INPUT-001` — allowlisted and bounded input

- **Level:** MUST
- **Applies to:** all applications
- **Risk levels:** R1, R2, R3
- **Requirement:** Validate structure, type, range, length, format and business
  consistency against an allowlist after canonicalization. Reject unexpected
  fields and bound collections, nesting, payload size and decompression.
- **Rationale:** Typed source code cannot constrain runtime input, and unbounded
  parsing can become an injection or resource-exhaustion path.
- **Verification:** Schema tests cover missing, extra, malformed, oversized and
  contextually invalid input at each entry point.
- **Sources:** [OWASP Input Validation Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html), ASVS 5.0.0 V1 and V2.
- **Exceptions:** Compatibility endpoints may accept documented extra fields only
  when they are ignored safely and cannot influence stored or returned data.

## `SEC-INJECTION-001` — data never becomes executable syntax

- **Level:** MUST
- **Applies to:** applications constructing queries, commands, markup or code
- **Risk levels:** R1, R2, R3
- **Requirement:** Use parameterized database APIs and context-appropriate output
  encoding. Do not concatenate untrusted data into SQL, shell commands,
  templates, HTML, URLs or interpreter input; avoid dynamic evaluation.
- **Rationale:** Separating code from data prevents an attacker from changing the
  meaning of an operation.
- **Verification:** Review every relevant sink and test malicious metacharacters
  through the complete request and rendering path.
- **Sources:** [OWASP Injection Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Injection_Prevention_Cheat_Sheet.html), [OWASP Top 10:2025 A05](https://owasp.org/Top10/2025/A05_2025-Injection/).
- **Exceptions:** A narrowly isolated system-command adapter requires a fixed
  executable and allowlisted arguments without a shell.

## `SEC-AUTHZ-001` — server-side authorization for every resource

- **Level:** MUST
- **Applies to:** applications with non-public operations or data
- **Risk levels:** R1, R2, R3
- **Requirement:** Deny by default and authorize every operation, object and
  mutable or returned property on the trusted server using current identity and
  tenant context. Hidden UI and possession of an identifier never grant access.
- **Rationale:** Object-, property- and function-level authorization failures are
  primary web and API risks.
- **Verification:** Automated tests cover anonymous, wrong-user, wrong-tenant and
  insufficient-role access for reads and writes, including guessed identifiers.
- **Sources:** [OWASP Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html), [OWASP API Security Top 10:2023](https://owasp.org/API-Security/editions/2023/en/0x11-t10/), ASVS 5.0.0 V8.
- **Exceptions:** An explicitly public resource still requires a deliberate
  public policy and protection against unintended fields or operations.

## `SEC-AUTHN-001` — established authentication mechanisms

- **Level:** MUST
- **Applies to:** applications with authentication
- **Risk levels:** R2, R3
- **Requirement:** Use maintained framework or identity-provider mechanisms for
  authentication, credential recovery and MFA. Prevent account enumeration and
  brute force without creating a trivial denial-of-service path.
- **Rationale:** Custom authentication protocols commonly fail in credential
  storage, recovery, rate limiting or side-channel behavior.
- **Verification:** Test valid and invalid login, recovery, enumeration,
  throttling and MFA paths against the documented identity design.
- **Sources:** [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html), ASVS 5.0.0 V6.
- **Exceptions:** None for production authentication. A local-only test identity
  provider must be unreachable in production.

## `SEC-SESSION-001` — bounded and revocable sessions

- **Level:** MUST
- **Applies to:** applications with sessions or bearer tokens
- **Risk levels:** R2, R3
- **Requirement:** Use unpredictable credentials, bounded lifetime, server-side
  revocation where the risk requires it and secure transport and storage. Prefer
  `HttpOnly`, `Secure`, appropriately scoped cookies for browser sessions and
  protect cookie-authenticated state changes against CSRF.
- **Rationale:** A stolen or fixed session grants the victim's authority until it
  expires or is revoked.
- **Verification:** Inspect cookie and token settings; test login rotation,
  logout, expiry, revocation, replay and cross-site state-changing requests.
- **Sources:** [OWASP Session Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html), [OWASP CSRF Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html), ASVS 5.0.0 V7 and V9.
- **Exceptions:** A non-browser client may use a protected bearer token when its
  storage, rotation, audience and revocation model are documented.

## `SEC-SECRETS-001` — managed secret lifecycle

- **Level:** MUST
- **Applies to:** all deployable applications
- **Risk levels:** R1, R2, R3
- **Requirement:** Store secrets outside source and client bundles in an approved
  secret store, grant least privilege, separate environments and define rotation
  and revocation. Apply the no-logging and no-commit rules in the shared standard.
- **Rationale:** Secret exposure provides durable access beyond the vulnerable
  process and often crosses environments.
- **Verification:** Inspect build output, configuration, CI logs and access
  policies; rotate a representative non-production secret through its consumers.
- **Sources:** [OWASP Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html), [NIST SSDF 1.1](https://csrc.nist.gov/pubs/sp/800/218/final).
- **Exceptions:** Public identifiers explicitly designed for untrusted clients
  are configuration, not secrets, and must still have narrowly scoped authority.

## `SEC-CRYPTO-001` — standard cryptography and protected transport

- **Level:** MUST
- **Applies to:** all applications
- **Risk levels:** R1, R2, R3
- **Requirement:** Use maintained platform cryptography and current approved
  protocols; never design custom algorithms. Protect sensitive data in transit,
  authenticate remote endpoints and define key ownership and rotation.
- **Rationale:** Cryptographic correctness depends on algorithms, modes, key
  management and protocol configuration that ad hoc implementations miss.
- **Verification:** Inventory cryptographic uses and transport endpoints; review
  protocol, certificate, randomness, key storage and rotation configuration.
- **Sources:** [OWASP Cryptographic Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html), [OWASP Transport Layer Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html), ASVS 5.0.0 V11 and V12.
- **Exceptions:** Plaintext loopback communication in an isolated local
  development environment may be documented as non-production-only.

## `SEC-DATA-001` — minimize and classify sensitive data

- **Level:** MUST
- **Applies to:** applications handling non-public data
- **Risk levels:** R2, R3
- **Requirement:** Classify data, collect and return only what the operation
  requires, constrain access and define retention and deletion. Prevent sensitive
  fields from appearing in URLs, analytics, caches, logs and broad API responses.
- **Rationale:** Data that is not collected, retained or propagated cannot be
  exposed through another control failure.
- **Verification:** Trace representative sensitive fields through storage,
  responses, telemetry, backups and deletion workflows.
- **Sources:** [OWASP User Privacy Protection Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/User_Privacy_Protection_Cheat_Sheet.html), ASVS 5.0.0 V14.
- **Exceptions:** Retention required by law or contract records the basis,
  duration and access restrictions.

## `SEC-FAILURE-001` — fail securely without leaking internals

- **Level:** MUST
- **Applies to:** all applications
- **Risk levels:** R1, R2, R3
- **Requirement:** Reject ambiguous or partially processed operations, roll back
  failed state changes where atomicity is expected and return stable safe errors.
  Do not expose stack traces, queries, filesystem paths or secret configuration.
- **Rationale:** Exceptional conditions are attacker-controlled inputs and can
  bypass controls or disclose implementation details.
- **Verification:** Inject dependency, timeout, validation and partial-write
  failures and inspect both external responses and internal diagnostics.
- **Sources:** [OWASP Error Handling Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Error_Handling_Cheat_Sheet.html), [OWASP Top 10:2025 A10](https://owasp.org/Top10/2025/A10_2025-Mishandling_of_Exceptional_Conditions/), ASVS 5.0.0 V16.
- **Exceptions:** Detailed diagnostics may be available only in access-controlled
  non-production tooling with sensitive values still redacted.

## `SEC-AUDIT-001` — actionable security events

- **Level:** MUST
- **Applies to:** all deployable applications
- **Risk levels:** R1, R2, R3
- **Requirement:** Log authentication, authorization denial, administrative and
  security-control events with safe actor, action, target, outcome and correlation
  context. Define who monitors them and how actionable conditions are escalated.
- **Rationale:** Logs without ownership or alerting do not support detection or
  investigation.
- **Verification:** Trigger representative events, inspect redaction and
  correlation, and follow one alert through the documented response path.
- **Sources:** [OWASP Logging Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html), [OWASP Top 10:2025 A09](https://owasp.org/Top10/2025/A09_2025-Security_Logging_and_Alerting_Failures/), ASVS 5.0.0 V16.
- **Exceptions:** R1 applications without identity or privileged operations still
  log abuse, configuration and integrity-relevant events that apply.

## `SEC-CONFIG-001` — secure production configuration

- **Level:** MUST
- **Applies to:** all deployable applications
- **Risk levels:** R1, R2, R3
- **Requirement:** Disable debug, test, sample and unnecessary endpoints and
  capabilities in production. Apply least-permissive CORS, security headers,
  network exposure and service permissions from reviewed configuration.
- **Rationale:** Secure code can be defeated by permissive deployment defaults or
  forgotten operational surfaces.
- **Verification:** Compare production-effective configuration with the approved
  baseline and probe for debug routes, unsafe headers and untrusted origins.
- **Sources:** [OWASP Top 10:2025 A02](https://owasp.org/Top10/2025/A02_2025-Security_Misconfiguration/), [OWASP Secure Headers Project](https://owasp.org/www-project-secure-headers/), ASVS 5.0.0 V3 and V13.
- **Exceptions:** A required cross-origin or diagnostic capability documents its
  exact origins, authentication, exposure and monitoring.

## `SEC-RESOURCE-001` — bound cost and resource consumption

- **Level:** MUST
- **Applies to:** APIs, uploads and expensive operations
- **Risk levels:** R1, R2, R3
- **Requirement:** Set timeouts, payload and pagination limits, concurrency or
  rate controls and cost-aware quotas at abuse-sensitive boundaries. Limits use
  identity, tenant and operation context where a global IP limit is insufficient.
- **Rationale:** Unbounded requests can exhaust compute, memory, storage,
  third-party quotas or money without bypassing functional validation.
- **Verification:** Load and abuse tests exercise maximum, repeated and concurrent
  requests and confirm bounded failure without collateral lockout.
- **Sources:** [OWASP API4:2023](https://owasp.org/API-Security/editions/2023/en/0xa4-unrestricted-resource-consumption/), [OWASP API6:2023](https://owasp.org/API-Security/editions/2023/en/0xa6-unrestricted-access-to-sensitive-business-flows/).
- **Exceptions:** Trusted batch processing uses separate authenticated channels
  and explicit resource budgets rather than removing bounds from public paths.

## `SEC-OUTBOUND-001` — constrain outbound requests

- **Level:** MUST
- **Applies to:** applications fetching user-influenced URLs or remote resources
- **Risk levels:** R1, R2, R3
- **Requirement:** Allowlist schemes and destinations where possible, resolve and
  reject private or special network ranges, restrict redirects and outbound
  network access, and apply response size and time limits.
- **Rationale:** Server-side requests can expose internal services, cloud metadata
  and privileged network position.
- **Verification:** Test alternate IP forms, DNS changes, redirects, internal
  addresses, unsupported schemes, oversized responses and timeouts.
- **Sources:** [OWASP SSRF Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html), [OWASP API7:2023](https://owasp.org/API-Security/editions/2023/en/0xa7-server-side-request-forgery/).
- **Exceptions:** A general-purpose proxy is a specialized R3-capable product and
  requires isolation, policy enforcement and independent review.

## `SEC-FILE-001` — isolate and validate file handling

- **Level:** MUST
- **Applies to:** applications accepting or serving files
- **Risk levels:** R1, R2, R3
- **Requirement:** Allowlist required types and extensions, verify content rather
  than trusting metadata, randomize storage names, limit size, store outside
  executable or public paths and serve with safe disposition and content type.
- **Rationale:** Files can carry active content, parser exploits, path traversal
  and storage exhaustion.
- **Verification:** Test mismatched type and extension, traversal names,
  polyglots, oversized files, active content and unauthorized retrieval.
- **Sources:** [OWASP File Upload Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html), ASVS 5.0.0 V5.
- **Exceptions:** Additional malware scanning is risk-based; the baseline storage,
  validation and serving controls have no exception when uploads exist.

## `SEC-INTEGRATION-001` — distrust integrated services

- **Level:** MUST
- **Applies to:** applications consuming external APIs or webhooks
- **Risk levels:** R1, R2, R3
- **Requirement:** Authenticate callbacks, prevent replay where applicable,
  validate third-party responses as untrusted input, set timeouts and response
  limits, and define safe behavior for dependency failure or inconsistency.
- **Rationale:** A trusted brand or authenticated channel does not guarantee safe,
  current or uncompromised data.
- **Verification:** Test invalid signatures, replay, malformed responses,
  redirects, timeouts and partial upstream failure.
- **Sources:** [OWASP API10:2023](https://owasp.org/API-Security/editions/2023/en/0xaa-unsafe-consumption-of-apis/), [OWASP REST Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html).
- **Exceptions:** None for validation and bounded failure. Authentication method
  depends on the integration's supported contract.

## `SEC-SUPPLY-001` — controlled software supply chain

- **Level:** MUST
- **Applies to:** all projects
- **Risk levels:** R1, R2, R3
- **Requirement:** Use the immutable dependency workflow, review new packages and
  lockfile changes, keep supported versions and define triage timeframes for
  disclosed vulnerabilities. Restrict publication and release credentials.
- **Rationale:** Source, build and dependency compromise can bypass application
  controls before deployment.
- **Verification:** Reproduce the build from the lockfile, review dependency
  provenance and vulnerability results, and audit release permissions.
- **Sources:** [OWASP Top 10:2025 A03](https://owasp.org/Top10/2025/A03_2025-Software_Supply_Chain_Failures/), [NIST SSDF 1.1](https://csrc.nist.gov/pubs/sp/800/218/final).
- **Exceptions:** A vulnerability may be temporarily accepted only through the
  standard time-bounded exception process with exposure analysis and mitigation.

## `SEC-API-001` — inventory every reachable API surface

- **Level:** MUST
- **Applies to:** applications exposing APIs
- **Risk levels:** R1, R2, R3
- **Requirement:** Maintain an inventory of routes, versions, hosts and external
  integrations; apply authentication and controls consistently to alternate and
  deprecated versions; remove endpoints when their support period ends.
- **Rationale:** Forgotten versions and undocumented hosts escape normal review
  and retain vulnerable behavior.
- **Verification:** Compare runtime routes and deployed hosts with the inventory;
  probe deprecated and non-production versions for reachability.
- **Sources:** [OWASP API9:2023](https://owasp.org/API-Security/editions/2023/en/0xa9-improper-inventory-management/), ASVS 5.0.0 V4.
- **Exceptions:** Short-lived preview endpoints remain inventoried, isolated from
  production data and protected by explicit access and expiry.

## `SEC-TEST-001` — verify abuse and denial paths

- **Level:** MUST
- **Applies to:** all projects
- **Risk levels:** R1, R2, R3
- **Requirement:** Derive automated security tests from trust boundaries and
  applicable ASVS requirements. Test denied and malformed cases, not only
  successful authenticated behavior, and retain a regression test for each fixed
  security defect where safe and practical.
- **Rationale:** Controls that are never exercised under hostile input provide
  unverified assurance.
- **Verification:** Map test cases to security requirements and sample failures
  to confirm controls fail closed with safe output.
- **Sources:** [OWASP ASVS 5.0.0 — Guide for automated tests](https://github.com/OWASP/ASVS/blob/v5.0.0/5.0/en/0x03-What-is-the-ASVS.md#as-a-guide-for-automated-unit-and-integration-tests), [NIST SSDF 1.1](https://csrc.nist.gov/pubs/sp/800/218/final).
- **Exceptions:** Destructive or production-unsafe cases use isolated manual or
  pre-production verification with recorded evidence.
