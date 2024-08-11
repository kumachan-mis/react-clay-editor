import { fixupConfigRules } from '@eslint/compat';
import globals from 'globals';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  {
    ignores: ['**/node_modules/', '**/dist/', '**/storybook-static/', '**/.yarn/', '**/.pnp.cjs', '**/.pnp.loader.mjs'],
  },
  ...fixupConfigRules(
    compat.extends(
      'eslint:recommended',
      'plugin:import/recommended',
      'plugin:react/recommended',
      'plugin:react-hooks/recommended',
      'plugin:storybook/recommended',
      'prettier'
    )
  ),
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      ecmaVersion: 'latest',
      sourceType: 'commonjs',
      parserOptions: {
        project: true,
        tsconfigRootDir: '.',
      },
    },
    settings: {
      react: {
        version: 'detect',
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
  ...fixupConfigRules(
    compat.extends(
      'plugin:@typescript-eslint/strict-type-checked',
      'plugin:@typescript-eslint/stylistic-type-checked',
      'plugin:import/typescript'
    )
  ).map((config) => ({
    ...config,
    files: ['**/*.ts', '**/*.tsx'],
  })),
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
];
