import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  reporter: 'html',
  use: { baseURL: 'http://127.0.0.1:3100', trace: 'on-first-retry' },
  webServer: {
    command: 'bun run dev -- -p 3100',
    url: 'http://127.0.0.1:3100',
    reuseExistingServer: true,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 5'] } },
  ],
});
