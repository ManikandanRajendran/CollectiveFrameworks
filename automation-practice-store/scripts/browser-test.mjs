import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage();
const logs = [];
page.on('pageerror', (e) => logs.push(`ERR: ${e.message}`));
page.on('console', (m) => {
  if (m.type() === 'error') logs.push(`CON: ${m.text()}`);
});

async function firstChildTestId() {
  return page.locator('[data-testid="main-content"] [data-testid]').first()
    .getAttribute('data-testid')
    .catch(() => 'empty');
}

await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);
console.log('S1 fresh:', await firstChildTestId());
console.log('S1 errors:', logs.join(' | '));
logs.length = 0;

await page.evaluate(() => localStorage.setItem('authToken', 'fake-stale-token'));
await page.goto('http://localhost:3000/#/products', { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);
console.log('S2 stale token:', await firstChildTestId());

await page.evaluate(() => localStorage.removeItem('authToken'));
await page.goto('http://localhost:3000/#/login');
await page.waitForTimeout(500);
await page.getByTestId('username-input').fill('demo');
await page.getByTestId('password-input').fill('Demo@123');
await page.getByTestId('login-submit-button').click();
await page.waitForTimeout(2000);
console.log('S3 after login:', await firstChildTestId());

if (logs.length) {
  console.log('ERRORS:');
  logs.forEach((l) => console.log(l));
}

await browser.close();
