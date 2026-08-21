import { Link } from 'react-router-dom'
import { CompassIcon } from 'lucide-react'
import Button from '../../components/common/Button'

export default function NotFoundPage() {
  return (
    <div className="flex min-h-full flex-col items-center justify-center gap-4 px-6 py-20 text-center">
      <CompassIcon className="size-10 text-ink-300" aria-hidden />
      <h1 className="text-lg font-semibold text-ink-900">Página não encontrada</h1>
      <Link to="/">
        <Button>Voltar ao início</Button>
      </Link>
    </div>
  )
}
