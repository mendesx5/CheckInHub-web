import { forwardRef } from 'react'
import type { SelectHTMLAttributes } from 'react'
import { ChevronDown } from 'lucide-react'

interface SelectOption {
  value: string
  label: string
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  options: SelectOption[]
  error?: string
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, id, className = '', ...rest }, ref) => {
    const inputId = id ?? rest.name
    return (
      <div className="flex flex-col gap-1.5">
        <label htmlFor={inputId} className="text-sm font-medium text-ink-700">
          {label}
        </label>
        <div className="relative">
          <select
            ref={ref}
            id={inputId}
            className={`h-12 w-full appearance-none rounded-xl border bg-white px-3.5 pr-10 text-base text-ink-900 focus-visible:outline-2 focus-visible:outline-brand-500 ${
              error ? 'border-danger-500' : 'border-ink-100 focus:border-brand-400'
            } ${className}`}
            aria-invalid={Boolean(error)}
            {...rest}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown
            className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-500"
            aria-hidden
          />
        </div>
        {error ? <span className="text-sm text-danger-500">{error}</span> : null}
      </div>
    )
  },
)

Select.displayName = 'Select'
export default Select
