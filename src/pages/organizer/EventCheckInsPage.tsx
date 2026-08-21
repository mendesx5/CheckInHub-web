import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { UserCheck } from 'lucide-react'
import PageHeader from '../../components/layout/PageHeader'
import Card from '../../components/common/Card'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import ErrorState from '../../components/common/ErrorState'
import EmptyState from '../../components/common/EmptyState'
import { getEventCheckIns } from '../../services/checkInService'
import { getApiErrorMessage } from '../../utils/apiError'
import { formatTime } from '../../utils/date'
import type { CheckIn } from '../../types/checkin'

export default function EventCheckInsPage() {
  const { eventId } = useParams()
  const [checkIns, setCheckIns] = useState<CheckIn[] | null>(null)
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    if (!eventId) return
    let cancelled = false
    setError('')
    setCheckIns(null)
    getEventCheckIns(eventId)
      .then((data) => {
        if (!cancelled) setCheckIns(data)
      })
      .catch((err) => {
        if (!cancelled) setError(getApiErrorMessage(err))
      })
    return () => {
      cancelled = true
    }
  }, [eventId, reloadKey])

  return (
    <div>
      <PageHeader title="Check-ins" subtitle={checkIns ? `Total presentes: ${checkIns.length}` : undefined} back />

      {checkIns === null && !error ? <LoadingSpinner label="Carregando check-ins..." /> : null}

      {error ? <ErrorState message={error} onRetry={() => setReloadKey((n) => n + 1)} /> : null}

      {checkIns && !error && checkIns.length === 0 ? (
        <EmptyState icon={UserCheck} title="Nenhum participante realizou check-in ainda." />
      ) : null}

      {checkIns && !error && checkIns.length > 0 ? (
        <div className="flex flex-col gap-3">
          {checkIns.map((checkIn) => (
            <Card key={checkIn.id}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-[15px] font-semibold text-ink-900">
                    {checkIn.participantName}
                  </p>
                  <p className="text-sm text-ink-500">Inscrição #{checkIn.enrollmentId}</p>
                </div>
                <span className="shrink-0 text-sm font-medium text-ink-700">
                  {formatTime(checkIn.checkInDateTime)}
                </span>
              </div>
              {checkIn.validatedBy ? (
                <p className="mt-2 text-sm text-ink-500">Validado por {checkIn.validatedBy.name}</p>
              ) : null}
            </Card>
          ))}
        </div>
      ) : null}
    </div>
  )
}
