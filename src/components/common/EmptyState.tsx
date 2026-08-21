import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description?: string
  action?: ReactNode
}

export default function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-ink-100 px-6 py-12 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-ink-50">
        <Icon className="size-6 text-ink-300" aria-hidden />
      </div>
      <p className="text-[15px] font-medium text-ink-700">{title}</p>
      {description ? <p className="text-sm text-ink-500">{description}</p> : null}
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  )
}
