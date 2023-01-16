import { Check } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from '../lib/core/Button'
import { ListApi, ListItem } from '../lib/listApi'
import { AddItem } from '../lib/AddItem'

export default function Index() {
  const [list, setList] = useState<ListItem[]>([])

  const getList = async () => {
    const l = await ListApi.getList()
    l && setList(l)
  }

  useEffect(() => {
    getList()
  }, [])

  const removeItem = (id) => {
    const r = async () => {
      await ListApi.removeItem(id)
      await getList()
    }

    r()
  }

  const reset = () => {
    const r = async () => {
      await ListApi.reset()
      await getList()
    }

    r()
  }

  return (
    <main className="flex flex-col items-center">
      <h1 className="my-4 text-4xl">Grocl</h1>
      <Items items={list} removeItem={removeItem} />
      <Button onClick={reset}>Reset</Button>
      <AddItem setList={setList} />
    </main>
  )
}

function Items({ items, removeItem }) {
  return (
    <div className="">
      <div className="divide-y">
        {items.map((item) => (
          <Item key={item.id} item={item} removeItem={removeItem} />
        ))}
      </div>
    </div>
  )
}

function Item({ item, removeItem }) {
  return (
    <div className="w-screen items-center py-2 px-4">
      <div className="flex justify-between">
        <div className="mr-4 flex items-center">{item.value}</div>
        <Button
          onClick={() => removeItem(item.id)}
          bgColor="bg-green-500"
          bgHoverColor="bg-green-600"
        >
          <Check />
        </Button>
      </div>
    </div>
  )
}
