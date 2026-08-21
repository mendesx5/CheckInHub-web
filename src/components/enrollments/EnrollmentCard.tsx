import { Link } from 'react-router-dom'
import { CalendarDays, MapPin, ArrowRight } from 'lucide-react'
import Card from '../common/Card'
import Badge from '../common/Badge'
import { formatDateLong, formatTime } from '../../utils/date'
import { getEnrollmentStatusLabel, getEnrollmentStatusTone } from '../../utils/status'
import type { Enrollment } from '../../types/enrollment'

export default function EnrollmentCard({ enrollment }: { enrollment: Enrollment }) {
  return (
    <Link to={`/my-enrollments/${enrollment.id}`} className="block">
      <Card className="transition-shadow hover:shadow-[0_2px_10px_rgba(20,18,31,0.08)] active:bg-ink-50">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-[15px] font-semibold text-ink-900">{enrollment.event.title}</h3>
          <Badge tone={getEnrollmentStatusTone(enrollment.status)}>
            {getEnrollmentStatusLabel(enrollment.status)}
          </Badge>
        </div>
        <div className="mt-3 flex flex-col gap-1.5 text-sm text-ink-500">
          <span className="flex items-center gap-1.5">
            <CalendarDays className="size-4 shrink-0" aria-hidden />
            {formatDateLong(enrollment.event.dateTime)} · {formatTime(enrollment.event.dateTime)}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="size-4 shrink-0" aria-hidden />
            <span className="truncate">{enrollment.event.location}</span>
          </span>
        </div>
        <div className="mt-3 flex items-center justify-end text-sm font-medium text-brand-600">
          Ver ingresso
          <ArrowRight className="ml-1 size-4" aria-hidden />
        </div>
      </Card>
    </Link>
  )
}
