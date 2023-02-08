import Redis from 'ioredis'

// const redis = new Redis(
//   `rediss://default:${process.env.UPSTASH_REDIS_PASSWORD}@global-perfect-trout-32325.upstash.io:32325`
// )
const redis = new Redis('redis://localhost:6379')

export const UpstashRedis = {
  async getBuffer(key: string): Promise<Buffer | null> {
    return await redis.getBuffer(key)
  },
  async setBuffer(key: string, value: Buffer): Promise<'OK' | null> {
    return await redis.set(key, value)
  },
}
