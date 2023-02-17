import * as A from '@automerge/automerge'
import { v4 as uuid } from 'uuid'

export interface Store {
  get: (id: string) => Promise<Uint8Array | null>
  set: (id: string, bin: Uint8Array) => Promise<boolean>
}

interface BuildParaInputs {
  stores: Store[]
}

export interface Para {
  docs: {
    create<T extends Record<string, any>>(doc: T): string
    read<T>(id: string): T | null
    update<T>(id: string, onUpdate: (doc: T) => void): void
    subscribe(id: string, onChange: () => void): () => void
  }
}

export function buildPara({ stores }: BuildParaInputs): Para {
  const docs: {
    [id: string]: {
      doc: any
      listeners: {
        [id: string]: () => void
      }
    }
  } = {}

  function ensure(id: string) {
    if (docs[id]) return
    docs[id] = {
      doc: null,
      listeners: {},
    }
  }

  async function storesRead(id: string) {
    stores.forEach(async (s) => {
      const bin = await s.get(id)
      if (!bin) return
      const storedDoc = A.load(bin)
      const memDoc = docs[id].doc
      if (memDoc) {
        const newDoc = A.merge(memDoc, storedDoc)
        docs[id].doc = newDoc
      } else {
        docs[id].doc = storedDoc
      }
      emitChange(id)
    })
  }

  async function storesSet(id: string, bin: Uint8Array) {
    stores.forEach(async (s) => {
      s.set(id, bin)
    })
  }

  function emitChange(id: string) {
    Object.values(docs[id].listeners).forEach((l) => l())
  }

  return {
    docs: {
      create(doc) {
        const newDoc = A.from(doc)
        ensure(newDoc.id)
        docs[newDoc.id].doc = newDoc
        const bin = A.save(newDoc)
        storesSet(newDoc.id, bin)
        return newDoc.id
      },
      read(id) {
        ensure(id)
        const doc = docs[id].doc
        if (!doc) storesRead(id)
        return docs[id].doc
      },
      update(id, onUpdate) {
        ensure(id)
        const doc = docs[id].doc
        if (doc) {
          const newDoc = A.change(doc, onUpdate)
          docs[id].doc = newDoc
          storesSet(id, A.save(newDoc))
          emitChange(id)
        }
      },
      subscribe(id, onChange) {
        ensure(id)
        const lid = uuid()
        docs[id].listeners[lid] = onChange
        return () => {
          delete docs[id].listeners[lid]
        }
      },
    },
  }
}
