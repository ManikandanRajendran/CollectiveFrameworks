import { defineConfig, devices } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';

const testDir = defineBddConfig({
    features: 'features/**/*.feature',
    steps: 'steps/*.ts',
});

export default defineConfig({
    testDir,
    reporter: [['html', {open: 'never'}]],
    fullyParallel: true,
    webServer: {
        command: 'cd ../automation-practice-store && npm run seed && npm run start',
        url: 'http://localhost:3000',
        reuseExistingServer: !process.env.CI,
        timeout: 120 * 1000,
    },
    use: {
        baseURL: 'http://localhost:3000',
        video: `on`,
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
    },
    projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
