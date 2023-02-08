import localforage from 'localforage'
import { useEffect, useState } from 'react'
import { igi } from './igi'
import { ListType } from './types'

const LIST_IDS_KEY = 'listIds'

async function getLocalIds(callback: (ids: string[]) => void) {
  const storedIds = await localforage.getItem<string[]>(LIST_IDS_KEY)
  if (!storedIds) {
    await localforage.setItem(LIST_IDS_KEY, [])
    callback([])
  } else {
    callback(storedIds)
  }
}

async function addId(id: string) {
  const storedIds = await localforage.getItem<string[]>(LIST_IDS_KEY)
  if (storedIds) {
    await localforage.setItem(LIST_IDS_KEY, [...storedIds, id])
  }
}

export function useLists() {
  const [ids, setIds] = useState<string[]>([])
  const [lists, setLists] = useState<ListType[]>([])

  useEffect(() => {
    getLocalIds((ids) => setIds(ids))
  }, [])

  useEffect(() => {
    const listenerData: { listId: string; listenerId: string }[] = []

    ids.forEach((id) => {
      const listenerId = igi.docs.listeners.add<ListType>(id, () => {
        getLocalIds((ids) => setIds(ids))
      })
      listenerData.push({ listId: id, listenerId })
    })

    return () => {
      listenerData.forEach(({ listId, listenerId }) => {
        igi.docs.listeners.remove(listId, listenerId)
      })
    }
  }, [ids])

  useEffect(() => {
    const lists = ids
      .map((id) => igi.docs.get<ListType>(id))
      .filter((doc): doc is ListType => !!doc)

    setLists(lists)
  }, [ids])

  return {
    lists,
    async create(preList: Omit<ListType, 'id'>): Promise<string> {
      const id = igi.docs.add(preList)
      await addId(id)
      await getLocalIds((ids) => setIds(ids))
      return id
    },
  }
}
