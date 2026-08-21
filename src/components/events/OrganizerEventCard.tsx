import { Link, useNavigate } from 'react-router-dom'
import { CalendarDays } from 'lucide-react'
import Card from '../common/Card'
import Badge from '../common/Badge'
import Button from '../common/Button'
import { formatDateLong, formatTime } from '../../utils/date'
import { getEventStatusLabel, getEventStatusTone } from '../../utils/status'
import type { EventItem } from '../../types/event'

interface OrganizerEventCardProps {
  event: EventItem
  onPublish: (event: EventItem) => void
  onCancel: (event: EventItem) => void
}

export default function OrganizerEventCard({ event, onPublish, onCancel }: OrganizerEventCardProps) {
  const navigate = useNavigate()

  return (
    <Card>
      <div className="flex items-start justify-between gap-3">
        <Link to={`/events/${event.id}`} className="min-w-0">
          <h3 className="truncate text-[15px] font-semibold text-ink-900">{event.title}</h3>
        </Link>
        <Badge tone={getEventStatusTone(event.status)}>{getEventStatusLabel(event.status)}</Badge>
      </div>

      <p className="mt-2 flex items-center gap-1.5 text-sm text-ink-500">
        <CalendarDays className="size-4 shrink-0" aria-hidden />
        {formatDateLong(event.dateTime)} · {formatTime(event.dateTime)}
      </p>
      <p className="mt-1 text-sm text-ink-500">Capacidade: {event.capacity}</p>

      <div className="mt-3 flex flex-wrap gap-2">
        <Button variant="secondary" size="md" onClick={() => navigate(`/events/${event.id}`)}>
          Ver detalhes
        </Button>

        {event.status === 'DRAFT' ? (
          <Button size="md" onClick={() => onPublish(event)}>
            Publicar
          </Button>
        ) : null}

        {event.status === 'PUBLISHED' ? (
          <>
            <Button
              variant="secondary"
              size="md"
              onClick={() => navigate(`/organizer/events/${event.id}/participants`)}
            >
              Ver inscritos
            </Button>
            <Button
              variant="secondary"
              size="md"
              onClick={() => navigate(`/organizer/events/${event.id}/checkins`)}
            >
              Ver check-ins
            </Button>
            <Button size="md" onClick={() => navigate(`/organizer/events/${event.id}/scanner`)}>
              Abrir scanner
            </Button>
          </>
        ) : null}

        {(event.status === 'DRAFT' || event.status === 'PUBLISHED') ? (
          <Button variant="danger" size="md" onClick={() => onCancel(event)}>
            Cancelar evento
          </Button>
        ) : null}
      </div>
    </Card>
  )
}
