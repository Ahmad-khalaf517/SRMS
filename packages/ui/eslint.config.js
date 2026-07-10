import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import { defineConfig, globalIgnores } from 'eslint/config';

const tsconfigRootDir = decodeURIComponent(new URL('.', import.meta.url).pathname).replace(
  /^\/([A-Za-z]:\/)/,
  '$1',
);

export default defineConfig([
  globalIgnores(['dist', 'build', 'coverage', 'node_modules', '.vscode', '.idea', '.git']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        tsconfigRootDir,
        project: './tsconfig.json',
      },
    },
  },
]);
