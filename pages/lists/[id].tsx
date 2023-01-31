import { Check, Edit2, Home } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Button } from '../../lib/core/Button'
import { InputText } from '../../lib/core/InputText'
import { Modal } from '../../lib/core/Modal'
import { ItemChangeset } from '../../lib/types'
import { useList } from '../../lib/useList'

export default function ListPage() {
  const router = useRouter()
  const [id, setId] = useState((router.query.id as string) || null)
  const {
    list,
    updateList,
    item: { add, remove, update },
  } = useList(id)
  const [showAddItemModal, setShowAddItemModal] = useState(false)
  const [showEditItemModal, setShowEditItemModal] = useState(false)
  const [editItemId, setEditItemId] = useState('')
  const [showEditListModal, setShowEditListModal] = useState(false)

  useEffect(() => {
    setId((router.query.id as string) || null)
  }, [router])

  if (!list) {
    return <div className="">Loading...</div>
  }

  const handleEditItemModal = {
    open: (itemId: string) => {
      setShowEditItemModal(true)
      setEditItemId(itemId)
    },
    close: () => {
      setShowEditItemModal(false)
      setEditItemId('')
    },
  }

  return (
    <>
      <header className="flex w-full items-center justify-between p-8">
        <div className="">
          <Link href={'/'} className="">
            <Home />
          </Link>
        </div>
        <h1
          className="cursor-pointer rounded-2xl p-4 text-4xl hover:bg-gray-100"
          onClick={() => setShowEditListModal(true)}
        >
          {list.name}
        </h1>
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
                        onClick={() => handleEditItemModal.open(item.id)}
                        bgColor="bg-blue-500"
                        bgHoverColor="bg-blue-600"
                      >
                        <Edit2 />
                      </Button>
                      <Button
                        onClick={() => remove(item.id)}
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
          <AddItemModal
            addItem={add}
            close={() => setShowAddItemModal(false)}
          />
        )}
        {showEditItemModal && (
          <EditItemModal
            list={list}
            updateItem={update}
            close={handleEditItemModal.close}
            itemId={editItemId}
          />
        )}
        {showEditListModal && (
          <EditListModal
            list={list}
            updateList={updateList}
            close={() => setShowEditListModal(false)}
          />
        )}
      </main>
    </>
  )
}

export function EditListModal({ list, updateList, close }) {
  const [input, setInput] = useState<string>(list?.name || '')

  const handleEditList = () => {
    updateList({ name: input })
    setInput('')
    close()
  }

  return (
    <MyModal close={close}>
      <div className="space-y-2">
        <div className="">Copy Link to Share</div>
        <div className="">{window?.location?.href || ''}</div>
      </div>
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

export function AddItemModal({ addItem, close }) {
  const [input, setInput] = useState<string>('')

  const handleAddItem = () => {
    addItem(input)
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

function EditItemModal({ list, updateItem, close, itemId }) {
  const item = list?.items.find((i) => i.id === itemId)
  const [input, setInput] = useState<string>(item?.value || '')

  if (!list || !item) return null

  const handleEditItem = () => {
    const newItem: ItemChangeset = { value: input }
    updateItem(item.id, newItem)
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
