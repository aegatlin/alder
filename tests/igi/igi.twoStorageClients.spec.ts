import * as A from '@automerge/automerge'
import test, { expect } from '@playwright/test'
import { v4 as uuid } from 'uuid'
import { buildIgi, Igi } from '../../igi/buildIgi'
import { StorageClient } from '../../igi/storageClients'

type Obj = { id: string; a: number }

const buildFakeStorageClient: () => StorageClient = () => {
  const store = {}

  return {
    async get(id) {
      const bin = store[id]
      return bin ? bin : null
    },
    async set(id, bin) {
      store[id] = bin
      return true
    },
  }
}

test.describe('igi.docs.add', async () => {
  let fakeStorage1: StorageClient
  let fakeStorage2: StorageClient
  let igi: Igi

  test.beforeEach(() => {
    fakeStorage1 = buildFakeStorageClient()
    fakeStorage2 = buildFakeStorageClient()
    igi = buildIgi({
      storageClients: [fakeStorage1, fakeStorage2],
      networkClients: [],
    })
  })

  test('should store docs in both storage clients', async () => {
    const id = igi.docs.add({ a: 1 })
    const doc = igi.docs.get<Obj>(id)
    const bin1 = await fakeStorage1.get(id)
    const doc1 = A.load<Obj>(bin1!)
    const bin2 = await fakeStorage2.get(id)
    const doc2 = A.load<Obj>(bin2!)
    expect(doc?.a).toBe(1)
    expect(doc1?.a).toBe(1)
    expect(doc2?.a).toBe(1)
    expect(doc?.id).toBe(id)
    expect(doc1?.id).toBe(id)
    expect(doc2?.id).toBe(id)
  })
})
