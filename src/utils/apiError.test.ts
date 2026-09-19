import { describe, expect, it } from 'vitest'
import type { AxiosError } from 'axios'
import { getApiErrorMessage } from './apiError'

/**
 * Builds a minimal object satisfying axios's isAxiosError() check
 * (it only looks at `isAxiosError === true`), without depending on
 * AxiosError's internal constructor shape.
 */
function buildAxiosError(data: unknown, code?: string): AxiosError {
  return {
    isAxiosError: true,
    name: 'AxiosError',
    message: 'Request failed',
    code,
    toJSON: () => ({}),
    response: {
      data,
      status: 400,
      statusText: 'Bad Request',
      headers: {},
      config: {} as never,
    },
  } as unknown as AxiosError
}

describe('getApiErrorMessage', () => {
  it('retorna a mensagem do ApiError do backend (campo "message")', () => {
    const error = buildAxiosError({
      status: 400,
      error: 'Bad Request',
      message: 'O evento já está com o número máximo de participantes',
      timestamp: '2026-09-19T10:00:00',
    })

    expect(getApiErrorMessage(error)).toBe(
      'O evento já está com o número máximo de participantes',
    )
  })

  it('recorre ao campo "error" quando "message" não existe', () => {
    const error = buildAxiosError({ error: 'Forbidden' })

    expect(getApiErrorMessage(error)).toBe('Forbidden')
  })

  it('aceita uma string simples como corpo de erro', () => {
    const error = buildAxiosError('Token inválido ou expirado')

    expect(getApiErrorMessage(error)).toBe('Token inválido ou expirado')
  })

  it('detecta falha de rede', () => {
    const error = buildAxiosError(undefined, 'ERR_NETWORK')

    expect(getApiErrorMessage(error)).toBe(
      'Não foi possível conectar ao servidor. Verifique sua conexão.',
    )
  })

  it('usa a mensagem padrão quando não há nada aproveitável', () => {
    expect(getApiErrorMessage(new Error('erro genérico'))).toBe(
      'Não foi possível completar a operação.',
    )
  })
})
