import globals from 'globals';
import { defineConfig, globalIgnores } from 'eslint/config';

import base from './base';

export default defineConfig([
  globalIgnores(['dist', 'build', 'coverage', 'node_modules']),
  ...base,

  {
    files: ['**/*.ts'],

    languageOptions: {
      globals: globals.node,
    },

    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],

      'no-console': [
        'warn',
        {
          allow: ['warn', 'error'],
        },
      ],
    },
  },
]);
