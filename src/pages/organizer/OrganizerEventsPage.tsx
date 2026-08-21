import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { CalendarPlus } from 'lucide-react'
import PageHeader from '../../components/layout/PageHeader'
import OrganizerEventCard from '../../components/events/OrganizerEventCard'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import ErrorState from '../../components/common/ErrorState'
import EmptyState from '../../components/common/EmptyState'
import Button from '../../components/common/Button'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import { getOrganizerEvents, publishEvent, cancelEvent } from '../../services/eventService'
import { getApiErrorMessage } from '../../utils/apiError'
import { useAuth } from '../../contexts/AuthContext'
import type { EventItem } from '../../types/event'

export default function OrganizerEventsPage() {
  const { currentUser } = useAuth()
  const [events, setEvents] = useState<EventItem[] | null>(null)
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  const [publishTarget, setPublishTarget] = useState<EventItem | null>(null)
  const [cancelTarget, setCancelTarget] = useState<EventItem | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    if (!currentUser) return
    let cancelled = false
    setError('')
    setEvents(null)
    getOrganizerEvents()
      .then((data) => {
        if (!cancelled) setEvents(data)
      })
      .catch((err) => {
        if (!cancelled) setError(getApiErrorMessage(err))
      })
    return () => {
      cancelled = true
    }
  }, [currentUser, reloadKey])

  async function handleConfirmPublish() {
    if (!publishTarget) return
    setActionLoading(true)
    try {
      await publishEvent(publishTarget.id)
      toast.success('Evento publicado com sucesso.')
      setPublishTarget(null)
      setReloadKey((n) => n + 1)
    } catch (err) {
      toast.error(getApiErrorMessage(err))
    } finally {
      setActionLoading(false)
    }
  }

  async function handleConfirmCancel() {
    if (!cancelTarget) return
    setActionLoading(true)
    try {
      await cancelEvent(cancelTarget.id)
      toast.success('Evento cancelado.')
      setCancelTarget(null)
      setReloadKey((n) => n + 1)
    } catch (err) {
      toast.error(getApiErrorMessage(err))
    } finally {
      setActionLoading(false)
    }
  }

  return (
    <div>
      <PageHeader
        title="Meus eventos"
        action={
          <Link to="/organizer/events/new">
            <Button size="md" icon={<CalendarPlus className="size-4" />}>
              Criar
            </Button>
          </Link>
        }
      />

      {events === null && !error ? <LoadingSpinner label="Carregando eventos..." /> : null}

      {error ? <ErrorState message={error} onRetry={() => setReloadKey((n) => n + 1)} /> : null}

      {events && !error && events.length === 0 ? (
        <EmptyState
          icon={CalendarPlus}
          title="Você ainda não criou nenhum evento."
          action={
            <Link to="/organizer/events/new">
              <Button>Criar primeiro evento</Button>
            </Link>
          }
        />
      ) : null}

      {events && !error && events.length > 0 ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {events.map((event) => (
            <OrganizerEventCard
              key={event.id}
              event={event}
              onPublish={setPublishTarget}
              onCancel={setCancelTarget}
            />
          ))}
        </div>
      ) : null}

      <ConfirmDialog
        open={Boolean(publishTarget)}
        title="Publicar evento"
        message="Deseja publicar este evento?"
        confirmLabel="Publicar"
        loading={actionLoading}
        onConfirm={handleConfirmPublish}
        onCancel={() => setPublishTarget(null)}
      />

      <ConfirmDialog
        open={Boolean(cancelTarget)}
        title="Cancelar evento"
        message="Tem certeza que deseja cancelar este evento?"
        confirmLabel="Cancelar evento"
        destructive
        loading={actionLoading}
        onConfirm={handleConfirmCancel}
        onCancel={() => setCancelTarget(null)}
      />
    </div>
  )
}
