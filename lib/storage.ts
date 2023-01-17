import localforage from 'localforage'
import * as Automerge from '@automerge/automerge'
import { v4 as uuid } from 'uuid'

export type List = Automerge.Doc<{
  id: string
  name: string
  items: { id: string; value: string }[]
}>

export const StorageApi = {
  async clear() {
    await localforage.clear()
  },
  Lists: {
    async all(): Promise<string[]> {
      const lists = await localforage.getItem<string[]>('lists')
      if (!lists) {
        const emptyLists = await localforage.setItem<string[]>('lists', [])
        return emptyLists
      } else {
        return lists
      }
    },
    async addList(listId: string) {
      const lists = await StorageApi.Lists.all()
      lists.push(listId)
      await localforage.setItem<string[]>('lists', lists)
    },
  },
  List: {
    async create(): Promise<List> {
      const list = Automerge.from({
        id: uuid(),
        name: 'new list',
        items: [],
      })
      const binary = Automerge.save(list)
      await localforage.setItem(list.id, binary)
      await StorageApi.Lists.addList(list.id)
      return list
    },
    async save(listDoc: Automerge.Doc<List>): Promise<List> {
      const binary = Automerge.save(listDoc)
      await localforage.setItem(listDoc.id, binary)
      return listDoc
    },
    async load(listId: string): Promise<List> {
      const binary = await localforage.getItem<Uint8Array>(listId)
      if (!binary) throw 'no saved list to load'

      const list = Automerge.load<List>(binary)
      return list
    },
    async addItem(listId: string, newItemValue: string): Promise<List> {
      const list = await StorageApi.List.load(listId)
      if (!list) throw 'no list'

      const newList = Automerge.change<List>(list, (l) => {
        l.items.push({ id: uuid(), value: newItemValue })
      })

      await StorageApi.List.save(newList)
      return newList
    },
    async removeItem(listId: string, itemId: string): Promise<List> {
      const list = await StorageApi.List.load(listId)
      if (!list) throw 'no list'

      const newList = Automerge.change<List>(list, (l) => {
        const index = l.items.findIndex((item) => item.id === itemId)
        if (index !== -1) {
          l.items.splice(index, 1)
        }
      })

      await StorageApi.List.save(newList)
      return newList
    },
  },
}
