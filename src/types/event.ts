import type { User } from './user'

export type EventStatus = 'DRAFT' | 'PUBLISHED' | 'CANCELLED' | 'CLOSED'

export interface EventItem {
  id: number
  title: string
  description: string
  dateTime: string
  location: string
  capacity: number
  status: EventStatus
  organizer: User
}

export interface CreateEventPayload {
  title: string
  description: string
  dateTime: string
  location: string
  capacity: number
}
