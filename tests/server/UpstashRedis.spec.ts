import { expect, test } from '@playwright/test'
import { UpstashRedis } from '../../server/namespaces/UpstashRedis'
import { Utility } from '../../server/namespaces/Utility'

let id: string

test.beforeEach(() => {
  id = `test-${Utility.uuid()}`
})

test.describe('getBuffer', async () => {
  test('should get previously set buffer', async () => {
    const expected = Buffer.from([0, 1, 2])
    await UpstashRedis.setBuffer(id, expected)
    const actual = await UpstashRedis.getBuffer(id)
    expect(actual).toEqual(expected)
  })

  test('should return null if buffer has never been set', async () => {
    const actual = await UpstashRedis.getBuffer('not-a-key')
    expect(actual).toEqual(null)
  })
})

test.describe('setBuffer', async () => {
  test('should set buffer', async () => {
    const expected = Buffer.from([0, 1, 2])
    const res = await UpstashRedis.setBuffer(id, expected)
    expect(res).toEqual('OK')
    const actual = await UpstashRedis.getBuffer(id)
    expect(actual).toEqual(expected)
  })
})
