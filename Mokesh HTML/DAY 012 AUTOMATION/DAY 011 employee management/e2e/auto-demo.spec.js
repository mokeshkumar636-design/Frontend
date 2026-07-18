/**
 * 🤖 FULL AUTO-DEMO — Employee Management Portal
 * ─────────────────────────────────────────────
 * This script automatically:
 *  1. Opens the website
 *  2. Logs in as Admin
 *  3. Explores Dashboard stats
 *  4. Adds a new employee
 *  5. Searches and edits an employee
 *  6. Navigates to Attendance → marks employees
 *  7. Navigates to Payroll → opens salary slip
 *  8. Navigates to Settings → toggles theme
 *  9. Logs out
 *
 * Run with: npm run demo
 */

import { test, expect } from '@playwright/test';

test('🤖 Full Auto Demo — Complete Portal Walkthrough', async ({ page }) => {

  // ═══════════════════════════════════════════════
  // STEP 1: Open the website
  // ═══════════════════════════════════════════════
  console.log('\n🌐 Step 1: Opening the Employee Portal...');
  await page.goto('/');
  await expect(page.locator('text=Admin Sign-in')).toBeVisible();
  await page.waitForTimeout(1000);

  // ═══════════════════════════════════════════════
  // STEP 2: Auto Login as Admin
  // ═══════════════════════════════════════════════
  console.log('🔐 Step 2: Logging in as Admin...');
  await page.fill('#username', 'admin');
  await page.waitForTimeout(500);
  await page.fill('#password', 'admin123');
  await page.waitForTimeout(500);
  await page.click('button[type="submit"]');

  // Wait for dashboard
  await expect(page.locator('text=Executive Dashboard')).toBeVisible({ timeout: 8000 });
  console.log('✅ Logged in successfully!');
  await page.waitForTimeout(1500);

  // ═══════════════════════════════════════════════
  // STEP 3: Explore Dashboard Stats
  // ═══════════════════════════════════════════════
  console.log('📊 Step 3: Exploring Dashboard stats...');
  await expect(page.locator('text=Total Employees')).toBeVisible();
  await expect(page.locator('text=Active Staff')).toBeVisible();
  await page.waitForTimeout(2000);

  // ═══════════════════════════════════════════════
  // STEP 4: Go to Employees Tab
  // ═══════════════════════════════════════════════
  console.log('👥 Step 4: Opening Employee Directory...');
  await page.click('text=Employees');
  await expect(page.locator('text=Employee Directory')).toBeVisible();
  await page.waitForTimeout(1500);

  // Search for an employee
  console.log('🔍 Step 4a: Searching for "Ramesh"...');
  await page.fill('input[placeholder*="Search"]', 'Ramesh');
  await page.waitForTimeout(1200);

  // Clear search
  console.log('🧹 Step 4b: Clearing search filter...');
  await page.click('text=Clear Filters');
  await page.waitForTimeout(1000);

  // ═══════════════════════════════════════════════
  // STEP 5: Add a New Employee Automatically
  // ═══════════════════════════════════════════════
  console.log('➕ Step 5: Adding a new employee automatically...');
  await page.click('button:has-text("Add Employee")');
  await expect(page.locator('[data-testid="modal-title"]')).toHaveText('Add New Employee');
  await page.waitForTimeout(800);

  // Fill the form automatically
  await page.fill('[data-testid="input-name"]', 'Auto Bot Employee');
  await page.waitForTimeout(400);
  await page.fill('[data-testid="input-role"]', 'Automation Engineer');
  await page.waitForTimeout(400);
  await page.selectOption('[data-testid="select-department"]', 'Engineering');
  await page.waitForTimeout(400);
  await page.fill('[data-testid="input-email"]', 'autobot@company.com');
  await page.waitForTimeout(400);
  await page.fill('[data-testid="input-phone"]', '+91 9000000099');
  await page.waitForTimeout(400);
  await page.fill('[data-testid="input-salary"]', '1800000');
  await page.waitForTimeout(400);
  await page.fill('[data-testid="input-doj"]', '2026-07-18');
  await page.waitForTimeout(600);

  // Save
  console.log('💾 Step 5a: Saving new employee...');
  await page.click('[data-testid="btn-save"]');
  await expect(page.locator('text=Auto Bot Employee')).toBeVisible();
  console.log('✅ New employee "Auto Bot Employee" added!');
  await page.waitForTimeout(1500);

  // ═══════════════════════════════════════════════
  // STEP 6: Edit an Existing Employee
  // ═══════════════════════════════════════════════
  console.log('✏️ Step 6: Editing an existing employee...');
  await page.locator('[data-testid^="edit-btn-"]').first().click();
  await expect(page.locator('[data-testid="modal-title"]')).toHaveText('Edit Employee Record');
  await page.waitForTimeout(1000);

  // Update the role field
  await page.fill('[data-testid="input-role"]', 'Senior Principal Engineer');
  await page.waitForTimeout(600);
  await page.click('[data-testid="btn-save"]');
  await expect(page.locator('text=Senior Principal Engineer')).toBeVisible();
  console.log('✅ Employee role updated!');
  await page.waitForTimeout(1500);

  // ═══════════════════════════════════════════════
  // STEP 7: Navigate to Attendance Tab
  // ═══════════════════════════════════════════════
  console.log('📅 Step 7: Opening Attendance Tracking...');
  await page.click('text=Attendance');
  await expect(page.locator('text=Attendance Tracking')).toBeVisible();
  await page.waitForTimeout(1500);

  // Mark first employee as Absent
  console.log('🔴 Step 7a: Marking first employee as Absent...');
  const firstRow = page.locator('table tbody tr').first();
  await firstRow.locator('button:has-text("Absent")').click();
  await page.waitForTimeout(800);

  // Mark second employee as On Leave
  console.log('🟡 Step 7b: Marking second employee as On Leave...');
  const secondRow = page.locator('table tbody tr').nth(1);
  await secondRow.locator('button:has-text("On Leave")').click();
  await page.waitForTimeout(800);

  // Restore first employee back to Present
  console.log('🟢 Step 7c: Restoring first employee to Present...');
  await firstRow.locator('button:has-text("Present")').click();
  await page.waitForTimeout(1500);

  // ═══════════════════════════════════════════════
  // STEP 8: Navigate to Payroll Tab
  // ═══════════════════════════════════════════════
  console.log('💰 Step 8: Opening Payroll Workspace...');
  await page.click('text=Payroll Slips');
  await expect(page.locator('text=Payroll Workspace')).toBeVisible();
  await page.waitForTimeout(1500);

  // Open salary slip for first employee
  console.log('📄 Step 8a: Opening Salary Slip modal...');
  await page.locator('button:has-text("Salary Slip")').first().click();
  await expect(page.locator('text=Employee Salary Slip')).toBeVisible();
  await page.waitForTimeout(1500);

  // Change month selector
  console.log('📅 Step 8b: Changing payroll month to January...');
  await page.selectOption('select', { label: 'January' });
  await page.waitForTimeout(1000);

  // Close salary slip
  console.log('❌ Step 8c: Closing salary slip...');
  await page.click('button:has-text("Close")');
  await page.waitForTimeout(1000);

  // ═══════════════════════════════════════════════
  // STEP 9: Navigate to Settings Tab
  // ═══════════════════════════════════════════════
  console.log('⚙️ Step 9: Opening Portal Settings...');
  await page.click('text=Portal Settings');
  await expect(page.locator('text=System Configurations')).toBeVisible();
  await page.waitForTimeout(1500);

  // Toggle theme
  console.log('🌙 Step 9a: Switching to Light Mode...');
  const themeBtn = page.locator('.table-container button:has-text("Light Mode"), .table-container button:has-text("Dark Mode")');
  await themeBtn.first().click();
  await page.waitForTimeout(1000);

  // Toggle back
  console.log('🌙 Step 9b: Switching back to Dark Mode...');
  await themeBtn.first().click();
  await page.waitForTimeout(1500);

  // ═══════════════════════════════════════════════
  // STEP 10: Go back to Dashboard
  // ═══════════════════════════════════════════════
  console.log('🏠 Step 10: Returning to Dashboard...');
  await page.click('text=Dashboard');
  await expect(page.locator('text=Executive Dashboard')).toBeVisible();
  await page.waitForTimeout(1500);

  // ═══════════════════════════════════════════════
  // STEP 11: Logout
  // ═══════════════════════════════════════════════
  console.log('🚪 Step 11: Logging out...');
  await page.click('text=Logout');
  await expect(page.locator('text=Admin Sign-in')).toBeVisible({ timeout: 5000 });
  await page.waitForTimeout(1000);

  console.log('\n🎉 AUTO DEMO COMPLETE! All 11 steps ran successfully!\n');
});
