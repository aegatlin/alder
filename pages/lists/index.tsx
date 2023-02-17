import localforage from 'localforage'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Button } from '../../client/core/Button'
import { para } from '../../client/para'
import { useList } from '../../client/useList'
import { useListIds } from '../../client/useListIds'
import { v4 as uuid } from 'uuid'

export default function ListsIndexPage() {
  const router = useRouter()
  const { listIds, ensure } = useListIds()

  const handleNewListClick = async () => {
    const id = uuid()
    para.docs.create({ id, name: 'new list', items: [] })
    ensure(id)
    router.push(`/lists/${id}`)
  }

  return (
    <main className="flex flex-col items-center space-y-8">
      <h1 className="my-4 text-4xl">Grocl</h1>
      <div className="">
        <div className="flex flex-col divide-y">
          {listIds && listIds.map((id) => <List key={id} id={id} />)}
        </div>
      </div>
      <Button onClick={handleNewListClick}>New List</Button>
    </main>
  )
}

function List({ id }) {
  const { list } = useList(id)

  return (
    <Link key={id} href={`/lists/${id}`}>
      <div className="py-8">{list?.name}</div>
    </Link>
  )
}
