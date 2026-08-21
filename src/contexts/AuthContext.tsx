import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { User } from '../types/user'
import { loginRequest } from '../services/authService'
import { clearSession, getStoredToken, getStoredUser, storeSession } from '../services/authStorage'

interface AuthContextValue {
  currentUser: User | null
  token: string | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<User>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(() => getStoredUser())
  const [token, setToken] = useState<string | null>(() => getStoredToken())

  const login = useCallback(async (email: string, password: string) => {
    const response = await loginRequest({ email, password })
    storeSession(response.token, response.user)
    setToken(response.token)
    setCurrentUser(response.user)
    return response.user
  }, [])

  const logout = useCallback(() => {
    clearSession()
    setToken(null)
    setCurrentUser(null)
  }, [])

  const value = useMemo(
    () => ({ currentUser, token, isAuthenticated: Boolean(token && currentUser), login, logout }),
    [currentUser, token, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  return ctx
}
