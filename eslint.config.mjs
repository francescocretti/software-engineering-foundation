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
    ignores: ['tests/fixtures/**'],
  },
  createJavaScriptConfig(),
  createNodeConfig(),
  createStylisticConfig(),
)
