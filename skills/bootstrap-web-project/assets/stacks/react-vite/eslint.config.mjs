import { defineConfig } from 'eslint/config'

import {
  createJavaScriptConfig,
  foundationIgnores,
} from './.config/eslint/base.mjs'
import { createNodeConfig } from './.config/eslint/node.mjs'
import {
  createReactConfig,
  createViteReactRefreshConfig,
} from './.config/eslint/react.mjs'
import { createStylisticConfig } from './.config/eslint/stylistic.mjs'
import { createTypeScriptConfig } from './.config/eslint/typescript.mjs'

export default defineConfig(
  foundationIgnores,
  {
    name: 'project/ignores',
    ignores: ['.vitest/**', 'playwright-report/**', 'test-results/**'],
  },
  createJavaScriptConfig(),
  createTypeScriptConfig({ tsconfigRootDir: import.meta.dirname }),
  createNodeConfig({
    files: ['*.config.{mjs,ts}', '.config/**/*.mjs', 'e2e/**/*.ts'],
  }),
  // Map design-system wrappers to their rendered semantics here so jsx-a11y
  // understands abstractions, for example components: { Button: 'button' }.
  createReactConfig({ attributes: {}, components: {} }),
  createViteReactRefreshConfig(),
  createStylisticConfig(),
)
