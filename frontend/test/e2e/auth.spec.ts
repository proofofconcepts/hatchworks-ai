import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
  test('register page renders and accepts input', async ({ page }) => {
    await page.goto('/register')
    await expect(page.getByRole('heading', { name: 'Create account' })).toBeVisible()
    await expect(page.getByLabel('Email')).toBeVisible()
    await expect(page.getByLabel(/password/i)).toBeVisible()
  })

  test('login page renders and accepts input', async ({ page }) => {
    await page.goto('/login')
    await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible()
    await expect(page.getByLabel('Email')).toBeVisible()
    await expect(page.getByLabel('Password')).toBeVisible()
  })

  test('unauthenticated root redirects to login', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveURL(/\/login/)
  })
})
