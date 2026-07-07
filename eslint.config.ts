// @ts-nocheck
import { defineConfig } from 'eslint/config';

import config from '@srms/eslint-config/react';

const tsconfigRootDir = decodeURIComponent(new URL('.', import.meta.url).pathname).replace(
  /^\/([A-Za-z]:\/)/,
  '$1',
);

export default defineConfig([
  {
    ignores: [
      'eslint.config.ts',
      'node_modules/**',
      'dist/**',
      'build/**',
      'coverage/**',
      'public/**',
      '.vscode/**',
      '.idea/**',
      '.git/**',
      '.cache/**',
      '.turbo/**',
      '.next/**',
      '.out/**',
      'tmp/**',
      'temp/**',
    ],
  },
  ...config,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parserOptions: {
        tsconfigRootDir,
      },
    },
  },
]);
