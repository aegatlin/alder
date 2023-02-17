import { buildRedisService } from './services/Redis'
import { Utility } from './services/Utility'

// const redis = new Redis(
//   `rediss://default:${process.env.UPSTASH_REDIS_PASSWORD}@global-perfect-trout-32325.upstash.io:32325`
// )
const connectionString = process.env.REDIS_CONNECTION_STRING
export const redis = buildRedisService({
  connectionString: 'redis://localhost:6379',
})

export const utility = Utility
