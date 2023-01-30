import * as Automerge from '@automerge/automerge'
import localforage from 'localforage'
import { v4 as uuid } from 'uuid'
import * as Redis from './redis'

enum Key {
  ListIds = 'ListIds',
}

export type List = {
  id: string
  name: string
  items: { id: string; value: string }[]
}

export type ListChangeset = Pick<List, 'name'>
export type ItemChangeset = Pick<List['items'][number], 'value'>

export async function all(): Promise<List[]> {
  const isNotNull = (x: List | null): x is List => !!x
  const listIds = await allListIds()
  const lists = await Promise.all(listIds.map((id) => getList(id)))
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

  await setList(list)
  const listIds = await allListIds()
  listIds.push(list.id)
  await localforage.setItem<string[]>(Key.ListIds, listIds)
  return list
}

async function setList(list: List) {
  await setListLocal(list)
  setListRemote(list)
}

async function setListLocal(list: List) {
  const binary = Automerge.save(list)
  await localforage.setItem(list.id, binary)
}

async function setListRemote(list: List) {
  const binary = Automerge.save(list)
  await Redis.set(list.id, binary)
}

export async function getList(listId: string): Promise<List | null> {
  const local = await getListLocal(listId)

  if (local) {
    getListRemote(listId).then((remoteList) => {
      remoteList && setListLocal(remoteList)
    })
    return local
  } else {
    const remote = await getListRemote(listId)
    remote && (await setListLocal(remote))
    return remote
  }
}

// Should only be used in getList
async function getListLocal(listId: string): Promise<List | null> {
  const binary = await localforage.getItem<Uint8Array>(listId)
  return binary ? Automerge.load<List>(binary) : null
}

// Should only be used in getList
async function getListRemote(listId: string): Promise<List | null> {
  const binary = await Redis.get(listId)
  return binary ? Automerge.load<List>(binary) : null
}

export async function addItem(listId: string, newItemValue: string) {
  const list = await getList(listId)
  if (!list) throw 'no list'

  const newList = Automerge.change<List>(list, (l) => {
    l.items.push({ id: uuid(), value: newItemValue })
  })

  await setList(newList)
}

export async function removeItem(listId: string, itemId: string) {
  const list = await getList(listId)
  if (!list) throw 'no list'

  const newList = Automerge.change<List>(list, (l) => {
    const index = l.items.findIndex((item) => item.id === itemId)
    if (index !== -1) {
      l.items.splice(index, 1)
    }
  })

  await setList(newList)
}

export async function updateItem(
  listId: string,
  itemId: string,
  itemChangeset: ItemChangeset
) {
  const list = await getList(listId)
  if (!list) throw 'no list'

  const newList = Automerge.change<List>(list, (l) => {
    const index = l.items.findIndex((i) => i.id === itemId)
    if (index === -1) throw 'item not found'

    if (itemChangeset.value) l.items[index].value = itemChangeset.value
  })

  await setList(newList)
}

export async function clear() {
  await localforage.clear()
}

export async function updateList(listId: string, listChangeset: ListChangeset) {
  const list = await getList(listId)
  if (!list) throw 'no list'

  const newList = Automerge.change<List>(list, (l) => {
    if (listChangeset.name) l.name = listChangeset.name
  })

  await setList(newList)
}
