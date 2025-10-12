import globals from 'globals';

import eslint from '@eslint/js';

import { defineConfig } from 'eslint/config';
import importPlugin from 'eslint-plugin-import';
import storybookPlugin from 'eslint-plugin-storybook';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import prettierConfig from 'eslint-config-prettier/flat';
import tseslint from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';

const __dirname = new URL('.', import.meta.url).pathname;

export default defineConfig(
  {
    ignores: ['**/node_modules/', '**/dist/', '**/storybook-static/', '**/.yarn/', '**/.pnp.cjs', '**/.pnp.loader.mjs'],
  },

  // JavaScript
  eslint.configs.recommended,
  importPlugin.flatConfigs.recommended,
  reactPlugin.configs.flat.recommended,
  reactHooksPlugin.configs.flat.recommended,
  storybookPlugin.configs['flat/recommended'],
  prettierConfig,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    settings: {
      react: {
        version: 'detect',
      },
      'import/parsers': {
        espree: ['.js', '.cjs', '.mjs', '.jsx'],
      },
      'import/resolver': {
        typescript: true,
        node: true,
      },
    },
    rules: {
      'no-duplicate-imports': 'error',
      'no-unreachable-loop': 'error',
      'no-unused-private-class-members': 'error',
      'capitalized-comments': 'error',
      'default-case-last': 'error',
      'dot-notation': 'error',
      eqeqeq: 'error',
      'init-declarations': 'error',
      'no-array-constructor': 'error',
      'no-console': 'error',
      'no-eval': 'error',
      'no-extra-bind': 'error',
      'no-implied-eval': 'error',
      'no-invalid-this': 'error',
      'no-label-var': 'error',
      'no-labels': 'error',
      'no-loop-func': 'error',
      'no-new-func': 'error',
      'no-new-wrappers': 'error',
      'no-throw-literal': 'error',
      'no-unneeded-ternary': 'error',
      'no-unused-expressions': 'error',
      'prefer-arrow-callback': 'error',
      'no-useless-constructor': 'error',
      'no-useless-return': 'error',
      'prefer-const': 'error',
      'require-await': 'error',
      'import/order': [
        'error',
        {
          alphabetize: {
            order: 'asc',
          },
          'newlines-between': 'always',
        },
      ],
      'import/no-named-as-default-member': 'off',
      'react/forbid-prop-types': 'error',
      'react/function-component-definition': [
        'error',
        {
          namedComponents: 'arrow-function',
          unnamedComponents: 'arrow-function',
        },
      ],
      'react/hook-use-state': 'error',
      'react/jsx-filename-extension': [
        'error',
        {
          extensions: ['.jsx', '.tsx'],
        },
      ],
      'react/jsx-fragments': ['error', 'syntax'],
      'react/jsx-handler-names': 'error',
      'react/jsx-no-useless-fragment': 'error',
      'react/jsx-pascal-case': 'error',
      'react/jsx-sort-props': 'error',
      'react/no-danger': 'error',
      'react/no-unsafe': 'error',
      'react/prefer-read-only-props': 'error',
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
    },
  },

  // TypeScript
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
      },
    },
  },
  tseslint.configs['flat/strict-type-checked'],
  tseslint.configs['flat/stylistic-type-checked'],
  importPlugin.flatConfigs.typescript,
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      '@typescript-eslint/restrict-template-expressions': [
        'error',
        {
          allowNumber: true,
          allowBoolean: true,
        },
      ],
    },
  },
  {
    files: ['tests/**/*.ts', 'tests/**/*.tsx', 'unittests/**/*.ts', 'unittests/**/*.tsx'],
    rules: {
      'init-declarations': 'off',
      'no-loop-func': 'off',
    },
  },
);
