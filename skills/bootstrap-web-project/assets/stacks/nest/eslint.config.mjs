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
  {
    name: 'project/nest',
    files: ['src/**/*.ts', 'test/**/*.ts'],
    rules: {
      // Nest modules are decorated classes without members by design.
      '@typescript-eslint/no-extraneous-class': ['error', { allowWithDecorator: true }],
    },
  },
  createStylisticConfig(),
)
