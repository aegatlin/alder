import Redis from 'ioredis'

export interface RedisService {
  getBuffer(key: string): Promise<Buffer | null>
  setBuffer(key: string, value: Buffer): Promise<boolean>
}

export function buildRedisService({
  connectionString,
}: {
  connectionString: string
}): RedisService {
  const redis = new Redis(connectionString)

  return {
    async getBuffer(key) {
      return await redis.getBuffer(key)
    },
    async setBuffer(key, value) {
      const ok = await redis.set(key, value)
      return ok === 'OK'
    },
  }
}
