import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('loads and shows brand name', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/SherryBerries/);
    await expect(page.getByText('Sherry').first()).toBeVisible();
    await expect(page.getByText('Berries').first()).toBeVisible();
  });

  test('navigation has accessible product dropdown', async ({ page }) => {
    await page.goto('/');

    const productsButton = page.getByRole('button', { name: /products/i }).first();
    await expect(productsButton).toHaveAttribute('aria-expanded', 'false');

    await productsButton.click();
    await expect(productsButton).toHaveAttribute('aria-expanded', 'true');

    const menu = page.getByRole('menu');
    await expect(menu).toBeVisible();
    await expect(page.getByRole('menuitem', { name: /jewelry/i })).toBeVisible();
  });

  test('skip-to-main-content link is present', async ({ page }) => {
    await page.goto('/');
    const skipLink = page.getByRole('link', { name: /skip to main content/i });
    await expect(skipLink).toHaveAttribute('href', '#main-content');
  });

  test('clicking jewelry navigates to product page', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('button', { name: /products/i }).first().click();
    await page.getByRole('menuitem', { name: /jewelry/i }).click();

    await expect(page).toHaveURL(/\/product\/jewelry/);
  });
});
