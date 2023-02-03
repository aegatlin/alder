import { useRouter } from 'next/router'
import { createContext, useEffect, useState } from 'react'
import { Global } from './namespaces/Global'
import { Lists } from './namespaces/Lists'
import { ListType } from './types'

type ListsContextType = {
  lists: ListType[]
  newList: () => void
}

export const ListsContext = createContext<ListsContextType>({
  lists: [],
  newList: () => null,
})

export function ListsContextProvider({ children }) {
  const router = useRouter()
  const [lists, setLists] = useState<ListType[]>([])
  console.log('lists updated!', lists)

  useEffect(() => {
    Lists.all().then((lists) => setLists(lists))

    Global.eventEmitter.on('updated', () => {
      Lists.all().then((lists) => setLists(lists))
    })

    return () => {
      Global.eventEmitter.removeAllListeners()
    }
  }, [])

  const newList = async () => {
    const list = Lists.new({ name: 'new list' })
    await Lists.save(list)
    router.push(`/lists/${list.id}`)
  }

  return (
    <ListsContext.Provider value={{ lists, newList }}>
      {children}
    </ListsContext.Provider>
  )
}
