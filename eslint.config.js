// Flat config for the React/Vite client. Same @eslint/js + globals versions as the
// Node services; react-hooks + react-refresh are what the Vite React template uses.
import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

export default [
  { ignores: ['dist'] },
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: { ...globals.browser },
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    plugins: { 'react-hooks': reactHooks, 'react-refresh': reactRefresh },
    rules: {
      // Classic hooks rules only. react-hooks v7 'recommended' also turns on React Compiler
      // rules (set-state-in-effect: PostList/PostDetail/PostForm fetch in effects); that
      // refactor is tracked separately, not mixed into the CI PR.
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      // Without eslint-plugin-react, JSX usage isn't seen: components (PascalCase) count as used.
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
    },
  },
  {
    // Context modules export a Provider + its hook on purpose (useAuth next to AuthProvider).
    files: ['src/context/**/*.jsx'],
    rules: { 'react-refresh/only-export-components': 'off' },
  },
  {
    files: ['vite.config.js'],
    languageOptions: { globals: { ...globals.node } },
  },
];
