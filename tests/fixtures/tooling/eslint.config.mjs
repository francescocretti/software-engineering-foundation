import { defineConfig } from 'eslint/config'

import {
  createJavaScriptConfig,
  foundationIgnores,
} from '../../../skills/bootstrap-web-project/assets/tooling/eslint/base.mjs'
import { createNodeConfig } from '../../../skills/bootstrap-web-project/assets/tooling/eslint/node.mjs'
import {
  createReactConfig,
  createViteReactRefreshConfig,
} from '../../../skills/bootstrap-web-project/assets/tooling/eslint/react.mjs'
import { createStylisticConfig } from '../../../skills/bootstrap-web-project/assets/tooling/eslint/stylistic.mjs'
import { createTypeScriptConfig } from '../../../skills/bootstrap-web-project/assets/tooling/eslint/typescript.mjs'

export default defineConfig(
  foundationIgnores,
  createJavaScriptConfig(),
  createTypeScriptConfig({ tsconfigRootDir: import.meta.dirname }),
  createNodeConfig({ files: ['*.config.mjs'] }),
  createReactConfig(),
  createViteReactRefreshConfig(),
  createStylisticConfig(),
)
