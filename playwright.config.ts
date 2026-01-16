import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',

  // Timeout for each test
  timeout: 120000,

  // Expect timeout
  expect: {
    timeout: 10000,
  },

  // Run tests sequentially to avoid conflicts
  fullyParallel: false,

  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,

  // Retry on CI only
  retries: process.env.CI ? 2 : 0,

  // Reporter
  reporter: [
    ['html', { open: 'never' }],
    ['list'],
  ],

  // Output folder for test artifacts
  outputDir: 'test-results',

  use: {
    // Base URL
    baseURL: 'http://localhost:3001',

    // Show browser for debugging
    headless: false,

    // Collect trace when retrying the failed test
    trace: 'on-first-retry',

    // Screenshots
    screenshot: 'only-on-failure',

    // Video
    video: 'retain-on-failure',

    // Viewport
    viewport: { width: 1280, height: 720 },

    // Action timeout
    actionTimeout: 15000,

    // Navigation timeout
    navigationTimeout: 30000,
  },

  // Configure projects for different browsers
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  // Web server configuration
  webServer: {
    command: 'npm run dev:test',
    url: 'http://localhost:3001',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
    stdout: 'pipe',
    stderr: 'pipe',
  },
});
