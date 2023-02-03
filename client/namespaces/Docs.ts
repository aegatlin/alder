import * as A from '@automerge/automerge'
import { Global } from './Global'
import { LocalStorage } from './LocalStorage'
import { RemoteStorage } from './RemoteStorage'

export type DocType<T> = A.Doc<T>

export const Docs = {
  new<T extends Record<string, any>>(t: T): DocType<T> {
    return A.from(t)
  },
  async one<T>(id: string): Promise<DocType<T>> {
    const bin = await LocalStorage.get<Uint8Array>(id)
    if (!bin) throw 'no local doc!'
    const doc = A.load<T>(bin)
    return doc
  },
  async save<T extends { id: string }>(doc: DocType<T>) {
    const bin: Uint8Array = Docs.toBin(doc)
    await LocalStorage.set<Uint8Array>(doc.id, bin)
    RemoteStorage.set(doc.id, bin)
    Global.eventEmitter.emit('updated')
    Global.broadcastUpdated()
  },
  fromBin<T>(bin: Uint8Array): A.Doc<T> {
    return A.load<T>(bin)
  },
  toBin<T>(doc: A.Doc<T>): Uint8Array {
    return A.save<T>(doc)
  },
  merge<T>(doc: DocType<T>, otherDoc: DocType<T>): DocType<T> {
    const newDoc = A.merge<T>(doc, otherDoc)
    return newDoc
  },
  change<T>(doc: DocType<T>, f: A.ChangeFn<T>): DocType<T> {
    const newDoc = A.change<T>(doc, f)
    return newDoc
  },
  changeAndSave<T extends { id: string }>(doc: DocType<T>, f: A.ChangeFn<T>) {
    const newDoc = Docs.change(doc, f)
    Docs.save<T>(newDoc)
  },
}
