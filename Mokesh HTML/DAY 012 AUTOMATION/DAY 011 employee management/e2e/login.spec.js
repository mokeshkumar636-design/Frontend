import { test, expect } from '@playwright/test';
// Helper: perform admin login
async function adminLogin(page) {
  await page.goto('/');
  await page.fill('#username', 'admin');
  await page.fill('#password', 'admin123');
  await page.click('button[type="submit"]');
  // Wait for dashboard to load
  await expect(page.locator('text=Executive Dashboard')).toBeVisible({ timeout: 5000 });
}

test.describe('Login Flow', () => {
  test('page loads and shows login form', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('text=Admin Sign-in')).toBeVisible();
    await expect(page.locator('text=Employee Sign-in')).toBeVisible();
    await expect(page.locator('#username')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
  });

  test('admin login with correct credentials → dashboard visible', async ({ page }) => {
    await adminLogin(page);
    await expect(page.locator('text=Executive Dashboard')).toBeVisible();
    await expect(page.locator('text=SouthHR Portal')).toBeVisible();
  });

  test('admin login with wrong credentials → error message', async ({ page }) => {
    await page.goto('/');
    await page.fill('#username', 'wronguser');
    await page.fill('#password', 'wrongpass');
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Invalid admin credentials')).toBeVisible({ timeout: 3000 });
  });

  test('submit empty form → shows fill-all-fields error', async ({ page }) => {
    await page.goto('/');
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Please fill in all fields')).toBeVisible();
  });

  test('switch to Employee tab → heading changes', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Employee Sign-in');
    await expect(page.locator('text=Employee Portal')).toBeVisible();
  });

  test('logout returns to login page', async ({ page }) => {
    await adminLogin(page);
    await page.click('text=Logout');
    await expect(page.locator('text=Admin Sign-in')).toBeVisible({ timeout: 3000 });
  });
});
