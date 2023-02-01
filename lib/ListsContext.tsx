import { createContext, useEffect, useState } from 'react'
import ns from './namespaces'
import { List } from './types'

type ListsContextType = {
  lists: List[]
  load: () => Promise<void>
  createList: () => Promise<List>
}

export const ListsContext = createContext<ListsContextType>(null)

export function ListsProvider({ children }) {
  const [lists, setLists] = useState<List[]>([])

  useEffect(() => {
    load()
  }, [])

  const load = async () => {
    const lists = await ns.list.all()
    setLists(lists)
  }

  const createList = async () => {
    const newList = await ns.list.create()
    await load()
    return newList
  }

  return (
    <ListsContext.Provider value={{ lists, load, createList }}>
      {children}
    </ListsContext.Provider>
  )
}
