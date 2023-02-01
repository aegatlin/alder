import * as A from '@automerge/automerge'
import ns from '.'

export function create<T extends Record<string, any>>(t: T): A.Doc<T> {
  return A.from<T>(t)
}

export function change<T>(doc: A.Doc<T>, f: A.ChangeFn<T>): A.Doc<T> {
  return A.change(doc, f)
}

export async function set<T>(id: string, doc: A.Doc<T>) {
  const bin = A.save(doc)
  await ns.localStore.set(id, bin)
  ns.remoteBufferStore.set(id, bin)
}

export async function get<T>(id: string): Promise<A.Doc<T> | null> {
  const bin = await ns.localStore.get<Uint8Array>(id)

  if (bin) {
    const doc = A.load<T>(bin)
    return doc
  } else {
    const remoteBin = await ns.remoteBufferStore.get(id)
    if (!remoteBin) return null
    await ns.localStore.set(id, remoteBin)
    const doc = A.load<T>(remoteBin)
    return doc
  }
}
