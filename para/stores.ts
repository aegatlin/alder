import localforage from 'localforage'
import { Store } from './para'

export const ParaDefaultLocalStore: Store = {
  async get(id: string) {
    return await localforage.getItem<Uint8Array>(id)
  },
  async set(id: string, bin: Uint8Array) {
    const res = await localforage.setItem<Uint8Array>(id, bin)
    return !!res
  },
}

export function buildParaDefaultRemoteStore({ url }: { url: string }): Store {
  return {
    async get(id: string) {
      const res = await fetch(`${url}/${id}`)
      const buf = await res.arrayBuffer()
      const u = new Uint8Array(buf)
      return u
    },
    async set(id: string, binary: Uint8Array) {
      const res = await fetch(`${url}/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/octet-stream',
        },
        body: binary,
      })
      return res.ok
    },
  }
}
