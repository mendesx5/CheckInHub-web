import type { User } from './user'

export interface CheckIn {
  id: number
  enrollmentId: number
  participantName: string
  eventTitle: string
  checkInDateTime: string
  validatedBy: User | null
}

export interface CreateCheckInPayload {
  qrCodeToken: string
}
