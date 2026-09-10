import jsxA11y from 'eslint-plugin-jsx-a11y'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefreshPlugin from 'eslint-plugin-react-refresh'
import { defineConfig } from 'eslint/config'
import globals from 'globals'

const defaultReactFiles = ['**/*.{jsx,tsx}']

export function createReactConfig({
  attributes = {},
  components = {},
  files = defaultReactFiles,
} = {}) {
  return defineConfig({
    name: 'foundation/react',
    files,
    extends: [
      react.configs.flat.recommended,
      react.configs.flat['jsx-runtime'],
      reactHooks.configs.flat['recommended-latest'],
      jsxA11y.flatConfigs.strict,
    ],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.serviceworker,
      },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    settings: {
      'react': { version: 'detect' },
      'jsx-a11y': { attributes, components },
    },
    rules: {
      'react/button-has-type': 'error',
      'react/iframe-missing-sandbox': 'error',
      'react/jsx-no-script-url': 'error',
      'react/no-danger': 'error',
      'react/prop-types': 'off',
    },
  })
}

export function createViteReactRefreshConfig({
  files = defaultReactFiles,
} = {}) {
  return defineConfig({
    ...reactRefreshPlugin.configs.vite,
    name: 'foundation/react-refresh',
    files,
  })
}
