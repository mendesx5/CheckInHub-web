import { isAxiosError } from 'axios'

const FALLBACK_MESSAGE = 'Não foi possível completar a operação.'

/**
 * Extrai uma mensagem amigável de um erro de requisição.
 * Tolerante ao formato exato de erro do backend, já que o
 * tratamento global de exceções ainda será implementado.
 */
export function getApiErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    const data = error.response?.data

    if (data) {
      if (typeof data === 'string' && data.trim().length > 0) {
        return data
      }
      if (typeof data === 'object') {
        const maybeMessage = (data as Record<string, unknown>).message
        const maybeError = (data as Record<string, unknown>).error
        if (typeof maybeMessage === 'string' && maybeMessage.trim().length > 0) {
          return maybeMessage
        }
        if (typeof maybeError === 'string' && maybeError.trim().length > 0) {
          return maybeError
        }
      }
    }

    if (error.code === 'ERR_NETWORK') {
      return 'Não foi possível conectar ao servidor. Verifique sua conexão.'
    }
  }

  return FALLBACK_MESSAGE
}
