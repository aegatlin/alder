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
  const [showAddItemModal, setShowAddItemModal] = useState(false)
  const [showEditItemModal, setShowEditItemModal] = useState(false)
  const [showEditListModal, setShowEditListModal] = useState(false)

  if (!list) {
    return <div className="">Loading...</div>
  }

  return (
    <>
      <header className="flex w-full items-center justify-between p-8">
        <div className="">
          <Link href={'/'} className="">
            <Home />
          </Link>
        </div>
        <div
          className="cursor-pointer rounded-2xl p-4 text-4xl hover:bg-gray-100"
          onClick={() => setShowEditListModal(true)}
        >
          {list.name}
        </div>
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
        <div className="fixed bottom-0 mb-8 mt-4 flex">
          <Button onClick={() => setShowAddItemModal(true)}>Add Item</Button>
        </div>
        {showAddItemModal && (
          <AddItemModal close={() => setShowAddItemModal(false)} />
        )}
        {showEditListModal && (
          <EditListModal close={() => setShowEditListModal(false)} />
        )}
      </main>
    </>
  )
}

export function EditListModal({ close }) {
  const { list, updateList } = useList()
  const [input, setInput] = useState<string>(list?.name || '')

  if (!list) return null

  const handleEditList = () => {
    updateList(list.id, { name: input })
    setInput('')
    close()
  }

  return (
    <MyModal close={close}>
      <InputText
        value={input}
        placeholder="new item"
        onChange={(e) => setInput(e.target.value)}
        autoFocus={true}
      />
      <Button onClick={handleEditList}>Save</Button>
    </MyModal>
  )
}

export function AddItemModal({ close }) {
  const { list, addItem } = useList()
  const [input, setInput] = useState<string>('')

  if (!list) return null

  const handleAddItem = () => {
    addItem(list.id, input)
    close()
    setInput('')
  }

  return (
    <MyModal close={close}>
      <InputText
        value={input}
        placeholder="new item"
        onChange={(e) => setInput(e.target.value)}
        autoFocus={true}
      />
      <Button onClick={handleAddItem}>Save</Button>
    </MyModal>
  )
}

function MyModal({ close, children }) {
  return (
    <Modal onBackdropClick={close}>
      <div className="flex flex-col items-center justify-center space-y-8 rounded-2xl bg-white p-8">
        {children}
      </div>
    </Modal>
  )
}

function EditItemModal({
  item,
  close,
}: {
  item: List.List['items'][number]
  close: () => void
}) {
  const { list, updateItem } = useList()
  const [input, setInput] = useState<string>(item.value)

  if (!list) return null

  const handleEditItem = () => {
    const newItem: List.List['items'][number] = { ...item, value: input }
    updateItem(list.id, newItem)
    close()
  }

  return (
    <MyModal close={close}>
      <InputText
        value={input}
        placeholder="new item"
        onChange={(e) => setInput(e.target.value)}
        autoFocus={true}
      />
      <Button onClick={handleEditItem}>Save</Button>
    </MyModal>
  )
}
