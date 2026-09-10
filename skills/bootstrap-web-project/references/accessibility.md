# Accessibility standard

This profile is mandatory for every generated frontend. The conformance target
is WCAG 2.2 Level AA across every user-visible page, state and supported viewport.
Risk classification never lowers this target. Passing automated checks alone is
not a conformance claim.

Apply the implementation rules below and the mandatory
[accessibility verification standard](accessibility/testing.md). Use the
[WCAG 2.2 AA coverage map](accessibility/wcag-22-aa-map.md) during review or a
formal audit to trace every Level A and AA success criterion.

## `A11Y-SEMANTICS-001` — native semantics first

- **Level:** MUST
- **Applies to:** every frontend
- **Risk levels:** R1, R2, R3
- **Requirement:** Use native HTML elements for their intended purpose and
  preserve a meaningful DOM and reading order. Add ARIA only when native HTML
  cannot express the required pattern; then implement the complete role, state,
  property and keyboard contract from the applicable ARIA APG pattern. Do not
  rely only on shape, position, orientation, sound or other sensory cues.
- **Rationale:** Native controls carry browser behavior and accessibility
  semantics that ARIA alone does not implement.
- **Verification:** Inspect rendered HTML and the accessibility tree; operate
  custom widgets with the APG keyboard contract and verify their exposed state.
- **Sources:** [WCAG 2.2 — 1.3.1, 1.3.2 and 4.1.2](https://www.w3.org/TR/WCAG22/), [ARIA APG — Read Me First](https://www.w3.org/WAI/ARIA/apg/practices/read-me-first/).
- **Exceptions:** Document why no suitable native element exists and test the
  entire custom interaction contract.

## `A11Y-NAME-001` — every control has an accurate name

- **Level:** MUST
- **Applies to:** every frontend
- **Risk levels:** R1, R2, R3
- **Requirement:** Give every interactive element an accessible name that
  describes its action or destination. Prefer visible text or a native label;
  when visible text labels a control, the accessible name contains that text.
- **Rationale:** Assistive-technology and speech-input users identify and invoke
  controls through their accessible names.
- **Verification:** Query the rendered element by role and accessible name;
  inspect icon-only controls, links and composite widgets in the accessibility
  tree.
- **Sources:** [WCAG 2.2 — 2.4.4, 2.5.3 and 4.1.2](https://www.w3.org/TR/WCAG22/), [ARIA APG — Names and Descriptions](https://www.w3.org/WAI/ARIA/apg/practices/names-and-descriptions/).
- **Exceptions:** None. Decorative content is hidden rather than given a
  misleading name.

## `A11Y-MEDIA-001` — equivalent alternatives for non-text media

- **Level:** MUST
- **Applies to:** frontends containing images, audio or video
- **Risk levels:** R1, R2, R3
- **Requirement:** Provide a purpose-appropriate text alternative for meaningful
  images and a null alternative for decorative images. Supply captions,
  transcripts and audio description for prerecorded or live media as required
  by WCAG 2.2 Level A and AA.
- **Rationale:** Information cannot depend on a sensory format a user may not be
  able to perceive.
- **Verification:** Review each media asset in context; test alternatives without
  loading the asset and inspect caption and description tracks.
- **Sources:** [WCAG 2.2 — 1.1.1 and 1.2.1–1.2.5](https://www.w3.org/TR/WCAG22/).
- **Exceptions:** Apply only the exceptions explicitly defined by the cited WCAG
  criteria, such as decorative or CAPTCHA content, with equivalent access.

## `A11Y-STRUCTURE-001` — navigable page structure

- **Level:** MUST
- **Applies to:** every frontend
- **Risk levels:** R1, R2, R3
- **Requirement:** Use descriptive page titles, a logical heading hierarchy,
  landmarks, lists and tables that reflect content relationships. Provide a way
  to bypass repeated blocks and more than one way to locate pages in a set.
- **Rationale:** Structure lets keyboard and assistive-technology users orient,
  scan and navigate without traversing every element.
- **Verification:** Inspect the heading and landmark outline; use bypass links
  and navigate representative pages without visual position cues.
- **Sources:** [WCAG 2.2 — 1.3.1, 2.4.1, 2.4.2, 2.4.5 and 2.4.6](https://www.w3.org/TR/WCAG22/), [ARIA APG — Landmark Regions](https://www.w3.org/WAI/ARIA/apg/practices/landmark-regions/).
- **Exceptions:** Single-step or process-only page sets may use the WCAG 2.4.5
  exception; the other requirements remain.

## `A11Y-KEYBOARD-001` — complete keyboard operation

- **Level:** MUST
- **Applies to:** every frontend
- **Risk levels:** R1, R2, R3
- **Requirement:** Make all functionality operable with a keyboard, without traps
  or timing-dependent keystrokes. Do not add single-character shortcuts unless
  users can disable, remap or limit them to focused components.
- **Rationale:** Keyboard access supports people who cannot use precise pointer
  input and is foundational to many assistive technologies.
- **Verification:** Complete every changed interaction using only Tab, Shift+Tab,
  Enter, Space, Escape and pattern-specific keys; confirm focus can always leave.
- **Sources:** [WCAG 2.2 — 2.1.1, 2.1.2 and 2.1.4](https://www.w3.org/TR/WCAG22/), [ARIA APG — Keyboard Interface](https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/).
- **Exceptions:** Only functionality whose path fundamentally depends on user
  movement may use the WCAG 2.1.1 exception; provide an equivalent outcome when
  possible.

## `A11Y-FOCUS-001` — visible and predictable focus

- **Level:** MUST
- **Applies to:** every frontend
- **Risk levels:** R1, R2, R3
- **Requirement:** Preserve a logical focus order, an obvious visible indicator
  and at least partial visibility of the focused element. Move focus deliberately
  when opening or closing dialogs and after route or destructive state changes;
  restore it to a meaningful origin when appropriate.
- **Rationale:** Keyboard users need to know where interaction will occur and to
  follow changes introduced by client-side applications.
- **Verification:** Traverse forward and backward with the keyboard at all
  supported viewports, including with sticky content and overlays present.
- **Sources:** [WCAG 2.2 — 2.4.3, 2.4.7 and 2.4.11](https://www.w3.org/TR/WCAG22/), [ARIA APG — Keyboard Interface](https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/).
- **Exceptions:** Programmatic focus movement requires a documented user-flow
  reason; removing or globally suppressing visible focus has no exception.

## `A11Y-POINTER-001` — alternatives to precise pointer gestures

- **Level:** MUST
- **Applies to:** frontends with pointer interaction
- **Risk levels:** R1, R2, R3
- **Requirement:** Provide simple alternatives to multipoint, path-based,
  dragging and device-motion interactions. Avoid triggering actions on pointer
  down, support cancellation, and make targets at least 24 by 24 CSS pixels or
  satisfy the WCAG spacing or equivalent-control exceptions.
- **Rationale:** Fine motor control, touch accuracy and motion capability vary
  widely among users and devices.
- **Verification:** Complete gestures with a single pointer without dragging;
  measure small adjacent targets and test cancellation before pointer release.
- **Sources:** [WCAG 2.2 — 2.5.1, 2.5.2, 2.5.4, 2.5.7 and 2.5.8](https://www.w3.org/TR/WCAG22/).
- **Exceptions:** Use only essential, user-agent or equivalent-control exceptions
  expressly defined by the cited criteria and record which one applies.

## `A11Y-VISUAL-001` — information survives color and contrast differences

- **Level:** MUST
- **Applies to:** every frontend
- **Risk levels:** R1, R2, R3
- **Requirement:** Do not convey information by color alone. Meet WCAG 2.2 AA
  contrast for text and meaningful non-text graphics or states, and use images
  of text only where the presentation is essential or user-customizable.
- **Rationale:** Users with low vision or color-vision differences must perceive
  the same information and control boundaries.
- **Verification:** Measure contrast in every interactive state and theme;
  inspect the interface in grayscale and forced-colors or equivalent mode.
- **Sources:** [WCAG 2.2 — 1.4.1, 1.4.3, 1.4.5 and 1.4.11](https://www.w3.org/TR/WCAG22/).
- **Exceptions:** Apply only the explicit WCAG exceptions for incidental,
  inactive, logo or essential presentation content.

## `A11Y-REFLOW-001` — content adapts without loss

- **Level:** MUST
- **Applies to:** every frontend
- **Risk levels:** R1, R2, R3
- **Requirement:** Support text resize to 200%, reflow at the WCAG 320 CSS-pixel
  equivalent, portrait and landscape orientation, and user text-spacing
  overrides without lost content, function or two-dimensional scrolling except
  where that layout is essential.
- **Rationale:** Responsive structure is necessary for users who magnify text or
  operate small viewports.
- **Verification:** Test 200% text resize, 400% browser zoom at a 1280 CSS-pixel
  viewport, both orientations and the WCAG text-spacing values.
- **Sources:** [WCAG 2.2 — 1.3.4, 1.4.4, 1.4.10 and 1.4.12](https://www.w3.org/TR/WCAG22/).
- **Exceptions:** Two-dimensional layouts such as data tables or maps may use the
  essential-layout exception while surrounding controls and instructions reflow.

## `A11Y-DISCLOSURE-001` — dismissible hover and focus content

- **Level:** MUST
- **Applies to:** frontends with tooltips, popovers or transient content
- **Risk levels:** R1, R2, R3
- **Requirement:** Additional content shown on hover or focus is dismissible
  without moving focus, remains hoverable when the pointer moves onto it and
  persists until dismissed, invalidated or no longer hovered or focused.
- **Rationale:** Magnification and pointer users need time and space to perceive
  supplemental content without it obscuring the page.
- **Verification:** Trigger each disclosure by keyboard and pointer, press Escape
  where appropriate and move the pointer between trigger and content.
- **Sources:** [WCAG 2.2 — 1.4.13](https://www.w3.org/TR/WCAG22/#content-on-hover-or-focus).
- **Exceptions:** Apply only the input-error, non-obscuring or user-agent
  exceptions in WCAG 1.4.13.

## `A11Y-MOTION-001` — controlled motion, audio and flashing

- **Level:** MUST
- **Applies to:** frontends containing motion, animation, autoplay or audio
- **Risk levels:** R1, R2, R3
- **Requirement:** Provide controls for time-based moving, blinking, scrolling or
  auto-updating content; prevent unsafe flashing; allow independent control of
  automatically played audio; and honor `prefers-reduced-motion` for
  non-essential animation.
- **Rationale:** Motion, flashing and unexpected audio can block comprehension or
  cause physical harm.
- **Verification:** Inspect animation and media defaults, enable reduced motion,
  exercise pause or stop controls and use flash analysis when content approaches
  the threshold.
- **Sources:** [WCAG 2.2 — 1.4.2, 2.2.2 and 2.3.1](https://www.w3.org/TR/WCAG22/), [WCAG technique C39](https://www.w3.org/WAI/WCAG22/Techniques/css/C39.html).
- **Exceptions:** Essential motion and timing use only the applicable WCAG
  exception and require an equivalent accessible path where possible.

## `A11Y-TIME-001` — users control time limits

- **Level:** MUST
- **Applies to:** frontends with session or task time limits
- **Risk levels:** R1, R2, R3
- **Requirement:** Let users turn off, adjust or extend time limits before expiry,
  and warn them with enough time to act. Preserve entered work after
  re-authentication whenever security permits.
- **Rationale:** Reading, cognition, movement and assistive-technology operation
  may require more time.
- **Verification:** Exercise warning, extension, expiry and re-authentication
  paths with controlled time.
- **Sources:** [WCAG 2.2 — 2.2.1](https://www.w3.org/TR/WCAG22/#timing-adjustable).
- **Exceptions:** Real-time, essential or longer-than-20-hour limits may use the
  explicit WCAG exceptions; security timeouts still need an accessible warning.

## `A11Y-LANGUAGE-001` — programmatic language metadata

- **Level:** MUST
- **Applies to:** every frontend
- **Risk levels:** R1, R2, R3
- **Requirement:** Declare the page's primary language and mark passages or terms
  whose natural language differs, except proper names and accepted technical
  vocabulary.
- **Rationale:** Screen readers and other language-aware tools need this metadata
  for pronunciation and processing.
- **Verification:** Inspect the document `lang` value and multilingual rendered
  content, including user-selectable locale changes.
- **Sources:** [WCAG 2.2 — 3.1.1 and 3.1.2](https://www.w3.org/TR/WCAG22/).
- **Exceptions:** Use only the language-of-parts exceptions defined by WCAG 3.1.2.

## `A11Y-PREDICTABLE-001` — changes do not surprise users

- **Level:** MUST
- **Applies to:** every frontend
- **Risk levels:** R1, R2, R3
- **Requirement:** Focus or ordinary input does not unexpectedly navigate,
  submit or make a major context change. Repeated navigation, controls and help
  appear and behave consistently across the application.
- **Rationale:** Predictability is critical for keyboard, screen-reader and
  cognitive-accessibility users.
- **Verification:** Exercise focus and input events without pointer use; compare
  repeated controls and help mechanisms across representative routes.
- **Sources:** [WCAG 2.2 — 3.2.1–3.2.4 and 3.2.6](https://www.w3.org/TR/WCAG22/).
- **Exceptions:** A user-initiated control may clearly announce an impending
  context change before activation.

## `A11Y-FORM-001` — understandable forms and errors

- **Level:** MUST
- **Applies to:** frontends containing user input
- **Risk levels:** R1, R2, R3
- **Requirement:** Give controls persistent programmatic labels and necessary
  instructions. Identify errors in text, associate messages with fields, suggest
  corrections when known, and allow review, confirmation or reversal of legal,
  financial or destructive submissions.
- **Rationale:** Users must understand requested input, locate failures and
  recover without relying on color, position or memory.
- **Verification:** Submit empty and invalid values; confirm errors are announced,
  linked to fields, summarized when useful and focus moves deliberately.
- **Sources:** [WCAG 2.2 — 3.3.1–3.3.4](https://www.w3.org/TR/WCAG22/).
- **Exceptions:** Error suggestions may be omitted when they would compromise
  security or purpose; applicable error-prevention exceptions follow WCAG 3.3.4.

## `A11Y-INPUT-001` — identify purpose and avoid repeated entry

- **Level:** MUST
- **Applies to:** frontends collecting user information
- **Risk levels:** R1, R2, R3
- **Requirement:** Programmatically identify standard personal-data input
  purposes using appropriate autocomplete tokens. Reuse or offer previously
  entered information within the same process instead of requiring re-entry.
- **Rationale:** Autofill and reduced repetition help users with cognitive,
  motor and memory limitations.
- **Verification:** Inspect rendered autocomplete attributes and complete a
  multi-step flow containing repeated information.
- **Sources:** [WCAG 2.2 — 1.3.5 and 3.3.7](https://www.w3.org/TR/WCAG22/), [HTML autocomplete](https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#autofill).
- **Exceptions:** Re-entry is allowed when essential, required for security or
  the previous value is no longer valid, as defined by WCAG 3.3.7.

## `A11Y-AUTH-001` — accessible authentication

- **Level:** MUST
- **Applies to:** frontends with authentication
- **Risk levels:** R1, R2, R3
- **Requirement:** Do not require memory, transcription or puzzle solving as the
  only authentication path. Permit password managers and paste, expose correct
  autocomplete semantics and provide an accessible alternative when a cognitive
  function test is otherwise required.
- **Rationale:** Authentication must not exclude users with cognitive or motor
  disabilities.
- **Verification:** Complete sign-in and recovery using a password manager and
  paste; inspect every CAPTCHA, one-time-code and challenge path.
- **Sources:** [WCAG 2.2 — 3.3.8](https://www.w3.org/TR/WCAG22/#accessible-authentication-minimum), [WAI guidance on accessible authentication](https://www.w3.org/WAI/WCAG22/Understanding/accessible-authentication-minimum.html).
- **Exceptions:** Object recognition or identifying user-provided non-text
  content uses only the exceptions stated in WCAG 3.3.8.

## `A11Y-STATUS-001` — announce dynamic status without stealing focus

- **Level:** MUST
- **Applies to:** client-rendered or dynamically updating frontends
- **Risk levels:** R1, R2, R3
- **Requirement:** Expose loading, success, error, result-count and progress
  changes programmatically so assistive technology announces them without
  moving focus unnecessarily. Choose live-region urgency deliberately.
- **Rationale:** Visual updates are otherwise silent to non-visual users, while
  indiscriminate focus movement interrupts ongoing work.
- **Verification:** Trigger asynchronous states with a screen reader or
  accessibility-tree event inspector and confirm one timely, meaningful update.
- **Sources:** [WCAG 2.2 — 4.1.3](https://www.w3.org/TR/WCAG22/#status-messages), [ARIA live regions](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Guides/Live_regions).
- **Exceptions:** A change that requires immediate user action may move focus to
  a correctly implemented alert dialog instead of remaining a status message.

## `A11Y-SPA-001` — client-side navigation preserves orientation

- **Level:** MUST
- **Applies to:** single-page applications
- **Risk levels:** R1, R2, R3
- **Requirement:** On client-side navigation, update the document title and make
  the new view and its primary heading discoverable. Move focus only when it
  reflects the user's navigation intent; do not reset focus during background
  updates.
- **Rationale:** A URL change without page-load signals can leave screen-reader
  and keyboard users unaware that navigation completed.
- **Verification:** Navigate routes with keyboard and screen reader; confirm the
  title, history behavior, announcement and post-navigation focus.
- **Sources:** [WCAG 2.2 — 2.4.2, 2.4.3 and 4.1.3](https://www.w3.org/TR/WCAG22/), React SPA experience from `bailu-admin` and `fta-admin`.
- **Exceptions:** None for title and orientation; the exact focus strategy may
  vary with the interaction and must be tested.

## `A11Y-DESIGN-SYSTEM-001` — accessible primitives by default

- **Level:** MUST
- **Applies to:** frontends with reusable components
- **Risk levels:** R1, R2, R3
- **Requirement:** Encode semantics, focus behavior, target size, contrast states
  and reduced motion in shared UI primitives. Do not make an inaccessible state
  the easiest or default component API.
- **Rationale:** Fixing primitives prevents repeated defects and makes product
  code accessible without relying on every caller to reconstruct the contract.
- **Verification:** Test each primitive's states in isolation and audit escape
  hatches or polymorphic APIs that can remove semantics.
- **Sources:** [ARIA APG patterns](https://www.w3.org/WAI/ARIA/apg/patterns/), internal design-system experience.
- **Exceptions:** A low-level unstyled primitive may expose responsibility to its
  caller only when the API and tests make that responsibility explicit.
