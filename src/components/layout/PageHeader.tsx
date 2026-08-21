import type { ReactNode } from 'react'
import { ChevronLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface PageHeaderProps {
  title: string
  subtitle?: string
  back?: boolean
  action?: ReactNode
}

export default function PageHeader({ title, subtitle, back = false, action }: PageHeaderProps) {
  const navigate = useNavigate()
  return (
    <header className="safe-top sticky top-0 z-20 -mx-4 mb-4 border-b border-ink-100 bg-ink-50/90 px-4 py-3 backdrop-blur sm:mx-0 sm:rounded-2xl sm:border">
      <div className="flex items-center gap-2">
        {back ? (
          <button
            onClick={() => navigate(-1)}
            aria-label="Voltar"
            className="-ml-1.5 flex size-9 shrink-0 items-center justify-center rounded-full text-ink-700 hover:bg-ink-100"
          >
            <ChevronLeft className="size-5" aria-hidden />
          </button>
        ) : null}
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-lg font-semibold text-ink-900">{title}</h1>
          {subtitle ? <p className="truncate text-sm text-ink-500">{subtitle}</p> : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
    </header>
  )
}
