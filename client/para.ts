import { buildPara } from '../para/para'
import {
  buildParaDefaultRemoteStore,
  ParaDefaultLocalStore,
} from '../para/stores'

export const para = buildPara({
  stores: [
    ParaDefaultLocalStore,
    buildParaDefaultRemoteStore({ url: '/api/docs' }),
  ],
})
