import api from './api'
import type { CheckIn, CreateCheckInPayload } from '../types/checkin'

export async function createCheckIn(qrCodeToken: string): Promise<CheckIn> {
  const payload: CreateCheckInPayload = { qrCodeToken }
  const response = await api.post<CheckIn>('/check-in', payload)
  return response.data
}

export async function getEventCheckIns(eventId: number | string): Promise<CheckIn[]> {
  const response = await api.get<CheckIn[]>(`/check-in/event/${eventId}`)
  return response.data
}
