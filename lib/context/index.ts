import * as localforage from './localforage'
import * as localStorage from './localStorage'
import * as redis from './redis'
import * as remoteStorage from './remoteStorage'
import * as amdoc from './amdoc'
import * as list from './list'

const ex = { localforage, localStorage, redis, remoteStorage, amdoc, list }

export default ex
