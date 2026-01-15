import { test, expect } from '@playwright/test';

test.describe('LeetPeers App', () => {
  test('homepage loads', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/LeetPeers|Next/i);
    console.log('✓ Homepage loaded successfully');
  });

  test('sign in page loads', async ({ page }) => {
    await page.goto('/auth/signin');
    // Check for sign in form elements
    await expect(page.locator('input[type="email"], input[name="email"]')).toBeVisible({ timeout: 10000 });
    console.log('✓ Sign in page loaded with email input');
  });

  test('sign up page loads', async ({ page }) => {
    await page.goto('/auth/signup');
    // Check for sign up form
    await expect(page.locator('input[type="email"], input[name="email"]')).toBeVisible({ timeout: 10000 });
    console.log('✓ Sign up page loaded with email input');
  });

  test('profile page redirects when not logged in', async ({ page }) => {
    await page.goto('/profile');
    // Should redirect to sign in
    await page.waitForURL(/signin|auth/, { timeout: 10000 });
    console.log('✓ Profile page correctly redirects unauthenticated users');
  });

  test('rooms page redirects when not logged in', async ({ page }) => {
    await page.goto('/rooms');
    // Should redirect to sign in
    await page.waitForURL(/signin|auth/, { timeout: 10000 });
    console.log('✓ Rooms page correctly redirects unauthenticated users');
  });

  test('API health check - rooms endpoint requires auth', async ({ request }) => {
    const response = await request.get('/api/rooms');
    // Should not return 200 OK when not authenticated
    expect(response.status()).not.toBe(200);
    console.log(`✓ Rooms API blocks unauthenticated access (status: ${response.status()})`);
  });
});
