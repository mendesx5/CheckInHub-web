import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { Maximize2, X } from 'lucide-react'
import PageHeader from '../../components/layout/PageHeader'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import ErrorState from '../../components/common/ErrorState'
import Badge from '../../components/common/Badge'
import Button from '../../components/common/Button'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import { getEnrollmentById, getEnrollmentQrCodeBlobUrl, cancelEnrollment } from '../../services/enrollmentService'
import { getApiErrorMessage } from '../../utils/apiError'
import { formatDateLong, formatTime } from '../../utils/date'
import { getEnrollmentStatusLabel, getEnrollmentStatusTone } from '../../utils/status'
import type { Enrollment } from '../../types/enrollment'

export default function EnrollmentDetailPage() {
  const { enrollmentId } = useParams()

  const [enrollment, setEnrollment] = useState<Enrollment | null>(null)
  const [qrUrl, setQrUrl] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [fullscreen, setFullscreen] = useState(false)
  const [confirmCancel, setConfirmCancel] = useState(false)
  const [canceling, setCanceling] = useState(false)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    if (!enrollmentId) return
    let cancelled = false
    let objectUrl: string | null = null
    setError('')
    setEnrollment(null)
    setQrUrl(null)

    Promise.all([getEnrollmentById(enrollmentId), getEnrollmentQrCodeBlobUrl(enrollmentId)])
      .then(([enrollmentData, qrBlobUrl]) => {
        if (cancelled) {
          URL.revokeObjectURL(qrBlobUrl)
          return
        }
        objectUrl = qrBlobUrl
        setEnrollment(enrollmentData)
        setQrUrl(qrBlobUrl)
      })
      .catch((err) => {
        if (!cancelled) setError(getApiErrorMessage(err))
      })

    return () => {
      cancelled = true
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [enrollmentId, reloadKey])

  async function handleCancel() {
    if (!enrollment) return
    setCanceling(true)
    try {
      await cancelEnrollment(enrollment.id)
      toast.success('Inscrição cancelada.')
      setConfirmCancel(false)
      setReloadKey((n) => n + 1)
    } catch (err) {
      toast.error(getApiErrorMessage(err))
    } finally {
      setCanceling(false)
    }
  }

  if (!enrollment && !error) {
    return (
      <div>
        <PageHeader title="Minha inscrição" back />
        <LoadingSpinner label="Carregando inscrição..." />
      </div>
    )
  }

  if (error || !enrollment) {
    return (
      <div>
        <PageHeader title="Minha inscrição" back />
        <ErrorState message={error} onRetry={() => setReloadKey((n) => n + 1)} />
      </div>
    )
  }

  const canCancel = enrollment.status === 'CONFIRMED'

  return (
    <div>
      <PageHeader title="Meu ingresso" back />

      <div className="mx-auto max-w-sm overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-[0_2px_16px_rgba(20,18,31,0.06)]">
        <div className="bg-brand-600 px-6 py-4 text-center text-white">
          <p className="text-xs font-medium tracking-wide opacity-90">CheckInHub</p>
          <h2 className="mt-1 text-lg font-semibold uppercase tracking-tight">
            {enrollment.event.title}
          </h2>
          <p className="mt-1 text-sm opacity-90">
            {formatDateLong(enrollment.event.dateTime)} · {formatTime(enrollment.event.dateTime)}
          </p>
          <p className="text-sm opacity-90">{enrollment.event.location}</p>
        </div>

        <div className="flex flex-col items-center gap-3 border-t border-dashed border-ink-100 px-6 py-6">
          {qrUrl ? (
            <button
              onClick={() => setFullscreen(true)}
              className="rounded-xl border border-ink-100 bg-white p-3"
              aria-label="Ampliar QR Code"
            >
              <img src={qrUrl} alt="QR Code da inscrição" className="size-48" />
            </button>
          ) : (
            <div className="flex size-48 items-center justify-center rounded-xl bg-ink-50">
              <LoadingSpinner label="" />
            </div>
          )}
          <p className="text-center text-sm text-ink-500">
            Apresente este QR Code na entrada do evento
          </p>
          <Button
            variant="secondary"
            size="md"
            icon={<Maximize2 className="size-4" />}
            onClick={() => setFullscreen(true)}
          >
            Aumentar QR Code
          </Button>
        </div>

        <div className="flex items-center justify-between border-t border-ink-100 px-6 py-4">
          <span className="text-sm text-ink-500">Inscrição #{enrollment.id}</span>
          <Badge tone={getEnrollmentStatusTone(enrollment.status)}>
            {getEnrollmentStatusLabel(enrollment.status)}
          </Badge>
        </div>
      </div>

      {canCancel ? (
        <Button
          variant="danger"
          fullWidth
          className="mx-auto mt-5 max-w-sm"
          onClick={() => setConfirmCancel(true)}
        >
          Cancelar inscrição
        </Button>
      ) : null}

      {fullscreen && qrUrl ? (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-white p-6"
          role="dialog"
          aria-modal="true"
          aria-label="QR Code em tela cheia"
        >
          <button
            onClick={() => setFullscreen(false)}
            aria-label="Fechar"
            className="absolute right-5 top-5 flex size-10 items-center justify-center rounded-full bg-ink-50 text-ink-700"
          >
            <X className="size-5" aria-hidden />
          </button>
          <img src={qrUrl} alt="QR Code da inscrição" className="w-full max-w-xs" />
          <p className="text-center text-[15px] text-ink-500">{enrollment.event.title}</p>
        </div>
      ) : null}

      <ConfirmDialog
        open={confirmCancel}
        title="Cancelar inscrição"
        message="Tem certeza que deseja cancelar sua inscrição neste evento?"
        confirmLabel="Cancelar inscrição"
        destructive
        loading={canceling}
        onConfirm={handleCancel}
        onCancel={() => setConfirmCancel(false)}
      />
    </div>
  )
}
