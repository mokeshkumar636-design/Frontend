import { test, expect } from '@playwright/test';

async function adminLogin(page) {
  await page.goto('/');
  await page.fill('#username', 'admin');
  await page.fill('#password', 'admin123');
  await page.click('button[type="submit"]');
  await expect(page.locator('text=Executive Dashboard')).toBeVisible({ timeout: 5000 });
}

test.describe('Employee CRUD Operations', () => {
  test.beforeEach(async ({ page }) => {
    await adminLogin(page);
    await page.click('text=Employees');
    await expect(page.locator('text=Employee Directory')).toBeVisible();
  });

  test('employee table renders with at least one row', async ({ page }) => {
    await expect(page.locator('[data-testid^="employee-row-"]').first()).toBeVisible();
  });

  test('search filters employees by name', async ({ page }) => {
    await page.fill('input[placeholder*="Search"]', 'Ramesh');
    await expect(page.locator('text=Ramesh Krishnan')).toBeVisible();
    await expect(page.locator('text=Priya Swaminathan')).not.toBeVisible();
  });

  test('clear filters button restores all employees', async ({ page }) => {
    await page.fill('input[placeholder*="Search"]', 'Ramesh');
    await page.click('text=Clear Filters');
    await expect(page.locator('text=Priya Swaminathan')).toBeVisible();
  });

  test('department filter shows only matching employees', async ({ page }) => {
    // Use nth(1) to pick the first .select-field (dept filter) inside the toolbar-card
    const deptSelect = page.locator('.toolbar-card .select-field').first();
    await deptSelect.selectOption('Engineering');
    // Engineering employees should be visible
    await expect(page.locator('text=Ramesh Krishnan')).toBeVisible();
    // Non-engineering (Design) should not appear
    await expect(page.locator('text=Lead UI/UX Designer')).not.toBeVisible();
  });

  test('Add Employee button opens modal', async ({ page }) => {
    await page.click('button:has-text("Add Employee")');
    await expect(page.locator('[data-testid="modal-title"]')).toHaveText('Add New Employee');
  });

  test('can add a new employee via the form', async ({ page }) => {
    await page.click('button:has-text("Add Employee")');
    await page.fill('[data-testid="input-name"]', 'Test Automation User');
    await page.fill('[data-testid="input-role"]', 'QA Automation Engineer');
    await page.fill('[data-testid="input-email"]', 'testuser@company.com');
    await page.fill('[data-testid="input-phone"]', '+91 9000000001');
    await page.fill('[data-testid="input-salary"]', '1200000');
    await page.fill('[data-testid="input-doj"]', '2024-01-15');
    await page.click('[data-testid="btn-save"]');
    await expect(page.locator('[data-testid="modal-title"]')).not.toBeVisible();
    await expect(page.locator('text=Test Automation User')).toBeVisible();
  });

  test('form validation prevents submit with empty required fields', async ({ page }) => {
    await page.click('button:has-text("Add Employee")');
    await page.click('[data-testid="btn-save"]');
    await expect(page.locator('text=Full name is required.')).toBeVisible();
  });

  test('can edit an existing employee', async ({ page }) => {
    const firstEditBtn = page.locator('[data-testid^="edit-btn-"]').first();
    await firstEditBtn.click();
    await expect(page.locator('[data-testid="modal-title"]')).toHaveText('Edit Employee Record');
    await page.fill('[data-testid="input-role"]', 'Updated Role Title');
    await page.click('[data-testid="btn-save"]');
    await expect(page.locator('text=Updated Role Title')).toBeVisible();
  });

  test('cancel button closes modal without saving', async ({ page }) => {
    await page.click('button:has-text("Add Employee")');
    await page.fill('[data-testid="input-name"]', 'Should Not Save');
    await page.click('text=Cancel');
    await expect(page.locator('text=Should Not Save')).not.toBeVisible();
  });

  test('delete employee removes from list', async ({ page }) => {
    // Accept the window.confirm dialog automatically
    page.on('dialog', dialog => dialog.accept());

    // Get the name of the first employee row
    const firstNameEl = page.locator('[data-testid^="employee-row-"] .employee-name').first();
    const empName = await firstNameEl.textContent();

    const firstDeleteBtn = page.locator('[data-testid^="delete-btn-"]').first();
    await firstDeleteBtn.click();

    // Allow re-render
    await page.waitForTimeout(500);
    await expect(page.locator(`text=${empName}`)).not.toBeVisible();
  });
});
