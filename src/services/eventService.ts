import api from './api'
import type { CreateEventPayload, EventItem } from '../types/event'

export async function getEvents(): Promise<EventItem[]> {
  const response = await api.get<EventItem[]>('/events')
  return response.data
}

export async function getEventById(id: number | string): Promise<EventItem> {
  const response = await api.get<EventItem>(`/events/${id}`)
  return response.data
}

export async function getOrganizerEvents(): Promise<EventItem[]> {
  const response = await api.get<EventItem[]>('/events/my-events')
  return response.data
}

export async function createEvent(data: CreateEventPayload): Promise<EventItem> {
  const response = await api.post<EventItem>('/events', data)
  return response.data
}

export async function publishEvent(id: number | string): Promise<void> {
  await api.put(`/events/publish/${id}`)
}

export async function cancelEvent(id: number | string): Promise<void> {
  await api.delete(`/events/${id}`)
}
