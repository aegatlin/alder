import Redis from 'ioredis'

let redis = new Redis(
  `rediss://default:${process.env.UPSTASH_REDIS_PASSWORD}@global-perfect-trout-32325.upstash.io:32325`
)

export async function getBuffer(id: string): Promise<Buffer | null> {
  return await redis.getBuffer(id)
}

export async function setBuffer(
  id: string,
  buffer: Buffer
): Promise<'OK' | null> {
  return await redis.set(id, buffer)
}
