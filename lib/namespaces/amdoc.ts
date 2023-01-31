import * as Automerge from '@automerge/automerge'
import ns from '.'

export async function set<T>(id: string, doc: Automerge.Doc<T>) {
  const bin = Automerge.save(doc)
  await ns.localStore.set(id, bin)
  ns.remoteBufferStore.set(id, bin)
}

export async function get<T>(id: string): Promise<Automerge.Doc<T> | null> {
  const bin = await ns.localStore.get<Uint8Array>(id)

  if (bin) {
    const doc = Automerge.load<T>(bin)
    // merge remote async here
    return doc
  } else {
    const remoteBin = await ns.remoteBufferStore.get(id)
    if (!remoteBin) return null
    await ns.localStore.set(id, remoteBin)
    const doc = Automerge.load<T>(remoteBin)
    return doc
  }
}
