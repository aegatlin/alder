import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test('home page has header', async ({ page }) => {
  await expect(page.getByRole('heading')).toContainText('Grocl')
})
