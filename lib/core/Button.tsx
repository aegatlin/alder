import { MouseEvent, ReactNode } from 'react'

interface ButtonProps {
  children: ReactNode
  disabled?: boolean
  onClick: (e: MouseEvent<HTMLButtonElement>) => void
  bgColor?: string
  bgHoverColor?: string
}

export function Button({
  children,
  disabled,
  onClick,
  bgColor,
  bgHoverColor,
}: ButtonProps) {
  bgColor = bgColor || 'bg-blue-500'
  bgHoverColor = bgHoverColor || 'bg-blue-600'

  return (
    <button
      className={`${bgColor} hover:enabled:${bgHoverColor} flex w-max space-x-1 rounded-full py-4 px-6 text-white shadow-md focus:ring hover:enabled:shadow-xl active:enabled:shadow-lg disabled:cursor-not-allowed disabled:bg-gray-400 disabled:shadow-none`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
