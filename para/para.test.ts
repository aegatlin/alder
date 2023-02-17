import * as A from '@automerge/automerge'
import { beforeEach, describe, expect, test } from '@jest/globals'
import { clearTimeout, setTimeout } from 'timers'
import { v4 as uuid } from 'uuid'
import { buildPara, Para, Store } from './para'

type FakeStore = Store & { internals: any }
type D = { id: string; a: number }

function buildFakeStore(): FakeStore {
  const _store = {}

  return {
    async get(id) {
      return _store[id]
    },
    async set(id, value) {
      _store[id] = value
      return true
    },
    internals: {
      store: _store,
    },
  }
}

let fakeStore: FakeStore
let id: string
let para: Para

beforeEach(() => {
  id = uuid()
  fakeStore = buildFakeStore()
  para = buildPara({ stores: [fakeStore] })
})

describe('create', () => {
  test('returns doc id', () => {
    const docId = para.docs.create({ id, a: 1 })
    expect(docId).toBe(id)
    const doc = para.docs.read<D>(docId)
    expect(doc?.a).toBe(1)
  })

  test('saves doc to stores', () => {
    const docId = para.docs.create({ id, a: 1 })
    const doc = para.docs.read<D>(docId)
    const expectedBin = A.save(doc!)
    const savedBin = fakeStore.internals.store[id]
    expect(savedBin).toStrictEqual(expectedBin)
  })
})

describe('read', () => {
  test('initial doc read is null', () => {
    const para = buildPara({ stores: [fakeStore] })
    expect(para.docs.read(id)).toBeNull()
  })

  test('when doc in store, emit change on store read, then read doc', async () => {
    await fakeStore.set(id, A.save(A.from({ id, a: 1 })))

    let listened = false
    para.docs.subscribe(id, () => {
      listened = true
    })
    para.docs.read<D>(id)

    await until(() => listened, 'subscription failed')

    const doc = para.docs.read<D>(id)
    expect(doc?.id).toBe(id)
    expect(doc?.a).toBe(1)
  })

  test.skip('read changes can clobber each other', () => {})
})

describe('update', () => {
  test('updates mem-doc synchronously', () => {
    para.docs.create({ id, a: 4 })
    para.docs.update<D>(id, (doc) => {
      doc.a = 5
    })
    const doc = para.docs.read<D>(id)
    expect(doc?.a).toBe(5)
  })

  test('updates stores', async () => {
    para.docs.create({ id, a: 4 })
    para.docs.update<D>(id, (doc) => {
      doc.a = 5
    })
    const bin = await fakeStore.get(id)
    const storedDoc = A.load<D>(bin!)
    expect(storedDoc.a).toBe(5)
  })

  test('calls subscriptions', () => {
    para.docs.create({ id, a: 4 })
    let sub1 = 0
    para.docs.subscribe(id, () => {
      sub1 += 1
    })
    let sub2 = 0
    para.docs.subscribe(id, () => {
      sub2 += 1
    })
    para.docs.update<D>(id, (doc) => {
      doc.a = 5
    })
    expect(sub1).toBe(1)
    expect(sub2).toBe(1)
  })

  test.skip('cannot update id', () => {})
})

describe('subscribe', () => {
  test('calling unsubscribe works', () => {
    para.docs.create({ id, a: 2 })
    let sub = 0
    const unsub = para.docs.subscribe(id, () => {
      sub += 1
    })
    unsub()
    para.docs.update<D>(id, (doc) => {
      doc.a = 100
    })

    expect(sub).toBe(0)
  })

  test.skip('cannot subscribe to a doc that dont exits', () => {})
})

async function until(callback: () => boolean, rejectionMessage: string) {
  return new Promise<boolean>((resolve, reject) => {
    debounce({
      check: () => callback(),
      resolve: () => resolve(true),
      reject: () => reject(`await until() failed: ${rejectionMessage}`),
      max: 1000,
    })
  })
}

function debounce({ check, resolve, reject, max }) {
  const timers = debounceNums(max).map((num) => {
    return setTimeout(() => {
      if (check()) {
        timers.forEach((t) => clearTimeout(t))
        resolve()
      }
    }, num)
  })

  setTimeout(() => {
    timers.forEach((t) => clearTimeout(t))
    reject()
  }, max)
}

function debounceNums(max: number): number[] {
  const nums = [100]
  let next = 200
  while (next < max) {
    nums.push(next)
    next = next * 2
  }
  return nums
}
