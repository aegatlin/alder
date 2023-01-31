export type List = {
  id: string
  name: string
  items: { id: string; value: string }[]
}

export type ListChangeset = Pick<List, 'name'>
export type ItemChangeset = Pick<List['items'][number], 'value'>
