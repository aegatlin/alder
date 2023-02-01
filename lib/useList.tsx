import { useContext, useEffect } from 'react'
import ns from './namespaces'
import { ListsContext } from './ListsContext'
import { ItemChangeset, List, ListChangeset } from './types'

interface UseList {
  list: List | null
  updateList: (listChangeset: ListChangeset) => void
  item: {
    add: (value: string) => void
    remove: (itemId: string) => void
    update: (itemId: string, itemChangeset: ItemChangeset) => void
  }
}

export function useList(id: string | null): UseList {
  const { lists, load } = useContext(ListsContext)
  const list = lists?.find((l) => l.id === id) ?? null

  useEffect(() => {
    if (list) return
    if (!id) return

    ns.list.remoteSync(id)
  }, [id, list])

  return {
    list,
    updateList: (listChangeset) => {
      list && ns.list.updateList(list.id, listChangeset).then(load)
    },
    item: {
      add: (value) => {
        list && ns.list.addItem(list.id, value).then(load)
      },
      remove: (itemId) => {
        list && ns.list.removeItem(list.id, itemId).then(load)
      },
      update: (itemId, itemChangeset) => {
        list && ns.list.updateItem(list.id, itemId, itemChangeset).then(load)
      },
    },
  }
}
