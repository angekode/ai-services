import js from '@eslint/js';
import globals from 'globals';
import { defineConfig } from 'eslint/config';
import stylistic from '@stylistic/eslint-plugin';
import tseslint from 'typescript-eslint';

export default defineConfig([
  {
    files: ['src/**/*.{js,ts}'],
    extends: [
      js.configs.recommended,
    tseslint.configs.recommended
    ],
    plugins: {
      '@stylistic': stylistic
    },
    rules: {
      semi: 'error',
      '@stylistic/indent': ['error', 2],
      '@stylistic/quotes': ['error', 'single'],
      '@stylistic/comma-spacing': 'error',
      '@stylistic/comma-dangle': 'error',
      '@stylistic/no-trailing-spaces': 'error',
      'eol-last': ['error', 'always']
    }
  },
  {
    languageOptions: {
      globals: {
        ...globals.node
      }
    }
  }
]);
