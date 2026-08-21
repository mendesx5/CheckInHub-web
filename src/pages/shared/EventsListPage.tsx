import { useEffect, useMemo, useState } from 'react'
import { Search, CalendarX } from 'lucide-react'
import PageHeader from '../../components/layout/PageHeader'
import EventCard from '../../components/events/EventCard'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import ErrorState from '../../components/common/ErrorState'
import EmptyState from '../../components/common/EmptyState'
import { getEvents } from '../../services/eventService'
import { getApiErrorMessage } from '../../utils/apiError'
import { useAuth } from '../../contexts/AuthContext'
import type { EventItem } from '../../types/event'

export default function EventsListPage() {
  const { currentUser } = useAuth()
  const [events, setEvents] = useState<EventItem[] | null>(null)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let cancelled = false
    setError('')
    setEvents(null)
    getEvents()
      .then((data) => {
        if (!cancelled) setEvents(data)
      })
      .catch((err) => {
        if (!cancelled) setError(getApiErrorMessage(err))
      })
    return () => {
      cancelled = true
    }
  }, [reloadKey])

  const visibleEvents = useMemo(() => {
    if (!events) return []
    // Participantes veem apenas eventos publicados disponíveis para inscrição.
    const base =
      currentUser?.role === 'PARTICIPANT'
        ? events.filter((e) => e.status === 'PUBLISHED')
        : events.filter((e) => e.status !== 'CANCELLED')

    if (!query.trim()) return base
    const q = query.trim().toLowerCase()
    return base.filter(
      (e) => e.title.toLowerCase().includes(q) || e.location.toLowerCase().includes(q),
    )
  }, [events, query, currentUser])

  return (
    <div>
      <PageHeader title="Eventos" subtitle="Encontre eventos e faça sua inscrição" />

      <div className="relative mb-4">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-300" aria-hidden />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por título ou local"
          aria-label="Buscar eventos"
          className="h-12 w-full rounded-xl border border-ink-100 bg-white pl-10 pr-3.5 text-base text-ink-900 placeholder:text-ink-300 focus-visible:outline-2 focus-visible:outline-brand-500"
        />
      </div>

      {events === null && !error ? <LoadingSpinner label="Carregando eventos..." /> : null}

      {error ? <ErrorState message={error} onRetry={() => setReloadKey((n) => n + 1)} /> : null}

      {events && !error && visibleEvents.length === 0 ? (
        <EmptyState icon={CalendarX} title="Nenhum evento encontrado." />
      ) : null}

      {events && !error && visibleEvents.length > 0 ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {visibleEvents.map((event) => (
            <EventCard key={event.id} event={event} to={`/events/${event.id}`} />
          ))}
        </div>
      ) : null}
    </div>
  )
}
