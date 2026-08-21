export type UserRole = 'ORGANIZER' | 'PARTICIPANT'

export interface User {
  id: number
  name: string
  email?: string
  role: UserRole
}

export interface CreateUserPayload {
  name: string
  email: string
  password: string
  role: UserRole
}
