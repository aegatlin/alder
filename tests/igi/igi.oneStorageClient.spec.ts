import * as A from '@automerge/automerge'
import test, { expect } from '@playwright/test'
import { v4 as uuid } from 'uuid'
import { buildIgi, Igi } from '../../igi/buildIgi'
import { StorageClient } from '../../igi/storageClients'

type Obj = { id: string; a: number }
type TestStorageClient = StorageClient & {
  getTestData: () => {
    callCounts: {
      get: number
      set: number
    }
  }
}

function buildFakeStorageClient(): TestStorageClient {
  const store = {
    callCounts: {
      get: 0,
      set: 0,
    },
  }

  return {
    async get(id) {
      store.callCounts.get += 1
      const bin = store[id]
      return bin ? bin : null
    },
    async set(id, bin) {
      store.callCounts.set += 1
      store[id] = bin
      return true
    },
    getTestData() {
      return { callCounts: store.callCounts }
    },
  }
}

let fakeStorage: TestStorageClient
let igi: Igi

test.beforeEach(() => {
  fakeStorage = buildFakeStorageClient()
  igi = buildIgi({ storageClients: [fakeStorage], networkClients: [] })
})

test.describe('igi.docs.add', async () => {
  test('should return id', async () => {
    const id = igi.docs.add({ a: 1 })
    expect(typeof id).toBe('string')
  })

  test('should call storage client set, not get, and not call listener', async () => {
    let listenerCallCount = 0
    const id = igi.docs.add({ a: 1 })
    igi.docs.listeners.add(id, () => {
      listenerCallCount += 1
    })
    expect(fakeStorage.getTestData().callCounts.get).toBe(0)
    expect(fakeStorage.getTestData().callCounts.set).toBe(1)
    expect(listenerCallCount).toBe(0)
  })

  test('should get doc sync', async () => {
    const id = igi.docs.add({ a: 1 })
    const doc = igi.docs.get<Obj>(id)
    expect(doc).toBeTruthy()
    expect(doc?.a).toBe(1)
    expect(doc?.id).toBe(id)
  })
})

test.describe('igi.docs.get', async () => {
  test('should return null for new ids', async () => {
    const doc = igi.docs.get('new-id')
    expect(doc).toBeNull()
  })

  test('for previously stored id, should set null then fire listener and set doc', async () => {
    // prepare previously stored doc
    const id = uuid()
    await fakeStorage.set(id, A.save(A.from({ id, a: 1 })))

    let listenerCallCount = 0
    let doc = igi.docs.get<Obj>(id)
    igi.docs.listeners.add<Obj>(id, (updatedDoc) => {
      doc = updatedDoc
      listenerCallCount += 1
    })

    expect(doc).toBeNull()
    expect(listenerCallCount).toBe(0)

    await expect(async () => {
      expect(doc).toBeTruthy()
    }).toPass({ timeout: 1000 })

    expect(doc?.a).toBe(1)
    expect(doc?.id).toBe(id)
    expect(fakeStorage.getTestData().callCounts.get).toBe(1)
    expect(listenerCallCount).toBe(1)
  })
})

test.describe('igi.docs.change', async () => {
  test('should change synchronously', async () => {
    let listenerCallCount = 0
    const id = igi.docs.add({ a: 1 })
    igi.docs.listeners.add(id, () => {
      listenerCallCount += 1
    })

    expect(listenerCallCount).toBe(0)

    igi.docs.change<Obj>(id, (doc) => {
      doc.a = 4
    })

    const doc = igi.docs.get<Obj>(id)
    expect(doc?.a).toBe(4)
    expect(listenerCallCount).toBe(1)
  })

  test('a changed doc gets saved to storage', async () => {
    const id = igi.docs.add({ a: 1 })
    igi.docs.change<Obj>(id, (doc) => {
      doc.a = 4
    })
    const doc = igi.docs.get<Obj>(id)
    expect(doc?.a).toBe(4)
    const storedBin = await fakeStorage.get(id)
    const storedDoc = A.load<Obj>(storedBin!)
    expect(storedDoc?.a).toBe(4)
  })
})
