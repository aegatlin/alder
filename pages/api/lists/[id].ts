import { NextApiRequest, NextApiResponse } from 'next'
import getRawBody from 'raw-body'
import * as bin from '../../../server/binaryService'
import * as redisService from '../../../server/redisService'

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
    const binary = await redisService.getBuffer(id)
    binary ? res.send(binary) : res.status(404).end()
  } else if (req.method === 'POST') {
    const buf = await getRawBody(req)
    console.log(req.url, req.headers, bin.bufferToUint8Array(buf))
    const isOk = await redisService.setBuffer(id, buf)
    isOk === 'OK' ? res.status(200).end() : res.status(500).end()
  }
}
