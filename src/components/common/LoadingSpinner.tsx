import { Loader2 } from 'lucide-react'

export default function LoadingSpinner({ label = 'Carregando...' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-ink-500" role="status">
      <Loader2 className="size-6 animate-spin text-brand-500" aria-hidden />
      <span className="text-sm">{label}</span>
    </div>
  )
}
