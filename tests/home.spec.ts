import { test, expect } from '@playwright/test'
import * as redis from '../server/redisService'
import * as Automerge from '@automerge/automerge'
import * as bin from '../server/binaryService'
import { List } from '../lib/context/list'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test('home page has header', async ({ page }) => {
  await expect(page.getByRole('heading')).toContainText('Grocl')
})

test('create new list', async ({ page }) => {
  const newListButton = page.getByRole('button', { name: 'New List' })
  await newListButton.click()
  await expect(page).toHaveURL(/lists/)
  await expect(page.getByRole('heading')).toHaveText('new list')

  let id = new URL(page.url()).pathname.split('/').at(-1)
  expect(id).toBeTruthy()
  id = id!
  let buf = await redis.getBuffer(id)
  expect(buf).toBeTruthy()
  buf = buf!
  const list = Automerge.load<List>(bin.bufferToUint8Array(buf))
  expect(list.name).toBe('new list')
})
