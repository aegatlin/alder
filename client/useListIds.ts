import { useEffect } from 'react'
import { useLocalForage } from './useLocalForage'

const LIST_IDS_KEY = 'listIds'

export function useListIds() {
  const { value: listIds, get, set } = useLocalForage<string[]>(LIST_IDS_KEY)

  useEffect(() => {
    get()
  })

  return {
    listIds,
    async ensure(listId: string) {
      if (listIds) {
        if (listIds.includes(listId)) return
        set([...listIds, listId])
      } else {
        set([listId])
      }
    },
  }
}
