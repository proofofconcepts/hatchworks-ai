import { test, expect } from '@playwright/test'

test.describe('Checkout', () => {
  test('unauthenticated user is redirected to login from /checkout', async ({ page }) => {
    await page.goto('/checkout')
    await expect(page).toHaveURL(/\/login/)
  })

  // Full flow tests require the backend to be running.
  // Run against the hosted Render deployment using PLAYWRIGHT_BASE_URL env var.
  test.skip('authenticated user can complete a checkout', async ({ page }) => {
    // TODO: implement against hosted app
  })
})
