import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist', 'node_modules', 'public/fonts'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  // Scripts de Node (construcción): permiten la consola.
  { files: ['scripts/**/*.mjs'], languageOptions: { globals: { console: 'readonly' } } },
);
