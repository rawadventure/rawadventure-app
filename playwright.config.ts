/**
 * Config Playwright — salve E2E légère sur la PWA (expo start --web).
 *
 * Périmètre V1 : parcours anonymes (onboarding → register). Les parcours
 * connectés (hub, validation, paywall) nécessitent un compte Supabase de
 * test — voir e2e/auth-hub.spec.ts (skippé sans E2E_TEST_EMAIL/PASSWORD).
 *
 * Lancement : npm run test:e2e (PAS dans le pre-commit — trop lent).
 */
import { defineConfig, devices } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

// Charge `.env.e2e` (gitignoré) dans process.env — identifiants du compte de
// test E2E_TEST_EMAIL / E2E_TEST_PASSWORD pour les runs locaux. En CI, ces
// valeurs viennent des secrets GitHub. Parseur minimal, pas de dépendance.
const envFile = path.join(__dirname, '.env.e2e');
if (fs.existsSync(envFile)) {
  for (const line of fs.readFileSync(envFile, 'utf8').split('\n')) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim();
  }
}

const PORT = 8081;

export default defineConfig({
  testDir: './e2e',
  timeout: 60_000,
  fullyParallel: false, // un seul serveur Metro, tests séquentiels = stables
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: process.env.CI ? [['github'], ['list']] : [['list']],
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: `npx expo start --web --port ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
    stdout: 'ignore',
    stderr: 'pipe',
  },
});
