import { forwardRef } from 'react'
import type { TextareaHTMLAttributes } from 'react'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  error?: string
  hint?: string
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, id, className = '', ...rest }, ref) => {
    const inputId = id ?? rest.name
    return (
      <div className="flex flex-col gap-1.5">
        <label htmlFor={inputId} className="text-sm font-medium text-ink-700">
          {label}
        </label>
        <textarea
          ref={ref}
          id={inputId}
          rows={4}
          className={`rounded-xl border px-3.5 py-3 text-base text-ink-900 placeholder:text-ink-300 focus-visible:outline-2 focus-visible:outline-brand-500 ${
            error ? 'border-danger-500' : 'border-ink-100 focus:border-brand-400'
          } ${className}`}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          {...rest}
        />
        {error ? (
          <span id={`${inputId}-error`} className="text-sm text-danger-500">
            {error}
          </span>
        ) : hint ? (
          <span id={`${inputId}-hint`} className="text-sm text-ink-500">
            {hint}
          </span>
        ) : null}
      </div>
    )
  },
)

Textarea.displayName = 'Textarea'
export default Textarea
