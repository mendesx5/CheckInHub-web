import { AlertTriangle } from 'lucide-react'
import Button from './Button'

interface ErrorStateProps {
  message: string
  onRetry?: () => void
}

export default function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-danger-50 bg-danger-50/50 px-6 py-10 text-center">
      <AlertTriangle className="size-6 text-danger-500" aria-hidden />
      <p className="text-[15px] text-ink-700">{message}</p>
      {onRetry ? (
        <Button variant="secondary" size="md" onClick={onRetry}>
          Tentar novamente
        </Button>
      ) : null}
    </div>
  )
}
