import { useEffect, useState } from 'react'
import { igi } from './igi'
import { ListType } from './types'

export interface UseList {
  list: ListType | null
  change: (changer: (list: ListType) => void) => void
}

export function useList(id: string): UseList {
  const [list, setList] = useState(() => igi.docs.get<ListType>(id))

  useEffect(() => {
    const listenerId = igi.docs.listeners.add<ListType>(id, (newList) => {
      setList(newList)
    })

    return () => {
      igi.docs.listeners.remove(id, listenerId)
    }
  }, [id])

  function change(changer: (list: ListType) => void) {
    igi.docs.change<ListType>(id, (list) => {
      changer(list)
    })
  }

  return { list, change }
}
