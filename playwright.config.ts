import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:3005',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'Desktop Chrome',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } },
    },
    {
      name: 'Mobile Chrome (Pixel 7)',
      use: { ...devices['Pixel 7'] },
    },
  ],
  webServer: {
    command: 'next start -p 3005',
    url: 'http://localhost:3005',
    reuseExistingServer: false,
    timeout: 120 * 1000,
    env: {
      ADMIN_PASSWORD: 'AnuragProdTest2026!',
      ADMIN_SECRET_KEY: 'e83921048f02931bcdef0123456789abcdef0123456789abcdef0123456789ab',
    },
  },
});

