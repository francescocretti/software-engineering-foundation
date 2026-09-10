import { defineConfig } from 'eslint/config'

import {
  createJavaScriptConfig,
  foundationIgnores,
} from '{{CONFIG_ROOT}}/eslint/base.mjs'
import { createNodeConfig } from '{{CONFIG_ROOT}}/eslint/node.mjs'
import {
  createReactConfig,
  createViteReactRefreshConfig,
} from '{{CONFIG_ROOT}}/eslint/react.mjs'
import { createStylisticConfig } from '{{CONFIG_ROOT}}/eslint/stylistic.mjs'
import { createTypeScriptConfig } from '{{CONFIG_ROOT}}/eslint/typescript.mjs'

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
