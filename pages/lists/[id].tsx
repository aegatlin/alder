import { Check, Edit2, Home } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useContext, useEffect, useState } from 'react'
import { Button } from '../../client/core/Button'
import { InputText } from '../../client/core/InputText'
import { Modal } from '../../client/core/Modal'
import { ListsContext } from '../../client/ListsContext'
import { Lists } from '../../client/namespaces/Lists'
import {
  ListChangesetType,
  ListItemChangesetType,
  ListType,
} from '../../client/types'

export default function ListPage() {
  const router = useRouter()
  const id = router.query.id

  if (typeof id !== 'string') {
    return <div className="">Loading...</div>
  }

  return <ListPageContent id={id} />
}

function ListPageContent({ id }: { id: string }) {
  const { lists } = useContext(ListsContext)
  const list = lists.find((l) => l.id === id) ?? null

  if (!list) {
    return <div className="">Loading...</div>
  }

  return <ListPageContentWithList list={list} />
}

function useList(list: ListType) {
  return {
    edit: (changes: ListChangesetType) => Lists.changeAndSave(list, changes),
    item: {
      add: (data: ListItemChangesetType) => Lists.Items.addAndSave(list, data),
      remove: (itemId: string) => Lists.Items.removeAndSave(list, itemId),
      edit: (itemId: string, changes: ListItemChangesetType) =>
        Lists.Items.changeAndSave(list, itemId, changes),
    },
  }
}

function ListPageContentWithList({ list }) {
  const { edit: listEdit, item: listItem } = useList(list)
  const [showAddItemModal, setShowAddItemModal] = useState(false)
  const [showEditItemModal, setShowEditItemModal] = useState(false)
  const [editItemId, setEditItemId] = useState('')
  const [showEditListModal, setShowEditListModal] = useState(false)

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
                        onClick={() => listItem.remove(item.id)}
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
            addItem={listItem.add}
            close={() => setShowAddItemModal(false)}
          />
        )}
        {showEditItemModal && (
          <EditItemModal
            list={list}
            editItem={listItem.edit}
            close={handleEditItemModal.close}
            itemId={editItemId}
          />
        )}
        {showEditListModal && (
          <EditListModal
            list={list}
            editList={listEdit}
            close={() => setShowEditListModal(false)}
          />
        )}
      </main>
    </>
  )
}

interface EditListModalParams {
  list: ListType
  editList: (change: ListChangesetType) => void
  close: () => void
}

export function EditListModal({ list, editList, close }: EditListModalParams) {
  const [input, setInput] = useState<string>(list?.name || '')

  const handleEditList = () => {
    editList({ name: input })
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

interface AddItemModalParams {
  addItem: (x: ListItemChangesetType) => void
  close: () => void
}
export function AddItemModal({ addItem, close }: AddItemModalParams) {
  const [input, setInput] = useState<string>('')

  const handleAddItem = () => {
    addItem({ value: input })
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

interface EditItemModalParams {
  list: ListType
  itemId: string
  editItem: (itemId: string, changes: ListItemChangesetType) => void
  close: () => void
}
function EditItemModal({ list, editItem, close, itemId }: EditItemModalParams) {
  const item = list.items.find((i) => i.id === itemId)
  const [input, setInput] = useState<string>(item?.value || '')

  if (!item) return null

  const handleEditItem = () => {
    editItem(item.id, { value: input })
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
