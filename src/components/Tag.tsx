import './Tag.css'
import { StatusIcon } from './StatusIcon'
import type { ReactNode } from 'react'

interface TagProps {
  children: ReactNode
}

export function Tag({ children }: TagProps) {
  return (
    <span className="tag">
      <StatusIcon variant="open" size={15} />
      {children}
    </span>
  )
}
