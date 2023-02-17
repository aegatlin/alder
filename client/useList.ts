import { para } from './para'
import { ListType } from './types'
import { useParaDoc } from './useParaDoc'

export interface UseList {
  list: ListType | null
  update(onUpdate: (list: ListType) => void): void
}

export function useList(id: string): UseList {
  const { doc: list } = useParaDoc<ListType>(id)

  return {
    list,
    update(onUpdate: (list: ListType) => void) {
      para.docs.update<ListType>(id, onUpdate)
    },
  }
}
