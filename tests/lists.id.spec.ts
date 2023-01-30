import * as Automerge from '@automerge/automerge'
import test, { expect } from '@playwright/test'
import { List } from '../lib/context/list'
import * as bin from '../server/binaryService'
import * as redisService from '../server/redisService'

let id: string

test.beforeEach(() => {
  id = `test-${bin.uuid()}`
})

test.describe('visiting a list for the first time', async () => {
  test('should be able to view list', async ({ page }) => {
    const list: List = { id, name: 'Test List', items: [] }
    const doc = Automerge.from(list)
    const buf = Automerge.save(doc)
    await redisService.setBuffer(id, bin.uint8ArrayToBuffer(buf))
    await page.goto(`/lists/${id}`)
    await expect(page.getByRole('heading')).toContainText('Test List')
  })
})
