import { ChangeEvent, FocusEvent } from 'react'

interface InputProps {
  value: string
  placeholder?: string
  disabled?: boolean
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  onFocus?: (e: FocusEvent<HTMLInputElement>) => void
  onBlur?: (e: FocusEvent<HTMLInputElement>) => void
}

export function InputText({
  value,
  placeholder,
  disabled,
  onChange,
  onFocus,
  onBlur,
}: InputProps) {
  return (
    <input
      type="text"
      className="max-w-full rounded-2xl border p-4 enabled:hover:border-gray-300 disabled:cursor-not-allowed disabled:text-gray-400"
      value={value}
      placeholder={placeholder}
      disabled={disabled}
      onChange={onChange}
      onBlur={onBlur}
      onFocus={onFocus}
    />
  )
}
