import eslintPluginTs from '@typescript-eslint/eslint-plugin';
import parserTs from '@typescript-eslint/parser';
import prettier from 'eslint-config-prettier';
/** @type {import("eslint").Linter.FlatConfig} */
export default [
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: parserTs,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json',
      },
      ecmaVersion: 2022,
      globals: {
        Bun: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': eslintPluginTs,
    },
    rules: {
      ...eslintPluginTs.configs.recommended.rules,
      // Add or override rules here
      '@typescript-eslint/no-unused-vars': ['warn'],
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'default',
          format: ['camelCase'],
          leadingUnderscore: 'allow',
          trailingUnderscore: 'forbid',
        },
        {
          selector: 'variableLike',
          format: ['camelCase'],
          leadingUnderscore: 'allow',
        },
        {
          selector: 'typeLike',
          format: ['PascalCase'],
        },
        {
          selector: 'enumMember',
          format: ['UPPER_CASE'], // or ['PascalCase']
        }, // UPPER_CASE for constants
        {
          selector: 'variable',
          modifiers: ['const'],
          types: ['boolean', 'string', 'number'],
          format: ['UPPER_CASE'],
          filter: {
            regex: '.*', // Apply to all consts
            match: true,
          },
        },

        // Allow camelCase for consts that are not primitive (e.g., arrays, objects)
        {
          selector: 'variable',
          modifiers: ['const'],
          types: ['array', 'object'],
          format: ['camelCase'],
        },
      ],
    },
  },
  {
    ignores: ['dist', 'node_modules'],
  },
  prettier,
];
