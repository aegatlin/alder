import { MouseEvent, ReactNode } from 'react'

interface ButtonProps {
  children: ReactNode
  disabled?: boolean
  onClick: (e: MouseEvent<HTMLButtonElement>) => void
}

export function Button({ children, disabled, onClick }: ButtonProps) {
  return (
    <button
      className="flex w-max space-x-1 rounded-full bg-blue-500 py-4 px-6 text-white shadow-md focus:ring hover:enabled:bg-blue-600 hover:enabled:shadow-xl active:enabled:shadow-lg disabled:cursor-not-allowed disabled:bg-gray-400 disabled:shadow-none"
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
