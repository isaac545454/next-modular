import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import tseslint from 'typescript-eslint'
import noCrossModuleImports from './eslint/no-cross-module-imports.js'

const localPlugin = {
  rules: {
    'no-cross-module-imports': noCrossModuleImports,
  },
}

export default tseslint.config(
  {
    ignores: ['.next', 'node_modules', '.turbo', 'coverage', 'next-env.d.ts'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
    plugins: {
      'react-hooks': reactHooks,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
    },
  },
  {
    files: ['next.config.ts', 'vitest.config.ts', 'postcss.config.js', 'eslint.config.js'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
  {
    files: ['src/app/modules/**/*.{ts,tsx}'],
    plugins: {
      local: localPlugin,
    },
    rules: {
      'local/no-cross-module-imports': 'error',
    },
  },
)
