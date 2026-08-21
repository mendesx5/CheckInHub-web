/**
 * Helpers de formatação de data/hora para o padrão brasileiro.
 * O backend envia LocalDateTime no formato "2026-10-20T19:00:00".
 */

function parse(dateTime: string): Date {
  return new Date(dateTime)
}

export function formatDate(dateTime: string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(parse(dateTime))
}

export function formatDateLong(dateTime: string): string {
  const formatted = new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
  }).format(parse(dateTime))
  return formatted.replace('.', '')
}

export function formatTime(dateTime: string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(parse(dateTime))
}

export function formatDateTime(dateTime: string): string {
  return `${formatDate(dateTime)} às ${formatTime(dateTime)}`
}

/** Converte um Date local para o formato aceito pelo backend (sem timezone). */
export function toLocalDateTimeString(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
    date.getHours(),
  )}:${pad(date.getMinutes())}:00`
}
