import type { ReactNode } from 'react'
import { act, renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AuthProvider, useAuth } from './AuthContext'
import { loginRequest } from '../services/authService'
import * as authStorage from '../services/authStorage'
import type { User } from '../types/user'

vi.mock('../services/authService', () => ({
  loginRequest: vi.fn(),
}))

vi.mock('../services/authStorage', () => ({
  getStoredToken: vi.fn(),
  getStoredUser: vi.fn(),
  storeSession: vi.fn(),
  clearSession: vi.fn(),
}))

const mockedLoginRequest = vi.mocked(loginRequest)
const mockedAuthStorage = vi.mocked(authStorage)

const organizer: User = {
  id: 1,
  name: 'Gabriel',
  email: 'gabriel@test.com',
  role: 'ORGANIZER',
}

function wrapper({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>
}

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockedAuthStorage.getStoredToken.mockReturnValue(null)
    mockedAuthStorage.getStoredUser.mockReturnValue(null)
  })

  it('autentica o usuário e guarda a sessão após login', async () => {
    mockedLoginRequest.mockResolvedValue({ token: 'jwt-token', user: organizer })

    const { result } = renderHook(() => useAuth(), { wrapper })

    expect(result.current.isAuthenticated).toBe(false)

    await act(async () => {
      await result.current.login('gabriel@test.com', 'secret123')
    })

    await waitFor(() => expect(result.current.isAuthenticated).toBe(true))
    expect(result.current.currentUser).toEqual(organizer)
    expect(mockedAuthStorage.storeSession).toHaveBeenCalledWith('jwt-token', organizer)
  })

  it('limpa a sessão ao fazer logout', async () => {
    mockedLoginRequest.mockResolvedValue({ token: 'jwt-token', user: organizer })
    const { result } = renderHook(() => useAuth(), { wrapper })

    await act(async () => {
      await result.current.login('gabriel@test.com', 'secret123')
    })

    act(() => {
      result.current.logout()
    })

    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.currentUser).toBeNull()
    expect(mockedAuthStorage.clearSession).toHaveBeenCalled()
  })

  it('propaga o erro quando o login falha e mantém o estado deslogado', async () => {
    mockedLoginRequest.mockRejectedValue(new Error('Credenciais inválidas'))

    const { result } = renderHook(() => useAuth(), { wrapper })

    await expect(
      act(async () => {
        await result.current.login('gabriel@test.com', 'senha-errada')
      }),
    ).rejects.toThrow('Credenciais inválidas')

    expect(result.current.isAuthenticated).toBe(false)
    expect(mockedAuthStorage.storeSession).not.toHaveBeenCalled()
  })
})
