import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { CalendarDays, MapPin, Users } from 'lucide-react'
import PageHeader from '../../components/layout/PageHeader'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import ErrorState from '../../components/common/ErrorState'
import Badge from '../../components/common/Badge'
import Button from '../../components/common/Button'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import { getEventById, publishEvent, cancelEvent } from '../../services/eventService'
import { createEnrollment } from '../../services/enrollmentService'
import { getApiErrorMessage } from '../../utils/apiError'
import { formatDateLong, formatTime } from '../../utils/date'
import { getEventStatusLabel, getEventStatusTone } from '../../utils/status'
import { useAuth } from '../../contexts/AuthContext'
import type { EventItem } from '../../types/event'

export default function EventDetailPage() {
  const { eventId } = useParams()
  const navigate = useNavigate()
  const { currentUser } = useAuth()

  const [event, setEvent] = useState<EventItem | null>(null)
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  const [enrolling, setEnrolling] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [canceling, setCanceling] = useState(false)
  const [confirmCancel, setConfirmCancel] = useState(false)
  const [confirmPublish, setConfirmPublish] = useState(false)

  useEffect(() => {
    if (!eventId) return
    let cancelled = false
    setError('')
    setEvent(null)
    getEventById(eventId)
      .then((data) => {
        if (!cancelled) setEvent(data)
      })
      .catch((err) => {
        if (!cancelled) setError(getApiErrorMessage(err))
      })
    return () => {
      cancelled = true
    }
  }, [eventId, reloadKey])

  const isOwnerOrganizer =
    currentUser?.role === 'ORGANIZER' && event && currentUser.id === event.organizer.id

  async function handleEnroll() {
    if (!currentUser || !event) return
    setEnrolling(true)
    try {
      const enrollment = await createEnrollment(event.id)
      toast.success('Inscrição realizada!')
      navigate(`/my-enrollments/${enrollment.id}`)
    } catch (err) {
      toast.error(getApiErrorMessage(err))
    } finally {
      setEnrolling(false)
    }
  }

  async function handlePublish() {
    if (!event) return
    setPublishing(true)
    try {
      await publishEvent(event.id)
      toast.success('Evento publicado com sucesso.')
      setConfirmPublish(false)
      setReloadKey((n) => n + 1)
    } catch (err) {
      toast.error(getApiErrorMessage(err))
    } finally {
      setPublishing(false)
    }
  }

  async function handleCancel() {
    if (!event) return
    setCanceling(true)
    try {
      await cancelEvent(event.id)
      toast.success('Evento cancelado.')
      setConfirmCancel(false)
      setReloadKey((n) => n + 1)
    } catch (err) {
      toast.error(getApiErrorMessage(err))
    } finally {
      setCanceling(false)
    }
  }

  if (!event && !error) {
    return (
      <div>
        <PageHeader title="Evento" back />
        <LoadingSpinner label="Carregando evento..." />
      </div>
    )
  }

  if (error || !event) {
    return (
      <div>
        <PageHeader title="Evento" back />
        <ErrorState message={error} onRetry={() => setReloadKey((n) => n + 1)} />
      </div>
    )
  }

  return (
    <div>
      <PageHeader title={event.title} back />

      <div className="rounded-2xl border border-ink-100 bg-white p-5">
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-lg font-semibold text-ink-900">{event.title}</h2>
          <Badge tone={getEventStatusTone(event.status)}>{getEventStatusLabel(event.status)}</Badge>
        </div>

        <p className="mt-3 text-[15px] leading-relaxed text-ink-700">{event.description}</p>

        <div className="mt-4 flex flex-col gap-2 text-sm text-ink-500">
          <span className="flex items-center gap-2">
            <CalendarDays className="size-4 shrink-0" aria-hidden />
            {formatDateLong(event.dateTime)} · {formatTime(event.dateTime)}
          </span>
          <span className="flex items-center gap-2">
            <MapPin className="size-4 shrink-0" aria-hidden />
            {event.location}
          </span>
          <span className="flex items-center gap-2">
            <Users className="size-4 shrink-0" aria-hidden />
            Capacidade: {event.capacity}
          </span>
        </div>

        <p className="mt-4 text-sm text-ink-500">Organizador: {event.organizer.name}</p>
      </div>

      {currentUser?.role === 'PARTICIPANT' && event.status === 'PUBLISHED' ? (
        <Button className="mt-5" size="lg" fullWidth loading={enrolling} onClick={handleEnroll}>
          Inscrever-se
        </Button>
      ) : null}

      {isOwnerOrganizer ? (
        <div className="mt-5 flex flex-col gap-2">
          {event.status === 'DRAFT' ? (
            <Button fullWidth onClick={() => setConfirmPublish(true)}>
              Publicar evento
            </Button>
          ) : null}
          {event.status === 'PUBLISHED' ? (
            <>
              <Button variant="secondary" fullWidth onClick={() => navigate(`/organizer/events/${event.id}/participants`)}>
                Ver inscritos
              </Button>
              <Button variant="secondary" fullWidth onClick={() => navigate(`/organizer/events/${event.id}/checkins`)}>
                Ver check-ins
              </Button>
              <Button fullWidth onClick={() => navigate(`/organizer/events/${event.id}/scanner`)}>
                Realizar check-in
              </Button>
            </>
          ) : null}
          {(event.status === 'DRAFT' || event.status === 'PUBLISHED') ? (
            <Button variant="danger" fullWidth onClick={() => setConfirmCancel(true)}>
              Cancelar evento
            </Button>
          ) : null}
        </div>
      ) : null}

      <ConfirmDialog
        open={confirmPublish}
        title="Publicar evento"
        message="Deseja publicar este evento?"
        confirmLabel="Publicar"
        loading={publishing}
        onConfirm={handlePublish}
        onCancel={() => setConfirmPublish(false)}
      />

      <ConfirmDialog
        open={confirmCancel}
        title="Cancelar evento"
        message="Tem certeza que deseja cancelar este evento?"
        confirmLabel="Cancelar evento"
        destructive
        loading={canceling}
        onConfirm={handleCancel}
        onCancel={() => setConfirmCancel(false)}
      />
    </div>
  )
}
