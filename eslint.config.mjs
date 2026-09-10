import { defineConfig } from 'eslint/config'

import {
  createJavaScriptConfig,
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
  createJavaScriptConfig(),
  createNodeConfig(),
  createStylisticConfig(),
)
