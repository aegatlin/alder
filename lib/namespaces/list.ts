import * as Automerge from '@automerge/automerge'
import { v4 as uuid } from 'uuid'
import ns from '.'
import { ItemChangeset, List, ListChangeset } from '../types'

enum Key {
  ListIds = 'ListIds',
}

export async function all(): Promise<List[]> {
  const isNotNull = (x: List | null): x is List => !!x
  const listIds = await getListIds()
  const lists = await Promise.all(listIds.map((id) => ns.amdoc.get<List>(id)))
  return lists?.filter(isNotNull)
}

async function getListIds(): Promise<string[]> {
  const listIds = await ns.localStore.get<string[]>(Key.ListIds)
  if (listIds) return listIds
  await ns.localStore.set(Key.ListIds, [])
  return []
}

async function ensureListIdsInclude(listId: string) {
  const listIds = await getListIds()
  if (listIds.some((lid) => lid === listId)) return
  listIds.push(listId)
  ns.localStore.set(Key.ListIds, listIds)
}

export async function create(): Promise<List> {
  const list = Automerge.from<List>({
    id: uuid(),
    name: 'new list',
    items: [],
  })

  await setList(list)
  return list
}

async function setList(list: List) {
  await ns.amdoc.set(list.id, list)
  await ensureListIdsInclude(list.id)
}

export async function addItem(listId: string, newItemValue: string) {
  const list = await ns.amdoc.get<List>(listId)
  if (!list) throw 'no list'

  const newList = Automerge.change<List>(list, (l) => {
    l.items.push({ id: uuid(), value: newItemValue })
  })

  await setList(newList)
}

export async function removeItem(listId: string, itemId: string) {
  const list = await ns.amdoc.get<List>(listId)
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
  const list = await ns.amdoc.get<List>(listId)
  if (!list) throw 'no list'

  const newList = Automerge.change<List>(list, (l) => {
    const index = l.items.findIndex((i) => i.id === itemId)
    if (index === -1) throw 'item not found'

    if (itemChangeset.value) l.items[index].value = itemChangeset.value
  })

  await setList(newList)
}

export async function updateList(listId: string, listChangeset: ListChangeset) {
  const list = await ns.amdoc.get<List>(listId)
  if (!list) throw 'no list'

  const newList = Automerge.change<List>(list, (l) => {
    if (listChangeset.name) l.name = listChangeset.name
  })

  await setList(newList)
}
