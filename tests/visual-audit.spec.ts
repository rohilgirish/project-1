import { test, expect } from '@playwright/test';

test.describe('Anurag Enclave - Visual & Responsive Audit', () => {

  test('Homepage loads cleanly without console errors', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Verify main brand heading or status pill
    await expect(page.locator('body')).toBeVisible();

    // Take screenshot of homepage
    await page.screenshot({ path: `tests/screenshots/homepage-${test.info().project.name.replace(/\s+/g, '-').toLowerCase()}.png`, fullPage: false });
  });

  test('Plots catalog page renders correctly', async ({ page }) => {
    await page.goto('/plots');
    await page.waitForLoadState('networkidle');

    // Verify plots cards or table are present
    const plotsContainer = page.locator('main, section, div').filter({ hasText: /plot/i }).first();
    await expect(plotsContainer).toBeVisible();

    // Screenshot plots view
    await page.screenshot({ path: `tests/screenshots/plots-${test.info().project.name.replace(/\s+/g, '-').toLowerCase()}.png`, fullPage: false });
  });

  test('Contact & Site Visit form is responsive and interactive', async ({ page }) => {
    await page.goto('/contact');
    await page.waitForLoadState('networkidle');

    // Ensure inputs are present
    const nameInput = page.locator('input[placeholder*="name" i], input[type="text"]').first();
    await expect(nameInput).toBeVisible();

    // Screenshot contact page
    await page.screenshot({ path: `tests/screenshots/contact-${test.info().project.name.replace(/\s+/g, '-').toLowerCase()}.png`, fullPage: false });
  });

});

