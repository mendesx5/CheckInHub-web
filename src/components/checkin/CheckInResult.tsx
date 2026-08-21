import { CheckCircle2, XCircle } from 'lucide-react'
import Button from '../common/Button'
import { formatTime } from '../../utils/date'
import type { CheckIn } from '../../types/checkin'

interface SuccessProps {
  type: 'success'
  checkIn: CheckIn
  onScanNext: () => void
  onBack: () => void
}

interface ErrorProps {
  type: 'error'
  message: string
  onScanNext: () => void
  onBack: () => void
}

export default function CheckInResult(props: SuccessProps | ErrorProps) {
  if (props.type === 'success') {
    const { checkIn, onScanNext, onBack } = props
    return (
      <div className="mx-auto flex w-full max-w-[600px] flex-col items-center gap-4 rounded-2xl border border-success-50 bg-white p-8 text-center">
        <CheckCircle2 className="size-14 text-success-500" aria-hidden />
        <div>
          <p className="text-lg font-semibold text-ink-900">Check-in realizado!</p>
        </div>
        <div className="w-full space-y-2 rounded-xl bg-ink-50 p-4 text-left text-sm">
          <Row label="Participante" value={checkIn.participantName} />
          <Row label="Evento" value={checkIn.eventTitle} />
          <Row label="Horário" value={formatTime(checkIn.checkInDateTime)} />
        </div>
        <div className="flex w-full flex-col gap-2">
          <Button fullWidth onClick={onScanNext}>
            Escanear próximo
          </Button>
          <Button variant="secondary" fullWidth onClick={onBack}>
            Voltar ao evento
          </Button>
        </div>
      </div>
    )
  }

  const { message, onScanNext, onBack } = props
  return (
    <div className="mx-auto flex w-full max-w-[600px] flex-col items-center gap-4 rounded-2xl border border-danger-50 bg-white p-8 text-center">
      <XCircle className="size-14 text-danger-500" aria-hidden />
      <div>
        <p className="text-lg font-semibold text-ink-900">Não foi possível realizar o check-in</p>
        <p className="mt-1 text-sm text-ink-500">{message}</p>
      </div>
      <div className="flex w-full flex-col gap-2">
        <Button fullWidth onClick={onScanNext}>
          Escanear próximo
        </Button>
        <Button variant="secondary" fullWidth onClick={onBack}>
          Voltar ao evento
        </Button>
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-ink-500">{label}</span>
      <span className="font-medium text-ink-900">{value}</span>
    </div>
  )
}
