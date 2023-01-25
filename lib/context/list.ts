import * as Automerge from '@automerge/automerge'
import localforage from 'localforage'
import { v4 as uuid } from 'uuid'
import * as redis from './redis'

enum Key {
  ListIds = 'ListIds',
}

export type List = {
  id: string
  name: string
  items: { id: string; value: string }[]
}

export type ListChangeset = Pick<List, 'name'>

export async function all(): Promise<List[]> {
  const isNotNull = (x: List | null): x is List => !!x
  const listIds = await allListIds()
  const lists = await Promise.all(listIds.map((id) => getListLocal(id)))
  return lists?.filter(isNotNull)
}

async function allListIds(): Promise<string[]> {
  const listIds = await localforage.getItem<string[]>(Key.ListIds)

  if (!listIds) {
    const emptyListIds = await localforage.setItem<string[]>(Key.ListIds, [])
    return emptyListIds
  } else {
    return listIds
  }
}

export async function create(): Promise<List> {
  const list = Automerge.from<List>({
    id: uuid(),
    name: 'new list',
    items: [],
  })

  await setListLocal(list)
  const listIds = await allListIds()
  listIds.push(list.id)
  await localforage.setItem<string[]>(Key.ListIds, listIds)
  return list
}

export async function setListLocal(list: List) {
  const binary = Automerge.save(list)
  await localforage.setItem(list.id, binary)
  return list
}

async function setListRemote(list: List) {
  const listRemote = await getListRemote(list.id)
  if (listRemote) {
    const newList = Automerge.merge(list, listRemote)
    const newListBinary = Automerge.save(newList)
    await redis.set(list.id, newListBinary)
  } else {
    const listBinary = Automerge.save(list)
    await redis.set(list.id, listBinary)
  }
}

export async function getListLocal(listId: string): Promise<List | null> {
  const binary = await localforage.getItem<Uint8Array>(listId)
  return binary ? Automerge.load<List>(binary) : null
}

async function getListRemote(listId: string): Promise<List | null> {
  const binary = await redis.get(listId)
  return binary ? Automerge.load(binary) : null
}

export async function addItem(listId: string, newItemValue: string) {
  const list = await getListLocal(listId)
  if (!list) throw 'no list'

  const newList = Automerge.change<List>(list, (l) => {
    l.items.push({ id: uuid(), value: newItemValue })
  })

  await setListLocal(newList)
}

export async function removeItem(listId: string, itemId: string) {
  const list = await getListLocal(listId)
  if (!list) throw 'no list'

  const newList = Automerge.change<List>(list, (l) => {
    const index = l.items.findIndex((item) => item.id === itemId)
    if (index !== -1) {
      l.items.splice(index, 1)
    }
  })

  await setListLocal(newList)
}

export async function updateItem(listId: string, item: List['items'][number]) {
  const list = await getListLocal(listId)
  if (!list) throw 'no list'

  const newList = Automerge.change<List>(list, (l) => {
    const index = l.items.findIndex((i) => item.id === i.id)
    if (index !== -1) {
      l.items.splice(index, 1, item)
    }
  })

  await setListLocal(newList)
}

export async function clear() {
  await localforage.clear()
}

export async function updateList(listId: string, listChangeset: ListChangeset) {
  const list = await getListLocal(listId)
  if (!list) throw 'no list'

  const newList = Automerge.change<List>(list, (l) => {
    if (listChangeset.name) l.name = listChangeset.name
  })

  await setListLocal(newList)
}
