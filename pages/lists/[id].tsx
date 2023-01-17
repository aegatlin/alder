import { Check } from 'lucide-react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { AddItem } from '../../lib/AddItem'
import { Button } from '../../lib/core/Button'
import { List, StorageApi } from '../../lib/storage'

function useList(listId: string | undefined) {
  const [list, setList] = useState<List>()

  useEffect(() => {
    if (!listId) return

    const a = async () => {
      const list = await StorageApi.List.load(listId)
      if (list) setList(list)
    }

    a()
  }, [listId])

  return { list }
}

export default function ListPage() {
  const [list, setList] = useState<List>()
  const router = useRouter()
  const listId = (router?.query?.id as string) || undefined

  useEffect(() => {
    if (!listId) return

    const a = async () => {
      const list = await StorageApi.List.load(listId)
      if (list) setList(list)
    }

    a()
  }, [listId])

  return (
    <main className="flex flex-col items-center">
      <h1 className="my-4 text-4xl">Grocl</h1>
      <h2>{list?.name}</h2>
      <div className="">
        <div className="divide-y">
          {list && list.items.length > 0
            ? list.items.map((item) => (
                <div key={item.id} className="w-screen items-center py-2 px-4">
                  <div className="flex justify-between">
                    <div className="mr-4 flex items-center">{item.value}</div>
                    <Button
                      onClick={() =>
                        StorageApi.List.removeItem(list.id, item.id)
                      }
                      bgColor="bg-green-500"
                      bgHoverColor="bg-green-600"
                    >
                      <Check />
                    </Button>
                  </div>
                </div>
              ))
            : 'no items'}
        </div>
      </div>
      {list && <AddItem listId={list.id} setList={setList} />}
    </main>
  )
}
