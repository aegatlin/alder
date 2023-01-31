import Link from 'next/link'
import { useRouter } from 'next/router'
import { useContext } from 'react'
import { Button } from '../lib/core/Button'
import { ListsContext, ListsProvider } from '../lib/ListsContext'
import ns from '../lib/namespaces'

export default function IndexPage() {
  return (
    <ListsProvider>
      <IndexPageContent />
    </ListsProvider>
  )
}

function IndexPageContent() {
  const router = useRouter()
  const { lists, load } = useContext(ListsContext)
  const clear = () => ns.localStore.clear()
  const handleNewList = () => {
    ns.list.create().then((list) => {
      load()
      router.push(`/lists/${list.id}`)
    })
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
      <Button onClick={clear}>Clear Local Storage</Button>
    </main>
  )
}
