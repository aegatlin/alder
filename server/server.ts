import { buildRedisService } from './services/Redis'
import { Utility } from './services/Utility'

if (!process.env.REDIS_CONNECTION_STRING) {
  throw 'no redis connection string'
}

const connectionString = process.env.REDIS_CONNECTION_STRING

export const redis = buildRedisService({
  connectionString,
})

export const utility = Utility
