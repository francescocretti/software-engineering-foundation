import axe, { type AxeResults, type Result, type RunOptions } from 'axe-core'
import { expect } from 'vitest'

// Component fragments are not complete pages. Landmark containment and color
// contrast are verified by the browser-level scans in `e2e/` and by manual
// review; every other axe-core rule runs here against the rendered state.
const componentScanOptions: RunOptions = {
  resultTypes: ['violations', 'incomplete'],
  rules: {
    'color-contrast': { enabled: false },
    'region': { enabled: false },
  },
}

export function describeResults(results: Result[]): string {
  return results
    .map((result) => {
      const targets = result.nodes.map((node) => node.target.join(' ')).join(', ')
      return `${result.id} (${result.impact ?? 'unknown'}): ${result.help} -> ${targets}`
    })
    .join('\n')
}

export async function scanAccessibility(context: Element): Promise<AxeResults> {
  return axe.run(context, componentScanOptions)
}

/**
 * Fails the test on any axe-core violation and returns the `incomplete`
 * results, which the caller must resolve manually or record for manual
 * verification instead of ignoring.
 */
export async function expectNoAccessibilityViolations(context: Element): Promise<Result[]> {
  const results = await scanAccessibility(context)

  expect(describeResults(results.violations), 'axe-core violations').toBe('')

  return results.incomplete
}
