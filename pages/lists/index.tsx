import localforage from 'localforage'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Button } from '../../client/core/Button'
import { useLists } from '../../client/useLists'

export default function ListsIndexPage() {
  const router = useRouter()
  const { lists, create } = useLists()

  const handleNewListClick = async () => {
    const id = await create({ name: 'new list', items: [] })
    router.push(`/lists/${id}`)
  }

  return (
    <main className="flex flex-col items-center space-y-8">
      <h1 className="my-4 text-4xl">Grocl</h1>
      <div className="">
        <div className="flex flex-col divide-y">
          {lists.map(({ id, name }) => (
            <Link key={id} href={`/lists/${id}`}>
              <div className="py-8">{name}</div>
            </Link>
          ))}
        </div>
      </div>
      <Button onClick={handleNewListClick}>New List</Button>
      <Button onClick={() => localforage.clear()}>Clear Local Storage</Button>
    </main>
  )
}
