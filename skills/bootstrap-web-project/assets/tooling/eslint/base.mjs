import eslint from '@eslint/js'
import importPlugin from 'eslint-plugin-import'
import { defineConfig } from 'eslint/config'

const defaultJavaScriptFiles = ['**/*.{js,mjs,cjs}']

// Numeric literals stay readable in files that are themselves declarations of
// values (tool configuration) or the specification of a behavior (tests).
export const defaultLiteralExemptFiles = [
  '**/*.{test,spec}.{js,mjs,cjs}',
  '**/test/**/*.{js,mjs,cjs}',
  '**/e2e/**/*.{js,mjs,cjs}',
  '**/*.config.{js,mjs,cjs}',
  '**/.config/**/*.{js,mjs,cjs}',
]

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

// `func-style` and `prefer-arrow-callback` cover declarations and callbacks;
// the selector closes the remaining gap, a function expression bound to a
// variable. Generators are excluded because they have no arrow form. A project
// that sets its own `no-restricted-syntax` replaces this entry rather than
// adding to it, so it must repeat the selector.
export const arrowFunctionRules = {
  'func-style': ['error', 'expression'],
  'prefer-arrow-callback': [
    'error',
    { allowNamedFunctions: false, allowUnboundThis: true },
  ],
  'no-restricted-syntax': [
    'error',
    {
      selector: 'VariableDeclarator[init.type="FunctionExpression"][init.generator=false]',
      message:
        'Use an arrow function. `function` is reserved for generators and for code that needs its own `this`, `arguments`, `new.target` or hoisting.',
    },
  ],
}

// -1, 0 and 1 carry no domain meaning to extract, and an array index is already
// named by the collection it indexes.
export const magicNumberOptions = {
  detectObjects: true,
  enforceConst: true,
  ignore: [-1, 0, 1],
  ignoreArrayIndexes: true,
}

export const createJavaScriptConfig = ({
  files = defaultJavaScriptFiles,
  literalExemptFiles = defaultLiteralExemptFiles,
} = {}) => defineConfig([
  {
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
      ...arrowFunctionRules,
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
      'no-magic-numbers': ['error', magicNumberOptions],
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
  },
  {
    name: 'foundation/javascript-literals',
    files: literalExemptFiles,
    rules: {
      'no-magic-numbers': 'off',
    },
  },
])
