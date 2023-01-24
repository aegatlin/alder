import { Check, Edit2, Home } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { Button } from '../../lib/core/Button'
import { InputText } from '../../lib/core/InputText'
import { Modal } from '../../lib/core/Modal'
import { ListContext, useList } from '../../lib/useList'
import * as List from '../../lib/context/list'

export default function ListPageRoot() {
  const {
    query: { id },
  } = useRouter()

  if (typeof id !== 'string') {
    return 'Loading...'
  }

  return (
    <ListContext id={id}>
      <ListPage />
    </ListContext>
  )
}

function ListPage() {
  const { list, removeItem } = useList()
  const [showEditItemModal, setShowEditItemModal] = useState(false)

  if (!list) {
    return <div className="">Loading...</div>
  }

  return (
    <>
      <header className="flex w-full justify-between p-8">
        <div className="">
          <Link href={'/'} className="">
            <Home />
          </Link>
        </div>
        <div className="">{list.name}</div>
        <div className="">{/* empty but required for spacing */}</div>
      </header>
      <main className="flex flex-col items-center">
        <div className="divide-y">
          {list && list.items.length > 0
            ? list.items.map((item) => (
                <div key={item.id} className="w-screen items-center py-2 px-4">
                  <div className="flex justify-between">
                    <div className="mr-4 flex items-center">{item.value}</div>
                    <div className="flex space-x-4">
                      <Button
                        onClick={() => setShowEditItemModal(true)}
                        bgColor="bg-blue-500"
                        bgHoverColor="bg-blue-600"
                      >
                        <Edit2 />
                      </Button>
                      {showEditItemModal && (
                        <EditItemModal
                          item={item}
                          close={() => setShowEditItemModal(false)}
                        />
                      )}
                      <Button
                        onClick={() => removeItem(list.id, item.id)}
                        bgColor="bg-green-500"
                        bgHoverColor="bg-green-600"
                      >
                        <Check />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            : 'no items'}
        </div>
        <AddItemModal />
      </main>
    </>
  )
}

export function AddItemModal() {
  const { list, addItem } = useList()
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState<string>('')

  if (!list) return null

  const handleAddItem = () => {
    addItem(list.id, input)
    setOpen(false)
    setInput('')
  }

  return (
    <div className="fixed bottom-0 mb-8 mt-4 flex">
      {open && (
        <Modal onBackdropClick={() => setOpen(false)}>
          <div className="">
            <InputText
              value={input}
              placeholder="new item"
              onChange={(e) => setInput(e.target.value)}
              autoFocus={true}
            />
            <Button onClick={handleAddItem}>Save</Button>
          </div>
        </Modal>
      )}
      <Button onClick={() => setOpen(true)}>Add Item</Button>
    </div>
  )
}

function EditItemModal({
  item,
  close,
}: {
  item: List.ListType['items'][number]
  close: () => void
}) {
  const { list, updateItem } = useList()
  const [input, setInput] = useState<string>(item.value)

  if (!list) return null

  const handleEditItem = () => {
    const newItem: List.ListType['items'][number] = { ...item, value: input }
    updateItem(list.id, newItem)
    close()
  }

  return (
    <Modal onBackdropClick={close}>
      <div className="">
        <InputText
          value={input}
          placeholder="new item"
          onChange={(e) => setInput(e.target.value)}
          autoFocus={true}
        />
        <Button onClick={handleEditItem}>Save</Button>
      </div>
    </Modal>
  )
}
