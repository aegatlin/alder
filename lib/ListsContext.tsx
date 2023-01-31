import { createContext, useEffect, useState } from 'react'
import ns from './namespaces'
import { List } from './types'

type ListsContextType = { lists: List[]; load: () => void }
const defaultListsContext: ListsContextType = {
  lists: [],
  load: () => null,
}

export const ListsContext = createContext<ListsContextType>(defaultListsContext)

export function ListsProvider({ children }) {
  const [lists, setLists] = useState<List[]>([])

  useEffect(() => {
    load()
  }, [])

  const load = () => ns.list.all().then((lists) => setLists(lists))

  return (
    <ListsContext.Provider value={{ lists, load }}>
      {children}
    </ListsContext.Provider>
  )
}
