import { forwardRef, useRef, useState } from 'react'
import { Button } from './core/Button'
import { InputText } from './core/InputText'
import { Modal } from './core/Modal'
import { ListApi } from './listApi'

export function AddItem({ setList }) {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState<string>('')

  const handleAddItem = () => {
    const a = async () => {
      await ListApi.addItem(input)
      const newList = await ListApi.getList()
      newList && setList(newList)
      setOpen(false)
      setInput('')
    }

    a()
  }

  return (
    <div className="fixed bottom-0 my-4 flex">
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
