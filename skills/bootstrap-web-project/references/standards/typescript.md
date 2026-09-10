# TypeScript standard

## `TS-STRICT-001` — strict compiler baseline

- **Level:** MUST
- **Applies to:** all TypeScript projects
- **Risk levels:** R1, R2, R3
- **Requirement:** Enable TypeScript `strict` checking. Generated presets also
  enable stricter options that match the selected runtime and framework when
  they do not conflict with generated or third-party declarations.
- **Rationale:** Strict checking finds boundary and nullability errors before
  execution and establishes a consistent baseline across projects.
- **Verification:** Inspect the effective `tsconfig` and run `yarn typecheck`
  without emitting files.
- **Sources:** [TypeScript `strict` option](https://www.typescriptlang.org/tsconfig/strict.html), `BlackBytes/eslint-config`.
- **Exceptions:** A temporarily disabled stricter sub-option requires a tracked
  migration plan; disabling `strict` itself is not permitted.

## `TS-ESCAPE-001` — contain unsafe type escapes

- **Level:** MUST
- **Applies to:** all TypeScript projects
- **Risk levels:** R1, R2, R3
- **Requirement:** Do not introduce explicit `any`, unchecked double assertions
  or non-null assertions as a shortcut. Narrow `unknown`, validate external data
  and isolate unavoidable unsafe interop behind a typed adapter.
- **Rationale:** Type escapes erase the guarantees for which TypeScript was
  selected and allow uncertainty to propagate.
- **Verification:** ESLint rejects explicit `any` and unsafe operations; review
  assertions and suppression comments at boundaries.
- **Sources:** [TypeScript `unknown`](https://www.typescriptlang.org/docs/handbook/2/functions.html#unknown), `BlackBytes/eslint-config`.
- **Exceptions:** An incompatible third-party boundary may use the narrowest
  escape possible with a reason and a typed outward-facing contract.

## `TS-INFERENCE-001` — infer locally, annotate contracts

- **Level:** SHOULD
- **Applies to:** all TypeScript projects
- **Risk levels:** R1, R2, R3
- **Requirement:** Let TypeScript infer obvious local types. Add explicit types
  to exported contracts, reusable callbacks where inference is unclear and
  values whose intended domain is narrower than their initializer suggests.
- **Rationale:** Selective annotation preserves readable code while preventing
  accidental public-contract changes.
- **Verification:** Review exported APIs for stable types and local code for
  redundant annotations that obscure intent.
- **Sources:** [TypeScript type inference](https://www.typescriptlang.org/docs/handbook/type-inference.html), internal repository synthesis.
- **Exceptions:** Framework conventions or generated declarations may determine
  the appropriate annotation style.

## `TS-MODEL-001` — model valid domain states

- **Level:** SHOULD
- **Applies to:** all TypeScript projects
- **Risk levels:** R1, R2, R3
- **Requirement:** Use discriminated unions, constrained value types and
  exhaustive handling when values have a finite set of meaningful states. Do
  not represent mutually dependent states as unrelated booleans or optionals.
- **Rationale:** Making invalid states difficult to express shifts correctness
  from convention into the type system.
- **Verification:** Review stateful models and ensure switches over closed unions
  fail typechecking when a case is added but not handled.
- **Sources:** [TypeScript discriminated unions](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions), internal repository synthesis.
- **Exceptions:** Loose pass-through data must remain isolated from the domain
  model and validated before domain use.

## `TS-SUPPRESS-001` — accountable compiler suppressions

- **Level:** MUST
- **Applies to:** all TypeScript projects
- **Risk levels:** R1, R2, R3
- **Requirement:** Prefer `@ts-expect-error` over `@ts-ignore` when a temporary
  suppression is unavoidable. Include a reason and keep the suppression on the
  smallest affected expression or line.
- **Rationale:** `@ts-expect-error` reports when the underlying error disappears,
  preventing obsolete suppressions from hiding future defects.
- **Verification:** ESLint rejects undocumented suppression directives and
  broad file-level bypasses; typecheck confirms expectations still apply.
- **Sources:** [TypeScript 3.9 release notes](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-9.html#ts-expect-error-comments), `BlackBytes/eslint-config`.
- **Exceptions:** Generated code may contain generator-owned directives and must
  not be edited manually.
