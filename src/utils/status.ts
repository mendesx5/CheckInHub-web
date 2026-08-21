import type { EventStatus } from '../types/event'
import type { EnrollmentStatus } from '../types/enrollment'

export function getEventStatusLabel(status: EventStatus): string {
  switch (status) {
    case 'DRAFT':
      return 'Rascunho'
    case 'PUBLISHED':
      return 'Publicado'
    case 'CANCELLED':
      return 'Cancelado'
    case 'CLOSED':
      return 'Encerrado'
    default:
      return status
  }
}

export type BadgeTone = 'neutral' | 'brand' | 'success' | 'danger' | 'warning'

export function getEventStatusTone(status: EventStatus): BadgeTone {
  switch (status) {
    case 'DRAFT':
      return 'neutral'
    case 'PUBLISHED':
      return 'success'
    case 'CANCELLED':
      return 'danger'
    case 'CLOSED':
      return 'warning'
    default:
      return 'neutral'
  }
}

export function getEnrollmentStatusLabel(status: EnrollmentStatus): string {
  switch (status) {
    case 'CONFIRMED':
      return 'Confirmada'
    case 'CANCELED':
      return 'Cancelada'
    default:
      return status
  }
}

export function getEnrollmentStatusTone(status: EnrollmentStatus): BadgeTone {
  switch (status) {
    case 'CONFIRMED':
      return 'success'
    case 'CANCELED':
      return 'danger'
    default:
      return 'neutral'
  }
}
