import Link from 'next/link'
import { useContext } from 'react'
import { Button } from '../../client/core/Button'
import { ListsContext, ListsContextProvider } from '../../client/ListsContext'
import { LocalStorage } from '../../client/namespaces/LocalStorage'

export default function ListsIndexPage() {
  return (
    <ListsContextProvider>
      <IndexPageContent />
    </ListsContextProvider>
  )
}

function IndexPageContent() {
  const { lists, newList } = useContext(ListsContext)

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
      <Button onClick={() => newList()}>New List</Button>
      <Button onClick={() => LocalStorage.clear()}>Clear Local Storage</Button>
    </main>
  )
}
