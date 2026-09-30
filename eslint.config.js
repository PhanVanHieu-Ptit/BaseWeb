import js from '@eslint/js'
import { defineConfig, globalIgnores } from 'eslint/config'
import prettier from 'eslint-config-prettier'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import globals from 'globals'
import tseslint from 'typescript-eslint'

// Architecture boundaries (see README): features expose a public API through `index.ts`,
// and lower layers never depend on higher ones.
const noFeatureDeepImports = {
  group: ['@/features/*/*'],
  message: 'Import from the feature public API (@/features/<name>) instead of deep paths.',
}
const noFeatures = {
  group: ['@/features', '@/features/*'],
  message: 'Shared code must not depend on features.',
}
const noApp = {
  group: ['@/app', '@/app/*'],
  message: 'Only src/app may import from src/app.',
}

export default defineConfig([
  globalIgnores(['dist', 'coverage']),

  // Tooling files at the repository root (not type-aware).
  {
    files: ['*.{js,ts}'],
    extends: [js.configs.recommended, tseslint.configs.recommended],
    languageOptions: { globals: globals.node },
  },

  // Application source (type-aware).
  {
    files: ['src/**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommendedTypeChecked,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'separate-type-imports' },
      ],
      '@typescript-eslint/no-misused-promises': [
        'error',
        { checksVoidReturn: { attributes: false } },
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' },
      ],
    },
  },

  // Layering rules (one block per area so the options never overlap).
  {
    files: ['src/app/**/*.{ts,tsx}'],
    rules: { 'no-restricted-imports': ['error', { patterns: [noFeatureDeepImports] }] },
  },
  {
    files: ['src/features/**/*.{ts,tsx}'],
    rules: { 'no-restricted-imports': ['error', { patterns: [noFeatureDeepImports, noApp] }] },
  },
  {
    files: ['src/{components,hooks,lib,utils,config,types}/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': ['error', { patterns: [noFeatureDeepImports, noFeatures, noApp] }],
    },
  },

  // shadcn/ui primitives export component + variants helper from the same file.
  {
    files: ['src/components/ui/**/*.{ts,tsx}'],
    rules: { 'react-refresh/only-export-components': 'off' },
  },

  // Must stay last: turns off rules that conflict with Prettier.
  prettier,
])
