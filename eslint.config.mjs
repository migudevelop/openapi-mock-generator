import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import eslintPluginPrettier from 'eslint-plugin-prettier'
import { defineConfig } from 'eslint/config'

export default defineConfig([
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/coverage/**',
      '**/mocks/**',
      '**build/**'
    ]
  },
  {
    files: ['src/**/*.{js,mjs,cjs,ts}'],
    plugins: {
      js,
      prettier: eslintPluginPrettier
    },
    rules: {
      ...eslintPluginPrettier.configs.recommended.rules
    }
  },
  {
    files: ['src/**/*.{js,mjs,cjs,ts}'],
    languageOptions: {
      globals: globals.node
    }
  },
  tseslint.configs.recommended
])
