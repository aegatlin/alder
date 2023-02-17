import { buildRedisService } from './services/Redis'
import { Utility } from './services/Utility'

const connectionString =
  process.env.REDIS_CONNECTION_STRING || 'redis://localhost:6379'

export const redis = buildRedisService({
  connectionString,
})

export const utility = Utility
