import localforage from 'localforage'

export async function clear() {
  await localforage.clear()
}

export async function set<T>(key: string, value: T) {
  await localforage.setItem(key, value)
}

export async function get<T>(key: string): Promise<T | null> {
  return await localforage.getItem(key)
}
