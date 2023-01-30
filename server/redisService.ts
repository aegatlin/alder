import Redis from 'ioredis'

let redis = new Redis(
  'rediss://default:c9c36b5cae2c4c5eb13225fba32f85ad@global-perfect-trout-32325.upstash.io:32325'
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
