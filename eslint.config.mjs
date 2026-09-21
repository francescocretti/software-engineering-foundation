import { defineConfig } from 'eslint/config'

import {
  createJavaScriptConfig,
  defaultLiteralExemptFiles,
  foundationIgnores,
} from './skills/bootstrap-web-project/assets/tooling/eslint/base.mjs'
import { createNodeConfig } from './skills/bootstrap-web-project/assets/tooling/eslint/node.mjs'
import { createStylisticConfig } from './skills/bootstrap-web-project/assets/tooling/eslint/stylistic.mjs'

export default defineConfig(
  foundationIgnores,
  {
    name: 'foundation-repository/fixtures',
    ignores: [
      'tests/fixtures/**',
      'tests/.generated/**',
      // Stack templates are verified through the generated project tests.
      'skills/bootstrap-web-project/assets/stacks/**',
    ],
  },
  createJavaScriptConfig({
    // The shared ESLint modules are tool configuration; in a generated
    // project they live under `.config/` and are exempt there.
    literalExemptFiles: [
      ...defaultLiteralExemptFiles,
      'skills/bootstrap-web-project/assets/tooling/eslint/*.mjs',
    ],
  }),
  createNodeConfig(),
  createStylisticConfig(),
)
