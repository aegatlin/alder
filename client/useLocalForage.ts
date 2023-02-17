import localforage from 'localforage'
import { useState } from 'react'

export function useLocalForage<T>(key: string) {
  const [value, setValue] = useState<T | null>(null)

  return {
    value,
    async get() {
      const v = await localforage.getItem<T>(key)
      setValue(v)
    },
    async set(newValue: T) {
      const v = await localforage.setItem<T>(key, newValue)
      setValue(v)
    },
  }
}
