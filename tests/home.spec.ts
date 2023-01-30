import { test, expect } from '@playwright/test'

test('home page has header', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading')).toContainText('Grocl')
})
