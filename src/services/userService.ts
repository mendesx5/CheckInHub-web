import api from './api'
import type { CreateUserPayload, User } from '../types/user'

export async function createUser(data: CreateUserPayload): Promise<User> {
  const response = await api.post<User>('/users', data)
  return response.data
}
