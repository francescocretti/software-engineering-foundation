import { defineConfig } from 'eslint/config'
import globals from 'globals'

const defaultNodeFiles = ['**/*.{js,mjs,cjs,ts}']

export function createNodeConfig({
  allowConsole = false,
  files = defaultNodeFiles,
} = {}) {
  return defineConfig({
    name: 'foundation/node',
    files,
    languageOptions: {
      globals: globals.node,
    },
    rules: {
      'no-console': allowConsole ? 'off' : 'error',
    },
  })
}
