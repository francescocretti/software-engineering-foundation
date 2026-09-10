import eslint from '@eslint/js'
import importPlugin from 'eslint-plugin-import'
import { defineConfig } from 'eslint/config'

const defaultJavaScriptFiles = ['**/*.{js,mjs,cjs}']

export const foundationIgnores = {
  name: 'foundation/ignores',
  ignores: [
    '**/.yarn/**',
    '**/coverage/**',
    '**/dist/**',
    '**/node_modules/**',
    '**/generated/**',
  ],
}

export function createJavaScriptConfig({
  files = defaultJavaScriptFiles,
} = {}) {
  return defineConfig({
    name: 'foundation/javascript',
    files,
    extends: [
      eslint.configs.recommended,
      importPlugin.flatConfigs.recommended,
    ],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    linterOptions: {
      reportUnusedDisableDirectives: 'error',
      reportUnusedInlineConfigs: 'error',
    },
    settings: {
      'import/resolver': {
        node: true,
        typescript: true,
      },
    },
    rules: {
      'array-callback-return': ['error', { checkForEach: true }],
      'curly': ['error', 'all'],
      'eqeqeq': ['error', 'always'],
      'import/first': 'error',
      'import/newline-after-import': 'error',
      'import/no-cycle': ['error', { ignoreExternal: true }],
      'import/no-duplicates': 'error',
      'import/no-self-import': 'error',
      'no-alert': 'error',
      'no-console': 'error',
      'no-debugger': 'error',
      'no-eval': 'error',
      'no-extend-native': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error',
      'no-promise-executor-return': 'error',
      'no-script-url': 'error',
      'no-template-curly-in-string': 'error',
      'no-unreachable-loop': 'error',
      'no-unused-private-class-members': 'error',
      'no-useless-assignment': 'error',
      'object-shorthand': ['error', 'always'],
      'prefer-const': ['error', { destructuring: 'all' }],
      'prefer-promise-reject-errors': 'error',
      'require-atomic-updates': 'error',
    },
  })
}
