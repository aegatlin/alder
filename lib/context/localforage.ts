import localforage from 'localforage'

export async function clear() {
  await localforage.clear()
}
