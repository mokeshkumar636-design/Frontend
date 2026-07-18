import { test, expect } from '@playwright/test';

async function adminLogin(page) {
  await page.goto('/');
  await page.fill('#username', 'admin');
  await page.fill('#password', 'admin123');
  await page.click('button[type="submit"]');
  await expect(page.locator('text=Executive Dashboard')).toBeVisible({ timeout: 5000 });
}

test.describe('Payroll Workspace', () => {
  test.beforeEach(async ({ page }) => {
    await adminLogin(page);
    await page.click('text=Payroll Slips');
    await expect(page.locator('text=Payroll Workspace')).toBeVisible();
  });

  test('payroll tab shows employee table with salary columns', async ({ page }) => {
    await expect(page.locator('text=Annual package (CTC)')).toBeVisible();
    await expect(page.locator('text=Monthly Gross CTC')).toBeVisible();
  });

  test('each employee row has a Salary Slip button', async ({ page }) => {
    const salaryBtns = page.locator('button:has-text("Salary Slip")');
    const count = await salaryBtns.count();
    expect(count).toBeGreaterThan(0);
  });

  test('employee names visible in payroll table', async ({ page }) => {
    await expect(page.locator('text=Ramesh Krishnan')).toBeVisible();
  });

  test('salary formatted in Indian Rupees (₹)', async ({ page }) => {
    await expect(page.locator('text=/₹/').first()).toBeVisible();
  });

  test('clicking Salary Slip opens the salary slip modal', async ({ page }) => {
    await page.locator('button:has-text("Salary Slip")').first().click();
    await expect(page.locator('text=Employee Salary Slip')).toBeVisible();
  });

  test('salary slip modal shows employee details', async ({ page }) => {
    await page.locator('button:has-text("Salary Slip")').first().click();
    // Use role=heading to avoid matching 'Gross Earnings' text (strict mode)
    await expect(page.getByRole('heading', { name: 'Earnings', exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Deductions', exact: true })).toBeVisible();
    await expect(page.locator('text=Net Take-Home Salary')).toBeVisible();
  });

  test('salary slip modal has month/year selectors', async ({ page }) => {
    await page.locator('button:has-text("Salary Slip")').first().click();
    await expect(page.locator('text=Select Payroll Period')).toBeVisible();
  });

  test('salary slip modal can be closed', async ({ page }) => {
    await page.locator('button:has-text("Salary Slip")').first().click();
    await expect(page.locator('text=Employee Salary Slip')).toBeVisible();
    // Close via button
    await page.locator('button:has-text("Close")').click();
    await expect(page.locator('text=Employee Salary Slip')).not.toBeVisible();
  });

  test('Download PDF Slip button is present in modal', async ({ page }) => {
    await page.locator('button:has-text("Salary Slip")').first().click();
    await expect(page.locator('button:has-text("Download PDF Slip")')).toBeVisible();
  });
});

test.describe('Settings Tab', () => {
  test.beforeEach(async ({ page }) => {
    await adminLogin(page);
    await page.click('text=Portal Settings');
    await expect(page.locator('text=System Configurations')).toBeVisible();
  });

  test('settings page shows configuration options', async ({ page }) => {
    await expect(page.locator('text=Portal Configurations')).toBeVisible();
    await expect(page.locator('text=Visual Theme')).toBeVisible();
    await expect(page.locator('text=Restore Defaults')).toBeVisible();
  });

  test('theme toggle button is visible', async ({ page }) => {
    const themeBtn = page.locator('.settings-card, .table-container').locator('button:has-text("Light Mode"), button:has-text("Dark Mode")');
    // Theme button exists in settings
    const count = await themeBtn.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('portal admin info shows administrator name', async ({ page }) => {
    await expect(page.locator('text=Mokesh Kumar R')).toBeVisible();
  });
});
