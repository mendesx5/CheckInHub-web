import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { TicketX } from 'lucide-react'
import PageHeader from '../../components/layout/PageHeader'
import EnrollmentCard from '../../components/enrollments/EnrollmentCard'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import ErrorState from '../../components/common/ErrorState'
import EmptyState from '../../components/common/EmptyState'
import Button from '../../components/common/Button'
import { getParticipantEnrollments } from '../../services/enrollmentService'
import { getApiErrorMessage } from '../../utils/apiError'
import { useAuth } from '../../contexts/AuthContext'
import type { Enrollment } from '../../types/enrollment'

export default function MyEnrollmentsPage() {
  const { currentUser } = useAuth()
  const [enrollments, setEnrollments] = useState<Enrollment[] | null>(null)
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    if (!currentUser) return
    let cancelled = false
    setError('')
    setEnrollments(null)
    getParticipantEnrollments()
      .then((data) => {
        if (!cancelled) setEnrollments(data)
      })
      .catch((err) => {
        if (!cancelled) setError(getApiErrorMessage(err))
      })
    return () => {
      cancelled = true
    }
  }, [currentUser, reloadKey])

  return (
    <div>
      <PageHeader title="Minhas inscrições" />

      {enrollments === null && !error ? <LoadingSpinner label="Carregando inscrições..." /> : null}

      {error ? <ErrorState message={error} onRetry={() => setReloadKey((n) => n + 1)} /> : null}

      {enrollments && !error && enrollments.length === 0 ? (
        <EmptyState
          icon={TicketX}
          title="Você ainda não possui inscrições."
          action={
            <Link to="/events">
              <Button>Explorar eventos</Button>
            </Link>
          }
        />
      ) : null}

      {enrollments && !error && enrollments.length > 0 ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {enrollments.map((enrollment) => (
            <EnrollmentCard key={enrollment.id} enrollment={enrollment} />
          ))}
        </div>
      ) : null}
    </div>
  )
}
