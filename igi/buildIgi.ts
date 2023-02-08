import * as A from '@automerge/automerge'
import { v4 as uuid } from 'uuid'
import { NetworkClient } from './networkClients'
import {
  buildLocalStorageClient,
  buildRemoteStorageClient,
  StorageClient,
} from './storageClients'

export type Igi = {
  docs: {
    add<T>(t: Omit<T, 'id'>): string
    get<T>(id: string): T | null
    change<T>(id: string, changer: (t: T) => void): void
    listeners: {
      add<T>(id: string, listener: (t: T) => void): string
      remove(id: string, listenerId: string): void
    }
  }
}

export function buildIgi(
  {
    storageClients,
    networkClients,
  }: {
    storageClients: StorageClient[]
    networkClients: NetworkClient[]
  } = {
    storageClients: [buildLocalStorageClient()],
    networkClients: [],
  }
): Igi {
  const docs: {
    [id: string]: {
      doc: any | null
      listeners: { id: string; listener: (t: any) => void }[]
    }
  } = {}

  function initNetworkClients() {
    // networkClients.forEach((networkClient) =>
    //   networkClient.init(({ id, bin }) => {
    //     const doc = A.load(bin)
    //     docs[id].doc = doc
    //     notify(id)
    //   })
    // )
  }

  function ensure(id: string) {
    if (!docs[id]) {
      docs[id] = {
        doc: null,
        listeners: [],
      }
    }
  }

  function callListeners(id: string) {
    const { doc, listeners } = docs[id]
    listeners.forEach(({ listener }) => {
      listener(doc)
    })
  }

  async function getStores(id: string) {
    storageClients.forEach(async (storageClient) => {
      const storedBin = await storageClient.get(id)
      if (storedBin) {
        const doc = docs[id].doc
        const storedDoc = A.load(storedBin)
        if (doc) {
          const newDoc = A.merge(doc, storedDoc)
          docs[id].doc = newDoc
        } else {
          docs[id].doc = storedDoc
        }
        callListeners(id)
      }
    })
  }

  async function setStores(id: string, bin: Uint8Array) {
    storageClients.forEach(async (storageClient) => {
      storageClient.set(id, bin)
    })
  }

  initNetworkClients()

  return {
    docs: {
      add<T>(t: Omit<T, 'id'>): string {
        const id = uuid()
        ensure(id)
        const doc = A.from({ id, ...t })
        docs[id].doc = doc
        const bin = A.save(doc)
        setStores(id, bin)
        return id
      },
      get<T>(id: string): T | null {
        ensure(id)
        getStores(id)
        return docs[id].doc
      },
      change<T>(id: string, changer: (t: T) => void) {
        ensure(id)
        const doc = docs[id].doc
        if (doc) {
          const newDoc = A.change<T>(doc, changer)
          docs[id].doc = newDoc
          if (newDoc) {
            callListeners(id)
            setStores(id, A.save(newDoc))
          }
        }
      },
      listeners: {
        add<T>(id: string, listener: (t: T) => void): string {
          const listenerId = uuid()
          ensure(id)
          docs[id].listeners.push({ id: listenerId, listener })
          return listenerId
        },
        remove(id: string, listenerId: string) {
          ensure(id)
          const i = docs[id].listeners.findIndex((l) => l.id === listenerId)
          if (i > -1) docs[id].listeners.splice(i, 1)
        },
      },
    },
  }
}
