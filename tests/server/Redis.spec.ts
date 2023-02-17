import { expect, test } from '@playwright/test'
import { buildRedisService, RedisService } from '../../server/services/Redis'
import { Utility } from '../../server/services/Utility'

let id: string
let redis: RedisService

test.beforeAll(() => {
  redis = buildRedisService({
    connectionString: 'redis://localhost:6379',
  })
})

test.beforeEach(() => {
  id = `test-${Utility.uuid()}`
})

test('should set and get a buffer', async () => {
  const expected = Buffer.from([0, 1, 2])
  const res = await redis.setBuffer(id, expected)
  expect(res).toBe(true)
  const actual = await redis.getBuffer(id)
  expect(actual).toEqual(expected)
})

test('should return null if buffer has never been set', async () => {
  const actual = await redis.getBuffer('not-a-key')
  expect(actual).toEqual(null)
})
