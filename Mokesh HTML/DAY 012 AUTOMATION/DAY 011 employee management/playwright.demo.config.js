import { defineConfig, devices } from '@playwright/test';

// Demo config — visible browser with slow motion so you can watch
export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  retries: 0,
  workers: 1,
  timeout: 60000,
  reporter: [['list']],
  use: {
    baseURL: 'http://localhost:5173',
    headless: false,           // 👁️ Show the browser window
    slowMo: 700,               // ⏱️ Slow down each action by 700ms so you can watch
    screenshot: 'off',
    video: 'off',
    trace: 'off',
    actionTimeout: 15000,
    navigationTimeout: 20000,
    viewport: { width: 1400, height: 900 },
  },
  projects: [
    {
      name: 'chromium-demo',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: true,   // Use already-running dev server
    timeout: 60000,
  },
});
