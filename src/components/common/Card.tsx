import type { HTMLAttributes, ReactNode } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export default function Card({ children, className = '', ...rest }: CardProps) {
  return (
    <div
      className={`rounded-2xl border border-ink-100 bg-white p-4 shadow-[0_1px_2px_rgba(20,18,31,0.04)] ${className}`}
      {...rest}
    >
      {children}
    </div>
  )
}
