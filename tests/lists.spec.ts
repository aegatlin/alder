import test, { expect } from '@playwright/test'
import { redis, utility } from '../server/server'
import * as A from '@automerge/automerge'
import { ListType } from '../client/types'

test.describe('lists', async () => {
  test('should create new list and view it', async ({ page }) => {
    await page.goto('/lists')
    const newListButton = page.getByRole('button', { name: 'New List' })
    await newListButton.click()
    await expect(page).toHaveURL(/lists\/.*/)
    await expect(page.getByRole('heading')).toHaveText('new list')

    let id = new URL(page.url()).pathname.split('/').at(-1)
    expect(id).toBeTruthy()
    id = id!
    let buf = await redis.getBuffer(id)
    expect(buf).toBeTruthy()
    buf = buf!
    const list = A.load<ListType>(utility.bufferToUint8Array(buf))
    expect(list.name).toBe('new list')
  })

  test('should view list that was created remotely', async ({ page }) => {
    const id = `test-${utility.uuid()}`
    const list: ListType = { id, name: 'Test List', items: [] }
    const doc = A.from(list)
    const buf = A.save(doc)
    await redis.setBuffer(id, utility.uint8ArrayToBuffer(buf))
    await page.goto(`/lists/${id}`)
    await expect(page.getByRole('heading')).toContainText('Test List')
    await page.goto('/lists')
    await expect(page.getByRole('link', { name: 'Test List' })).toBeVisible()
  })
})
