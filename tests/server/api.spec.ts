import { expect, test } from '@playwright/test'
import * as redisService from '../../server/redisService'
import * as bin from '../../server/binaryService'

let id: string

test.beforeEach(() => {
  id = `test-${bin.uuid()}`
})

test.describe('/api/lists/id GET', async () => {
  test('should get list by id', async ({ request }) => {
    const u = new Uint8Array([0, 1, 2, 3])
    const res = await redisService.setBuffer(id, bin.uint8ArrayToBuffer(u))
    expect(res).toBe('OK')

    const res2 = await request.get(`/api/lists/${id}`)
    expect(res2.ok()).toBeTruthy()
    const buf = await res2.body()
    expect(bin.bufferToUint8Array(buf)).toEqual(u)
  })

  test('should 404 when no remote list is present', async ({ request }) => {
    const res2 = await request.get('/api/lists/not-a-key')
    expect(res2.status()).toBe(404)
  })
})

test.describe('/api/lists/id POST', async () => {
  test('should save lists by id', async ({ request }) => {
    const data = new Uint8Array([0, 1, 2, 3, 4])
    const res = await request.post(`/api/lists/${id}`, {
      headers: {
        'content-type': 'application/octet-stream',
      },
      data: bin.uint8ArrayToBuffer(data),
    })

    expect(res.ok()).toBeTruthy()
    const buf = await redisService.getBuffer(id)
    expect(buf).toBeTruthy()
    expect(bin.bufferToUint8Array(buf!)).toEqual(data)
  })
})
