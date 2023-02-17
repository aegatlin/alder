import { useSyncExternalStore } from 'react'
import { para } from './para'

function buildSubscribe(id: string) {
  return function subscribe(callback) {
    return para.docs.subscribe(id, callback)
  }
}

function buildGetSnapshot<T>(id: string) {
  return function getSnapshot() {
    return para.docs.read<T>(id)
  }
}

export function useParaDoc<T>(id: string) {
  const doc = useSyncExternalStore<T | null>(
    buildSubscribe(id),
    buildGetSnapshot(id)
  )

  return {
    doc,
  }
}
