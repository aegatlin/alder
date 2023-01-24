import { createContext, useContext, useEffect, useState } from 'react'
import * as List from './context/list'

type ContextType = {
  list: List.ListType | null
  isLoading: boolean
  addItem: (listId: string, value: string) => void
  removeItem: (listId: string, itemId: string) => void
  updateItem: (listId: string, item: List.ListType['items'][number]) => void
}

const defaultContext: ContextType = {
  list: { id: '', name: '', items: [] },
  isLoading: false,
  addItem: () => null,
  removeItem: () => null,
  updateItem: () => null,
}

const Context = createContext<ContextType>(defaultContext)

export function ListContext({ id, children }) {
  const [list, setList] = useState<List.ListType>()

  useEffect(() => {
    if (!id) return

    const a = async () => {
      const newList = await List.getListLocal(id)
      newList && setList(newList)
    }

    a()
  }, [id])

  const reload = () => {
    if (!list) return

    const a = async () => {
      const newList = await List.getListLocal(list.id)
      newList && setList(newList)
    }

    a()
  }

  const addItem = (listId: string, value: string) => {
    List.addItem(listId, value).then(reload)
  }

  const removeItem = (listId: string, itemId: string) => {
    List.removeItem(listId, itemId).then(reload)
  }

  const updateItem = (listId: string, item: List.ListType['items'][number]) => {
    List.updateItem(listId, item).then(reload)
  }

  return (
    <Context.Provider
      value={{
        list: list || null,
        isLoading: !!list,
        addItem,
        removeItem,
        updateItem,
      }}
    >
      {children}
    </Context.Provider>
  )
}

export function useList() {
  const { list, isLoading, addItem, removeItem, updateItem } =
    useContext(Context)

  return {
    list,
    isLoading,
    addItem,
    removeItem,
    updateItem,
  }
}
