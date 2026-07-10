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
      '.vscode/**',
      '.idea/**',
      '.git/**',
    ],
  },
  ...config,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parserOptions: {
        tsconfigRootDir,
        project: ['./tsconfig.app.json', './tsconfig.node.json'],
      },
    },
  },
]);
