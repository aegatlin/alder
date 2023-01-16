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
      <h1 className="text-6xl">App</h1>
      <div className="space-y-4 p-4">
        {list.map((item) => (
          <Item key={item.id} item={item} removeItem={removeItem} />
        ))}
      </div>
      <Button onClick={reset}>Reset</Button>
      <AddItem setList={setList} />
    </main>
  )
}

function Item({ item, removeItem }) {
  return (
    <div className="items-center rounded-2xl border p-4">
      <div className="flex justify-between">
        <div className="mr-4 flex items-center">{item.value}</div>
        <Button onClick={() => removeItem(item.id)}>X</Button>
      </div>
    </div>
  )
}


