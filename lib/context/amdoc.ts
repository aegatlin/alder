import * as Automerge from '@automerge/automerge'
import ns from '.'

export async function set<T>(id: string, doc: Automerge.Doc<T>) {
  const binary = Automerge.save(doc)
  await ns.localStorage.set(id, binary)
  ns.remoteStorage.set(id, binary)
}

export async function get<T>(id: string): Promise<Automerge.Doc<T> | null> {
  const binary = await ns.localStorage.get<Uint8Array>(id)

  if (binary) {
    ns.remoteStorage.get(id).then((doc) => {
      doc && ns.localStorage.set(id, doc)
    })
    return Automerge.load<T>(binary)
  } else {
    const remoteBinary = await ns.remoteStorage.get(id)
    if (!remoteBinary) return null
    await ns.localStorage.set(id, remoteBinary)
    return Automerge.load<T>(remoteBinary)
  }
}
