import { NextApiRequest, NextApiResponse } from 'next'
import getRawBody from 'raw-body'
import { redis } from '../../../server/server'

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const id = (req.query.id || '') as string

  if (req.method === 'GET') {
    const binary = await redis.getBuffer(id)
    binary ? res.send(binary) : res.status(404).end()
  } else if (req.method === 'POST') {
    const buf = await getRawBody(req)
    const isSet = await redis.setBuffer(id, buf)
    isSet ? res.status(200).end() : res.status(500).end()
  }
}
