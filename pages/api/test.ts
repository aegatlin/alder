// Keep around until you transition to saving via raw binary instead of encoded string

import Redis from 'ioredis'

let client = new Redis(
  'rediss://default:4c65e308b3e84f7db8a0f14889989032@global-perfect-trout-32325.upstash.io:32325'
)

const u = Uint8Array.from([21, 22])
const b = Buffer.from(u)
client.set('fool', b)

export default function handler(req, res) {
  res.send('ok')
}
