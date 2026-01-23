import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import baseConfig from './base.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

export default [
  {
    ignores: ['**/.next/**', '**/out/**'],
  },
  ...baseConfig,
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    rules: {
      // Add any Next.js specific overrides here
    },
  },
];
