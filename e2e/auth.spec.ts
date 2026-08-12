import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should allow a user to sign in', async ({ page }) => {
    await page.goto('/login');
    
    // Check if the page contains the login form
    await expect(page.getByRole('heading', { name: /welcome back/i })).toBeVisible();

    // Fill the form
    await page.getByLabel(/email/i).fill('test@businessos.app');
    await page.getByLabel(/password/i).fill('password123');
    
    // Submit
    await page.getByRole('button', { name: /sign in/i }).click();

    // Expect redirect to dashboard
    await expect(page).toHaveURL(/.*\/dashboard/);
    await expect(page.getByText('Dashboard Overview')).toBeVisible();
  });
});
