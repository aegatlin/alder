import { Check, Edit2, Home } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { v4 as uuid } from 'uuid'
import { Button } from '../../client/core/Button'
import { InputText } from '../../client/core/InputText'
import { Modal } from '../../client/core/Modal'
import { ListType } from '../../client/types'
import { UseList, useList } from '../../client/useList'

export default function ListPage() {
  const router = useRouter()
  const id = router.query.id

  if (typeof id !== 'string') {
    return <div className="">Loading...</div>
  }

  return <ListPageContent id={id} />
}

function ListPageContent({ id }: { id: string }) {
  const { list, change } = useList(id)

  if (!list) {
    return <div className="">Null list...</div>
  }

  return <ListPageContentWithList list={list} change={change} />
}

function ListPageContentWithList({
  list,
  change,
}: {
  list: ListType
  change: UseList['change']
}) {
  const [showAddItemModal, setShowAddItemModal] = useState(false)
  const [showEditListModal, setShowEditListModal] = useState(false)

  const addItem = ({ value }) => {
    change((list) => {
      list.items.push({ id: uuid(), value })
    })
  }

  const editList = ({ name }) => {
    change((list) => {
      list.name = name
    })
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
          {list.items.length > 0
            ? list.items.map((item) => (
                <Item key={item.id} item={item} changeList={change} />
              ))
            : 'no items'}
        </div>
        <div className="fixed bottom-0 mb-8 mt-4 flex">
          <Button onClick={() => setShowAddItemModal(true)}>Add Item</Button>
        </div>
        {showAddItemModal && (
          <ItemModal
            initialValue=""
            placeholder="new item..."
            close={() => setShowAddItemModal(false)}
            save={({ value }) => addItem({ value })}
          />
        )}
        {showEditListModal && (
          <ListModal
            list={list}
            close={() => setShowEditListModal(false)}
            save={({ name }) => editList({ name })}
          />
        )}
      </main>
    </>
  )
}

interface ItemProps {
  item: ListType['items'][number]
  changeList: UseList['change']
}

function Item({ item, changeList }: ItemProps) {
  const [showEditModal, setShowEditModal] = useState(false)

  const remove = () => {
    changeList((list) => {
      const index = list.items.findIndex((i) => i.id === item.id)
      if (index > -1) list.items.splice(index, 1)
    })
  }

  const edit = ({ value }) => {
    changeList((list) => {
      const index = list.items.findIndex((i) => i.id === item.id)
      if (index > -1) {
        if (value) {
          list.items[index].value = value
        }
      }
    })
  }

  return (
    <div key={item.id} className="w-screen items-center py-2 px-4">
      <div className="flex justify-between">
        <div className="mr-4 flex items-center">{item.value}</div>
        <div className="flex space-x-4">
          <Button
            onClick={() => setShowEditModal(true)}
            bgColor="bg-blue-500"
            bgHoverColor="bg-blue-600"
          >
            <Edit2 />
          </Button>
          <Button
            onClick={remove}
            bgColor="bg-green-500"
            bgHoverColor="bg-green-600"
          >
            <Check />
          </Button>
        </div>
      </div>
      {showEditModal && (
        <ItemModal
          initialValue={item.value}
          placeholder="item value..."
          close={() => setShowEditModal(false)}
          save={({ value }) => edit({ value })}
        />
      )}
    </div>
  )
}

interface ItemModalProps {
  initialValue: string
  placeholder: string
  close: () => void
  save: (v: { value: string }) => void
}

function ItemModal({ initialValue, placeholder, close, save }: ItemModalProps) {
  const [value, setValue] = useState(initialValue)

  const handleSave = () => {
    save({ value })
    close()
  }

  return (
    <MyModal close={close}>
      <InputText
        value={value}
        placeholder={placeholder}
        onChange={(e) => setValue(e.target.value)}
        autoFocus={true}
      />
      <Button onClick={handleSave}>Save</Button>
    </MyModal>
  )
}

function ListModal({ list, close, save }) {
  const [name, setName] = useState(list.name)

  const handleSave = () => {
    save({ name })
    close()
  }

  return (
    <MyModal close={close}>
      <InputText
        value={name}
        placeholder="list name..."
        onChange={(e) => setName(e.target.value)}
        autoFocus={true}
      />
      <Button onClick={handleSave}>Save</Button>
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
