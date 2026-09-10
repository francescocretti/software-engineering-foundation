import eslint from '@eslint/js'
import importPlugin from 'eslint-plugin-import'
import { defineConfig } from 'eslint/config'
import tseslint from 'typescript-eslint'

const defaultTypeScriptFiles = ['**/*.{ts,tsx}']

export function createTypeScriptConfig({
  files = defaultTypeScriptFiles,
  tsconfigRootDir,
} = {}) {
  if (!tsconfigRootDir) {
    throw new Error('createTypeScriptConfig requires tsconfigRootDir')
  }

  return defineConfig({
    name: 'foundation/typescript',
    files,
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.strictTypeChecked,
      ...tseslint.configs.stylisticTypeChecked,
      importPlugin.flatConfigs.recommended,
      importPlugin.flatConfigs.typescript,
    ],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir,
      },
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
      'import/first': 'error',
      'import/newline-after-import': 'error',
      'import/no-cycle': ['error', { ignoreExternal: true }],
      'import/no-duplicates': 'error',
      'import/no-self-import': 'error',
      'no-unused-vars': 'off',
      '@typescript-eslint/consistent-type-exports': 'error',
      '@typescript-eslint/consistent-type-definitions': 'off',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { fixStyle: 'inline-type-imports', prefer: 'type-imports' },
      ],
      '@typescript-eslint/explicit-module-boundary-types': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-import-type-side-effects': 'error',
      '@typescript-eslint/no-unnecessary-condition': 'error',
      '@typescript-eslint/no-unnecessary-type-arguments': 'error',
      '@typescript-eslint/no-unnecessary-type-assertion': 'error',
      '@typescript-eslint/return-await': ['error', 'in-try-catch'],
      '@typescript-eslint/switch-exhaustiveness-check': 'error',
      '@typescript-eslint/ban-ts-comment': [
        'error',
        {
          'minimumDescriptionLength': 10,
          'ts-check': false,
          'ts-expect-error': 'allow-with-description',
          'ts-ignore': true,
          'ts-nocheck': true,
        },
      ],
    },
  })
}
