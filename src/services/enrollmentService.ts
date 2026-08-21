import api from './api'
import type { CreateEnrollmentPayload, Enrollment } from '../types/enrollment'

export async function createEnrollment(eventId: number): Promise<Enrollment> {
  const payload: CreateEnrollmentPayload = { eventId }
  const response = await api.post<Enrollment>('/enrollments', payload)
  return response.data
}

export async function getEnrollmentById(id: number | string): Promise<Enrollment> {
  const response = await api.get<Enrollment>(`/enrollments/${id}`)
  return response.data
}

export async function cancelEnrollment(id: number | string): Promise<void> {
  await api.delete(`/enrollments/${id}`)
}

export async function getEnrollmentQrCodeBlobUrl(id: number | string): Promise<string> {
  const response = await api.get(`/enrollments/${id}/qrcode`, { responseType: 'blob' })
  return URL.createObjectURL(response.data as Blob)
}

export async function getParticipantEnrollments(): Promise<Enrollment[]> {
  const response = await api.get<Enrollment[]>('/enrollments/me')
  return response.data
}

export async function getEventEnrollments(eventId: number): Promise<Enrollment[]> {
  const response = await api.get<Enrollment[]>(`/enrollments/event/${eventId}`)
  return response.data
}
