import { expect, test } from '@playwright/test'
import { UpstashRedis } from '../../server/namespaces/UpstashRedis'
import { Utility } from '../../server/namespaces/Utility'

let id: string

test.beforeEach(() => {
  id = `test-${Utility.uuid()}`
})

test.describe('/api/docs/id GET', async () => {
  test('should get doc by id', async ({ request }) => {
    const u = new Uint8Array([0, 1, 2, 3])
    const res = await UpstashRedis.setBuffer(id, Utility.uint8ArrayToBuffer(u))
    expect(res).toBe('OK')

    const res2 = await request.get(`/api/docs/${id}`)
    expect(res2.ok()).toBeTruthy()
    const buf = await res2.body()
    expect(Utility.bufferToUint8Array(buf)).toEqual(u)
  })

  test('should 404 when no remote list is present', async ({ request }) => {
    const res2 = await request.get('/api/docs/not-a-key')
    expect(res2.status()).toBe(404)
  })
})

test.describe('/api/docs/id POST', async () => {
  test('should save docs by id', async ({ request }) => {
    const data = new Uint8Array([0, 1, 2, 3, 4])
    const res = await request.post(`/api/docs/${id}`, {
      headers: {
        'content-type': 'application/octet-stream',
      },
      data: Utility.uint8ArrayToBuffer(data),
    })

    expect(res.ok()).toBeTruthy()
    const buf = await UpstashRedis.getBuffer(id)
    expect(buf).toBeTruthy()
    expect(Utility.bufferToUint8Array(buf!)).toEqual(data)
  })
})
