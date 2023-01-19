import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Button } from '../lib/core/Button'
import { StorageApi } from '../lib/storage'

function useLists() {
  const [lists, setLists] = useState<{ id: string; name: string }[]>([])

  useEffect(() => {
    const a = async () => {
      const ls = await StorageApi.Lists.all()
      const lists = await Promise.all(
        ls.map(async (id) => {
          const l = await StorageApi.List.load(id)
          return { id, name: l.name }
        })
      )
      setLists(lists)
    }

    a()
  }, [])

  return { lists }
}

export default function IndexPage() {
  const router = useRouter()
  const { lists } = useLists()

  const handleNewList = () => {
    const a = async () => {
      const list = await StorageApi.List.create()
      router.push(`/lists/${list.id}`)
    }

    a()
  }

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
      <Button onClick={handleNewList}>New List</Button>
      <Button onClick={() => StorageApi.clear()}>Clear Local Storage</Button>
    </main>
  )
}
