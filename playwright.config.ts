import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  workers: 2,
  retries: 0,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:5174',
    locale: 'vi-VN',
    timezoneId: 'UTC',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'desktop', use: { browserName: 'chromium', viewport: { width: 1440, height: 1000 } } },
    {
      name: 'mobile',
      use: { ...devices['Pixel 7'], browserName: 'chromium', timezoneId: 'America/Los_Angeles' },
    },
  ],
  // Dedicated ports avoid relying on an already running development session.
  webServer: [
    {
      command: 'npm run dev -w backend',
      url: 'http://127.0.0.1:3002/api/health',
      env: { PORT: '3002' },
      reuseExistingServer: false,
    },
    {
      command: 'npm run dev -w frontend -- --host 127.0.0.1 --port 5174',
      url: 'http://127.0.0.1:5174',
      env: { API_PROXY_TARGET: 'http://127.0.0.1:3002' },
      reuseExistingServer: false,
    },
  ],
});
