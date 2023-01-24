import Redis from 'ioredis'
import { NextApiRequest, NextApiResponse } from 'next'

const redisClient = new Redis(
  `rediss://default:${process.env.UPSTASH_REDIS_PASSWORD}@global-perfect-trout-32325.upstash.io:32325`
)

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const id = (req.query.id || '') as string

  if (req.method === 'GET') {
    return res.json({
      data: await redisClient.get(id),
    })
  } else if (req.method === 'POST') {
    const binary = req.body.data
    const isOk = await redisClient.set(id, binary)
    isOk === 'OK' ? res.status(200).end() : res.status(500).end()
  }
}
