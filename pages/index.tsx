import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Button } from '../lib/core/Button'
import * as List from '../lib/context/list'
import { clear } from '../lib/context/localforage'

function useLists() {
  const router = useRouter()
  const [lists, setLists] = useState<{ id: string; name: string }[]>([])

  useEffect(() => {
    const a = async () => {
      setLists(await List.all())
    }

    a()
  }, [])

  const createList = () => {
    const a = async () => {
      const list = await List.create()
      router.push(`/lists/${list.id}`)
    }

    a()
  }

  return { lists, createList }
}

export default function IndexPage() {
  const { lists, createList } = useLists()

  return (
    <main className="flex flex-col items-center space-y-8">
      <h1 className="my-4 text-4xl">Grocl</h1>
      <div className="">
        <div className="flex flex-col divide-y">
          {lists &&
            lists.map(({ id, name }) => (
              <Link key={id} href={`/lists/${id}`}>
                <div className="py-8">{name}</div>
              </Link>
            ))}
        </div>
      </div>
      <Button onClick={createList}>New List</Button>
      <Button onClick={clear}>Clear Local Storage</Button>
    </main>
  )
}
