// @ts-nocheck
import { defineConfig } from 'eslint/config';

import config from '@srms/eslint-config/node';

const tsconfigRootDir = decodeURIComponent(new URL('.', import.meta.url).pathname).replace(
  /^\/([A-Za-z]:\/)/,
  '$1',
);

export default defineConfig([
  {
    ignores: ['eslint.config.ts'],
  },
  ...config,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parserOptions: {
        tsconfigRootDir,
        project: ['./tsconfig.json'],
      },
    },
  },
]);
