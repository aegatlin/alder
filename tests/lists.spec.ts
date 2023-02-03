import * as Automerge from '@automerge/automerge'
import test, { expect } from '@playwright/test'
import { ListType } from '../client/types'
import { UpstashRedis } from '../server/namespaces/UpstashRedis'
import { Utility } from '../server/namespaces/Utility'

let id: string

test.beforeEach(() => {
  id = `test-${Utility.uuid()}`
})

test.describe('lists', async () => {
  test('should create new list and view it', async ({ page }) => {
    await page.goto('/lists')
    const newListButton = page.getByRole('button', { name: 'New List' })
    await newListButton.click()
    await expect(page).toHaveURL(/lists/)
    await expect(page.getByRole('heading')).toHaveText('new list')

    let id = new URL(page.url()).pathname.split('/').at(-1)
    expect(id).toBeTruthy()
    id = id!
    let buf = await UpstashRedis.getBuffer(id)
    expect(buf).toBeTruthy()
    buf = buf!
    const list = Automerge.load<ListType>(Utility.bufferToUint8Array(buf))
    expect(list.name).toBe('new list')
  })

  test('should view list that was created remotely', async ({ page }) => {
    const list: ListType = { id, name: 'Test List', items: [] }
    const doc = Automerge.from(list)
    const buf = Automerge.save(doc)
    await UpstashRedis.setBuffer(id, Utility.uint8ArrayToBuffer(buf))
    await page.goto(`/lists/${id}`)
    await expect(page.getByRole('heading')).toContainText('Test List')
    await page.goto('/')
    await expect(page.getByRole('heading')).toContainText('Grocl')
    await expect(page.getByRole('link', { name: 'Test List' })).toBeVisible()
  })
})
