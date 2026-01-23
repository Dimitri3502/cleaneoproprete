import baseConfig from '@captech-dealflow/eslint-config/base';

export default [
  ...baseConfig,
  {
    ignores: ['**/node_modules/**', '**/dist/**', '**/.next/**', '**/out/**', 'supabase/**'],
  },
];
