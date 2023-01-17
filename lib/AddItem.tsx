import { useState } from 'react'
import { Button } from './core/Button'
import { InputText } from './core/InputText'
import { Modal } from './core/Modal'
import { StorageApi } from './storage'

export function AddItem({ listId, setList }) {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState<string>('')

  const handleAddItem = () => {
    const a = async () => {
      const list = await StorageApi.List.addItem(listId, input)
      setList(list)
      setOpen(false)
      setInput('')
    }

    a()
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
            <Button onClick={handleAddItem}>Add Item</Button>
          </div>
        </Modal>
      )}
      <Button onClick={() => setOpen(true)}>Add Item</Button>
    </div>
  )
}
