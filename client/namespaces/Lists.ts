import { ListChangesetType, ListItemChangesetType, ListType } from '../types'
import { Docs } from './Docs'
import { LocalStorage } from './LocalStorage'
import { Utility } from './Utility'

enum Key {
  ListIds = 'ListIds',
}

export const Lists = {
  async all(): Promise<ListType[]> {
    const ids = await LocalStorage.get<string[]>(Key.ListIds)

    if (!ids) {
      await LocalStorage.set(Key.ListIds, [])
      return []
    }

    const bins = await Promise.all(
      ids.map((id) => {
        return LocalStorage.get<Uint8Array>(id)
      })
    )

    const docs = bins
      .filter(Utility.isNotNull)
      .map((bin) => Docs.fromBin<ListType>(bin))
    return docs
  },
  new({ name }: ListChangesetType): ListType {
    return Docs.new({ id: Utility.uuid(), name, items: [] })
  },
  async save(list: ListType) {
    await ensureListIsInListIds(list)
    await Docs.save(list)
  },
  changeAndSave(list: ListType, listChangeset: ListChangesetType) {
    Docs.changeAndSave(list, (list) => {
      if (listChangeset.name) {
        list.name = listChangeset.name
      }
    })
  },
  Items: {
    new({ value }: ListItemChangesetType): ListType['items'][number] {
      return { id: Utility.uuid(), value }
    },
    removeAndSave(list: ListType, itemId: string) {
      Docs.changeAndSave(list, (list) => {
        const index = list.items.findIndex((item) => item.id === itemId)
        if (index !== -1) {
          list.items.splice(index, 1)
        }
      })
    },
    addAndSave(list: ListType, newData: ListItemChangesetType) {
      const newItem = Lists.Items.new(newData)

      Docs.changeAndSave(list, (list) => {
        list.items.push(newItem)
      })
    },
    changeAndSave(
      list: ListType,
      itemId: string,
      itemChanges: ListItemChangesetType
    ) {
      Docs.changeAndSave(list, (list) => {
        const index = list.items.findIndex((item) => item.id === itemId)
        if (index !== -1) {
          if (itemChanges.value) {
            list.items[index].value = itemChanges.value
          }
        }
      })
    },
  },
}

async function ensureListIsInListIds(list: ListType) {
  const listIds = await LocalStorage.get<string[]>(Key.ListIds)
  if (!listIds) throw 'no ids! should have been created in Lists.all'

  const listId = listIds.find((lid) => lid === list.id)
  if (listId) return
  await LocalStorage.set(Key.ListIds, [...listIds, list.id])
}
