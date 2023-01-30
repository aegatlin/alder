import { expect, test } from '@playwright/test'
import * as redis from '../../server/redisService'
import * as bin from '../../server/binaryService'

let id: string

test.beforeEach(() => {
  id = `test-${bin.uuid()}`
})

test.describe('getBuffer', async () => {
  test('should get previously set buffer', async () => {
    const expected = Buffer.from([0, 1, 2])
    await redis.setBuffer(id, expected)
    const actual = await redis.getBuffer(id)
    expect(actual).toEqual(expected)
  })

  test('should return null if buffer has never been set', async () => {
    const actual = await redis.getBuffer('not-a-key')
    expect(actual).toEqual(null)
  })
})

test.describe('setBuffer', async () => {
  test('should set buffer', async () => {
    const expected = Buffer.from([0, 1, 2])
    const res = await redis.setBuffer(id, expected)
    expect(res).toEqual('OK')
    const actual = await redis.getBuffer(id)
    expect(actual).toEqual(expected)
  })
})
