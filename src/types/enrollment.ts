import type { User } from './user'
import type { EventItem } from './event'

export type EnrollmentStatus = 'CONFIRMED' | 'CANCELED'

export interface Enrollment {
  id: number
  event: EventItem
  participant: User
  qrCodeToken: string
  status: EnrollmentStatus
  dateEnrollment: string
}

export interface CreateEnrollmentPayload {
  eventId: number
}
