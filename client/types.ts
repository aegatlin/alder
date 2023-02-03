export type ListType = {
  id: string
  name: string
  items: { id: string; value: string }[]
}

export type ListChangesetType = Pick<ListType, 'name'>
export type ListItemChangesetType = Pick<ListType['items'][number], 'value'>
