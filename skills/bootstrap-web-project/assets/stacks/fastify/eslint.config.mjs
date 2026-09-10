import { defineConfig } from 'eslint/config'

import {
  createJavaScriptConfig,
  foundationIgnores,
} from './.config/eslint/base.mjs'
import { createNodeConfig } from './.config/eslint/node.mjs'
import { createStylisticConfig } from './.config/eslint/stylistic.mjs'
import { createTypeScriptConfig } from './.config/eslint/typescript.mjs'

export default defineConfig(
  foundationIgnores,
  { name: 'project/ignores', ignores: ['.vitest/**'] },
  createJavaScriptConfig(),
  createTypeScriptConfig({ tsconfigRootDir: import.meta.dirname }),
  createNodeConfig(),
  createStylisticConfig(),
)
