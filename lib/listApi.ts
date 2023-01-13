import localforage from 'localforage'
import { v4 as uuid } from 'uuid'

export type ListItem = {
  id: string
  value: string
}

export const ListApi = {
  async addItem(s: string) {
    const list = await localforage.getItem<ListItem[]>('list')
    if (list) list.push({ id: uuid(), value: s })
    await localforage.setItem('list', list)
  },
  async getList(): Promise<ListItem[] | null> {
    const list = await localforage.getItem<ListItem[]>('list')
    return list
  },
  async removeItem(id: string) {
    const list = await localforage.getItem<ListItem[]>('list')
    if (list) {
      const index = list.findIndex((item) => item.id === id)
      if (index !== -1) {
        list.splice(index, 1)
      }
    }
    await localforage.setItem('list', list)
  },
  async reset() {
    await localforage.setItem('list', [])
  },
}
