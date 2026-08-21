import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { UsersRound } from 'lucide-react'
import PageHeader from '../../components/layout/PageHeader'
import Card from '../../components/common/Card'
import Badge from '../../components/common/Badge'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import ErrorState from '../../components/common/ErrorState'
import EmptyState from '../../components/common/EmptyState'
import { getEventEnrollments } from '../../services/enrollmentService'
import { getApiErrorMessage } from '../../utils/apiError'
import { formatDateTime } from '../../utils/date'
import { getEnrollmentStatusLabel, getEnrollmentStatusTone } from '../../utils/status'
import type { Enrollment } from '../../types/enrollment'

export default function EventParticipantsPage() {
  const { eventId } = useParams()
  const [enrollments, setEnrollments] = useState<Enrollment[] | null>(null)
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    if (!eventId) return
    let cancelled = false
    setError('')
    setEnrollments(null)
    getEventEnrollments(Number(eventId))
      .then((data) => {
        if (!cancelled) setEnrollments(data)
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
      <PageHeader title="Inscritos" back />

      {enrollments === null && !error ? <LoadingSpinner label="Carregando inscritos..." /> : null}

      {error ? <ErrorState message={error} onRetry={() => setReloadKey((n) => n + 1)} /> : null}

      {enrollments && !error && enrollments.length === 0 ? (
        <EmptyState icon={UsersRound} title="Nenhum inscrito ainda." />
      ) : null}

      {enrollments && !error && enrollments.length > 0 ? (
        <>
          {/* Mobile: cards */}
          <div className="flex flex-col gap-3 sm:hidden">
            {enrollments.map((enrollment) => (
              <Card key={enrollment.id}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-[15px] font-semibold text-ink-900">
                      {enrollment.participant.name}
                    </p>
                    {enrollment.participant.email ? (
                      <p className="truncate text-sm text-ink-500">{enrollment.participant.email}</p>
                    ) : null}
                  </div>
                  <Badge tone={getEnrollmentStatusTone(enrollment.status)}>
                    {getEnrollmentStatusLabel(enrollment.status)}
                  </Badge>
                </div>
                <p className="mt-2 text-sm text-ink-500">
                  Inscrito em {formatDateTime(enrollment.dateEnrollment)}
                </p>
              </Card>
            ))}
          </div>

          {/* Tablet/desktop: table */}
          <div className="hidden overflow-hidden rounded-2xl border border-ink-100 bg-white sm:block">
            <table className="w-full text-left text-sm">
              <thead className="bg-ink-50 text-ink-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Nome</th>
                  <th className="px-4 py-3 font-medium">E-mail</th>
                  <th className="px-4 py-3 font-medium">Data da inscrição</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {enrollments.map((enrollment) => (
                  <tr key={enrollment.id} className="border-t border-ink-100">
                    <td className="px-4 py-3 text-ink-900">{enrollment.participant.name}</td>
                    <td className="px-4 py-3 text-ink-500">{enrollment.participant.email ?? '—'}</td>
                    <td className="px-4 py-3 text-ink-500">{formatDateTime(enrollment.dateEnrollment)}</td>
                    <td className="px-4 py-3">
                      <Badge tone={getEnrollmentStatusTone(enrollment.status)}>
                        {getEnrollmentStatusLabel(enrollment.status)}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : null}
    </div>
  )
}
