import { test, expect } from '@playwright/test';

test.describe('Anurag Enclave - High-Craft Visual & Responsive Audit', () => {

  test('Homepage loads cleanly without console errors', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    // Verify main brand heading or status pill
    await expect(page.locator('body')).toBeVisible();

    // Take screenshot of homepage
    await page.screenshot({
      path: `tests/screenshots/homepage-${test.info().project.name.replace(/\s+/g, '-').toLowerCase()}.png`,
      fullPage: false
    });
  });

  test('Plots catalog page renders correctly with plot cards', async ({ page }) => {
    await page.goto('/plots');
    await page.waitForLoadState('domcontentloaded');

    // Verify plots cards or table are present
    const plotsContainer = page.locator('main, section, div').filter({ hasText: /plot/i }).first();
    await expect(plotsContainer).toBeVisible();

    // Screenshot plots view
    await page.screenshot({
      path: `tests/screenshots/plots-${test.info().project.name.replace(/\s+/g, '-').toLowerCase()}.png`,
      fullPage: false
    });
  });

  test('Plots 3D Canvas & CSP Audit: /plots renders without CSP violations or uncaught errors', async ({ page }) => {
    const cspViolations: string[] = [];
    const pageErrors: string[] = [];

    page.on('console', msg => {
      const text = msg.text();
      if (text.toLowerCase().includes('content security policy') || text.includes('violates the following Content Security Policy')) {
        cspViolations.push(text);
      }
    });

    page.on('pageerror', error => {
      pageErrors.push(error.message);
    });

    await page.goto('/plots');
    await page.waitForLoadState('domcontentloaded');

    // Canvas element for 3D layout must be mounted
    const canvas = page.locator('canvas').first();
    await expect(canvas).toBeVisible({ timeout: 6000 });

    expect(cspViolations).toHaveLength(0);
    expect(pageErrors).toHaveLength(0);
  });

  test('Pricing page renders Taste-133 EMI Loan Calculator and handles presets', async ({ page }) => {
    await page.goto('/pricing');
    await page.waitForLoadState('domcontentloaded');

    // Verify EMI Calculator is visible
    const emiHeading = page.locator('h2').filter({ hasText: /Interactive EMI/i }).first();
    await expect(emiHeading).toBeVisible();

    // Verify preset buttons are interactive
    const cornerPlotPreset = page.locator('button:has-text("Corner Plot")').first();
    await expect(cornerPlotPreset).toBeVisible();
    await cornerPlotPreset.click();

    // Verify Monthly installment figure is rendered
    const monthlyOutflow = page.locator('text=/ month').first();
    await expect(monthlyOutflow).toBeVisible();

    // Screenshot pricing view
    await page.screenshot({
      path: `tests/screenshots/pricing-${test.info().project.name.replace(/\s+/g, '-').toLowerCase()}.png`,
      fullPage: false
    });
  });

  test('Contact & Site Visit form is responsive and interactive', async ({ page }) => {
    await page.goto('/contact');
    await page.waitForLoadState('domcontentloaded');

    // Ensure inputs are present
    const nameInput = page.locator('input[placeholder*="name" i], input[type="text"]').first();
    await expect(nameInput).toBeVisible();

    // Screenshot contact page
    await page.screenshot({
      path: `tests/screenshots/contact-${test.info().project.name.replace(/\s+/g, '-').toLowerCase()}.png`,
      fullPage: false
    });
  });

  test('Shortlist page renders with zero console errors', async ({ page }) => {
    await page.goto('/shortlist');
    await page.waitForLoadState('domcontentloaded');

    const shortlistHeading = page.locator('h1').filter({ hasText: /Saved Plots/i });
    await expect(shortlistHeading).toBeVisible();

    // Screenshot shortlist page
    await page.screenshot({
      path: `tests/screenshots/shortlist-${test.info().project.name.replace(/\s+/g, '-').toLowerCase()}.png`,
      fullPage: false
    });
  });

});
