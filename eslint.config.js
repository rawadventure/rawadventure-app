// ESLint — flat config (ESLint 9, Expo SDK 54).
// Ajouté suite à l'audit Lou Grenier (docs/audit-lou-grenier-2026-09-09.md § 1.1) :
// eslint-config-expo embarque eslint-plugin-react-hooks (rules-of-hooks + exhaustive-deps),
// première ligne de défense contre le cycle de bugs lié aux hooks.
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: [
      'node_modules/**',
      'web/**',
      'kanban/**',
      'e2e/**',
      'coverage/**',
      '.expo/**',
      'dist/**',
      'legal-site/**',
      'docs/**',
      '.claude/**',
      // Edge Functions Deno : imports par URL, hors périmètre du lint RN.
      'supabase/functions/**',
    ],
  },
  {
    rules: {
      // Copy français : apostrophes et guillemets dans le JSX partout — règle inadaptée.
      'react/no-unescaped-entities': 'off',
      // F-01 soldé (routeur HomeScreenV1 + Phase0HomeScreen) : zéro violation,
      // règle verrouillée en error — le pre-commit bloque toute réintroduction.
      'react-hooks/rules-of-hooks': 'error',
      // TODO F-05/F-06 (découpage ProgressContext + file narrative, audit Lou) :
      // repasser ces 3 règles en 'error' une fois les 13 violations restantes
      // corrigées (set-state-in-effect ×8, refs ×3, immutability ×1 au 19 sept).
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/refs': 'warn',
      'react-hooks/immutability': 'warn',
    },
  },
  {
    // Mocks Jest : displayName sans intérêt sur les composants factices.
    files: ['jest.setup.ts'],
    rules: { 'react/display-name': 'off' },
  },
]);
