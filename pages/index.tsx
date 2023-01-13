import localforage from 'localforage'
import { useEffect, useState } from 'react'
import { Button } from '../lib/core/Button'

const List = {
  async addItem(s: string) {
    const list = await localforage.getItem<string[]>('list')
    if (list) list.push(s)
    await localforage.setItem('list', list)
  },
  async getList(): Promise<string[] | null> {
    const list = await localforage.getItem<string[]>('list')
    return list
  },
  async reset() {
    await localforage.setItem('list', [])
  },
}

export default function Index() {
  const [list, setList] = useState<string[]>([])

  const getList = async () => {
    const l = await List.getList()
    l && setList(l)
  }

  useEffect(() => {
    getList()
  }, [])

  const addItem = () => {
    const a = async () => {
      await List.addItem('hey')
      const newList = await List.getList()
      newList && setList(newList)
    }

    a()
  }

  const reset = () => {
    const r = async () => {
      await List.reset()
      await getList()
    }

    r()
  }

  return (
    <main className="flex flex-col items-center">
      <h1 className="text-6xl">App</h1>
      <Button onClick={addItem}>Hey</Button>
      <Button onClick={reset}>Reset</Button>
      {list.map((s, i) => (
        <div key={i} className="">
          {s}
        </div>
      ))}
    </main>
  )
}
