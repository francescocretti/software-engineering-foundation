# React with Vite profile

Use this profile for React single-page applications. Next.js is not covered.

## Structural direction

- Organize product code by feature or domain boundary.
- Keep reusable design-system primitives separate from feature components.
- Keep route composition distinct from reusable components and data access.
- Store only essential state; derive values during render where possible.
- Keep components and hooks pure and use effects only for synchronization with
  external systems.
- Put test files close to the behavior they verify unless a cross-feature test
  belongs in a dedicated integration or end-to-end suite.

## Mandatory companion profiles

- Shared TypeScript foundation
- Accessibility profile with WCAG 2.2 AA
- React ESLint rules, hooks rules and JSX accessibility rules
- Component testing and browser-level critical-flow testing

The production asset will scaffold the application with Vite and compose the
local ESLint presets. Exact dependencies belong to the versioned asset rather
than this reference.
