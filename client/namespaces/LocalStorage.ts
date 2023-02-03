import localforage from 'localforage'

export const LocalStorage = {
  async clear() {
    await localforage.clear()
  },
  async set<T>(key: string, value: T) {
    await localforage.setItem(key, value)
  },
  async get<T>(key: string): Promise<T | null> {
    return await localforage.getItem(key)
  },
}
