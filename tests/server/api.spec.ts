import { expect, test } from '@playwright/test'
import { Utility } from '../../server/services/Utility'

let id: string

test.beforeEach(() => {
  id = `test-${Utility.uuid()}`
})

test('should POST and GET bins', async ({ request }) => {
  const u = new Uint8Array([0, 1, 2, 3, 4])
  const res = await request.post(`/api/docs/${id}`, {
    headers: {
      'content-type': 'application/octet-stream',
    },
    data: Utility.uint8ArrayToBuffer(u),
  })

  expect(res.ok()).toBeTruthy()

  const res2 = await request.get(`/api/docs/${id}`)
  expect(res2.ok()).toBeTruthy()
  const buf = await res2.body()
  expect(Utility.bufferToUint8Array(buf)).toEqual(u)
})

test('should 404 on GET when no doc id', async ({ request }) => {
  const res = await request.get('/api/docs/not-a-key')
  expect(res.status()).toBe(404)
})
