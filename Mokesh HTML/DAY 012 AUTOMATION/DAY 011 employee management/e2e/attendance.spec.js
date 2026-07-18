import { test, expect } from '@playwright/test';

async function adminLogin(page) {
  await page.goto('/');
  await page.fill('#username', 'admin');
  await page.fill('#password', 'admin123');
  await page.click('button[type="submit"]');
  await expect(page.locator('text=Executive Dashboard')).toBeVisible({ timeout: 5000 });
}

test.describe('Attendance Tracking', () => {
  test.beforeEach(async ({ page }) => {
    await adminLogin(page);
    await page.click('text=Attendance');
    await expect(page.locator('text=Attendance Tracking')).toBeVisible();
  });

  test('attendance page shows stat cards', async ({ page }) => {
    // Use .stat-label class to avoid matching "On Leave" from table rows (18+ matches)
    const statLabels = page.locator('.stat-label');
    await expect(statLabels.filter({ hasText: 'Total Staff' })).toBeVisible();
    await expect(statLabels.filter({ hasText: 'Present Today' })).toBeVisible();
    await expect(statLabels.filter({ hasText: 'Absent Today' })).toBeVisible();
    await expect(statLabels.filter({ hasText: 'On Leave' })).toBeVisible();
  });

  test('attendance table renders with employee rows', async ({ page }) => {
    const rows = page.locator('table tbody tr');
    const count = await rows.count();
    expect(count).toBeGreaterThan(0);
  });

  test('attendance table shows employee names', async ({ page }) => {
    await expect(page.locator('text=Ramesh Krishnan')).toBeVisible();
  });

  test('each employee row has Present, Absent, On Leave buttons', async ({ page }) => {
    const firstRow = page.locator('table tbody tr').first();
    await expect(firstRow.locator('button:has-text("Present")')).toBeVisible();
    await expect(firstRow.locator('button:has-text("Absent")')).toBeVisible();
    await expect(firstRow.locator('button:has-text("On Leave")')).toBeVisible();
  });

  test('marking an employee Absent updates their status pill', async ({ page }) => {
    const firstRow = page.locator('table tbody tr').first();
    await firstRow.locator('button:has-text("Absent")').click();
    const statusPill = firstRow.locator('.status-pill');
    await expect(statusPill).toHaveText('Absent');
  });

  test('marking an employee On Leave updates their status pill', async ({ page }) => {
    const secondRow = page.locator('table tbody tr').nth(1);
    await secondRow.locator('button:has-text("On Leave")').click();
    const statusPill = secondRow.locator('.status-pill');
    await expect(statusPill).toHaveText('On Leave');
  });

  test('marking an employee Present restores their status pill', async ({ page }) => {
    const firstRow = page.locator('table tbody tr').first();
    await firstRow.locator('button:has-text("Absent")').click();
    await firstRow.locator('button:has-text("Present")').click();
    const statusPill = firstRow.locator('.status-pill');
    await expect(statusPill).toHaveText('Present');
  });

  test('attendance changes persist visible count updates', async ({ page }) => {
    const absentCard = page.locator('.stat-card').filter({ has: page.locator('.stat-label', { hasText: 'Absent Today' }) }).locator('.stat-value');
    const initialCount = parseInt(await absentCard.textContent(), 10);

    const rows = page.locator('table tbody tr');
    const rowCount = await rows.count();
    for (let i = 0; i < rowCount; i++) {
      const row = rows.nth(i);
      const pill = row.locator('.status-pill');
      const pillText = await pill.textContent();
      if (pillText === 'Present') {
        await row.locator('button:has-text("Absent")').click();
        break;
      }
    }

    const newCount = parseInt(await absentCard.textContent(), 10);
    expect(newCount).toBeGreaterThan(initialCount);
  });
});
