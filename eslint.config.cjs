const tsParser = require('@typescript-eslint/parser')
const tsPlugin = require('@typescript-eslint/eslint-plugin')

module.exports = [
  {
    files: ['**/*.ts'],
    ignores: ['dist/**', 'node_modules/**'],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2021,
      sourceType: 'module',
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      'comma-dangle': ['error', 'always-multiline'],
      'max-len': ['error', {code: 120}],
      'no-useless-constructor': 'off',
      'object-curly-spacing': ['error', 'never'],
      'space-before-function-paren': 'off',
    },
  },
]
