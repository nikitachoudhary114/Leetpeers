import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  const randomId = Math.random().toString(36).substring(7);
  const name = `E2E Test User ${randomId}`;
  const username = `e2e_${randomId}`;
  const email = `e2e_${randomId}@gmail.com`;
  const password = 'Password123';

  test('should successfully register, login, and logout', async ({ page }) => {
    // 1. Navigate to landing page
    await page.goto('/');
    
    // Click on "Join Now" or "Get Started" to go to signup
    const joinButton = page.locator('text=Join Now').first().or(page.locator('text=Get Started').first());
    if (await joinButton.isVisible()) {
      await joinButton.click();
    } else {
      await page.goto('/auth/signup');
    }
    
    await page.waitForURL(/\/auth\/signup/);
    await expect(page).toHaveURL(/\/auth\/signup/);

    // 2. Fill registration details
    await page.fill('#name', name);
    await page.fill('#username', username);
    await page.fill('#email', email);
    await page.fill('#password', password);

    // 3. Submit Sign Up
    await page.click('button[type="submit"]');

    // 4. Verify redirected to Sign In
    await page.waitForURL(/\/auth\/signin/);
    await expect(page).toHaveURL(/\/auth\/signin/);

    // 5. Fill login details
    await page.fill('#email', email);
    await page.fill('#password', password);

    // 6. Submit Sign In
    await page.click('button[type="submit"]');

    // 7. Verify we are logged in and redirected to Rooms
    await page.waitForURL(/\/rooms/);
    await expect(page).toHaveURL(/\/rooms/);

    // 8. Verify name is in Navbar and open profile menu
    const profileTrigger = page.locator(`text=${name}`).first();
    await expect(profileTrigger).toBeVisible();
    await profileTrigger.click();

    // 9. Click Sign out
    const signOutButton = page.locator('button:has-text("Sign out")');
    await expect(signOutButton).toBeVisible();
    
    await Promise.all([
      signOutButton.click(),
      page.waitForURL('/')
    ]);

    // 10. Verify redirected to home/landing page
    await expect(page).toHaveURL('/');
  });
});
