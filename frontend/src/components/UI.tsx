import React, { useState } from 'react'
import { LucideIcon, Eye, EyeOff } from 'lucide-react'

interface CardProps {
  children?: React.ReactNode
  className?: string
  title?: string
  action?: React.ReactNode
}

export const Card = ({
  children,
  className = '',
  title,
  action,
}: CardProps) => (
  <div
    className={`bg-white rounded-[10px] shadow-[0_2px_6px_rgba(0,0,0,0.05)] border border-border overflow-hidden ${className}`}
  >
    {(title || action) && (
      <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-white">
        {title && (
          <h2 className="text-[18px] font-semibold text-textMain">{title}</h2>
        )}
        {action && <div>{action}</div>}
      </div>
    )}
    <div className="p-6">{children}</div>
  </div>
)

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  icon?: LucideIcon
  size?: 'sm' | 'md'
  className?: string
  children?: React.ReactNode
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  type?: 'button' | 'submit' | 'reset'
}

export const Button = ({
  children,
  variant = 'primary',
  icon: Icon,
  size = 'md',
  className = '',
  ...props
}: ButtonProps) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'

  const sizeStyles =
    size === 'sm'
      ? 'px-3 py-1.5 text-sm rounded-[5px]'
      : 'px-4 py-2 text-[14px] h-[36px] rounded-[6px]'

  const variants = {
    primary: 'bg-primary hover:bg-primaryHover text-white focus:ring-primary',
    secondary:
      'bg-surfaceHighlight text-primary border border-secondary hover:bg-[#d8efe2] focus:ring-secondary',
    danger:
      'bg-statusRejected hover:bg-[#a63a3a] text-white focus:ring-statusRejected',
    ghost: 'bg-transparent text-textSec hover:text-textMain hover:bg-gray-100',
  }

  return (
    <button
      className={`${baseStyles} ${sizeStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {Icon && <Icon className={`w-4 h-4 ${children ? 'mr-2' : ''}`} />}
      {children}
    </button>
  )
}

export const Badge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    APROVADA: 'bg-green-100 text-statusApproved border-green-200',
    PENDENTE: 'bg-orange-100 text-statusPending border-orange-200',
    REPROVADA: 'bg-red-100 text-statusRejected border-red-200',
    RASCUNHO: 'bg-gray-100 text-textSec border-gray-200',
    ATIVO: 'bg-blue-100 text-blue-700 border-blue-200',
    ATIVA: 'bg-blue-100 text-blue-700 border-blue-200',
    ENCERRADO: 'bg-gray-100 text-gray-500 border-gray-200',
    CONCLUIDA: 'bg-gray-100 text-gray-500 border-gray-200',
  }

  const label = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()

  return (
    <span
      className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status] || 'bg-gray-100 text-gray-800'}`}
    >
      {label}
    </span>
  )
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  className?: string
  placeholder?: string
  type?: string
  value?: string | number | readonly string[]
  onChange?: React.ChangeEventHandler<HTMLInputElement>
}

export const Input = ({
  label,
  error,
  className = '',
  ...props
}: InputProps) => (
  <div className="flex flex-col gap-1.5 w-full">
    {label && (
      <label className="text-[14px] text-textSec font-medium">{label}</label>
    )}
    <input
      className={`h-[38px] px-3 rounded-[4px] border border-border bg-white text-textMain text-sm focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary disabled:bg-gray-50 ${error ? 'border-statusRejected' : ''} ${className}`}
      {...props}
    />
    {error && <span className="text-xs text-statusRejected">{error}</span>}
  </div>
)

interface PasswordInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'type'
> {
  label?: string
  error?: string
  className?: string
  placeholder?: string
  value?: string
  onChange?: React.ChangeEventHandler<HTMLInputElement>
}

export const PasswordInput = ({
  label,
  error,
  className = '',
  ...props
}: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label className="text-[14px] text-textSec font-medium">{label}</label>
      )}
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          className={`h-[38px] pl-3 pr-10 rounded-[4px] border border-border bg-white text-textMain text-sm focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary disabled:bg-gray-50 w-full ${error ? 'border-statusRejected' : ''} ${className}`}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-textSec hover:text-textMain transition-colors"
          tabIndex={-1}
        >
          {showPassword ? (
            <EyeOff className="w-4 h-4" />
          ) : (
            <Eye className="w-4 h-4" />
          )}
        </button>
      </div>
      {error && <span className="text-xs text-statusRejected">{error}</span>}
    </div>
  )
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: { value: string; label: string }[]
  className?: string
  placeholder?: string
  value?: string
  onChange?: React.ChangeEventHandler<HTMLSelectElement>
}

export const Select = ({
  label,
  error,
  options,
  className = '',
  placeholder,
  ...props
}: SelectProps) => (
  <div className="flex flex-col gap-1.5 w-full">
    {label && (
      <label className="text-[14px] text-textSec font-medium">{label}</label>
    )}
    <select
      className={`h-[38px] px-3 rounded-[4px] border border-border bg-white text-textMain text-sm focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary disabled:bg-gray-50 ${error ? 'border-statusRejected' : ''} ${className}`}
      {...props}
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    {error && <span className="text-xs text-statusRejected">{error}</span>}
  </div>
)

export const Table = ({
  children,
  ...props
}: React.ComponentProps<'table'>) => (
  <div className="w-full overflow-x-auto custom-scroll border border-border rounded-[6px]">
    <table className="w-full text-left border-collapse" {...props}>
      {children}
    </table>
  </div>
)

export const Thead = ({
  children,
  ...props
}: React.ComponentProps<'thead'>) => (
  <thead
    className="bg-surfaceHighlight text-textMain text-[13px] font-medium border-b border-border"
    {...props}
  >
    {children}
  </thead>
)

export const Th = ({
  children,
  className = '',
  ...props
}: React.ComponentProps<'th'>) => (
  <th className={`px-4 py-3 whitespace-nowrap ${className}`} {...props}>
    {children}
  </th>
)

export const Tr = ({
  children,
  className = '',
  ...props
}: React.ComponentProps<'tr'>) => (
  <tr
    className={`border-b border-border last:border-0 hover:bg-gray-50 transition-colors text-[13px] text-textMain ${props.onClick ? 'cursor-pointer' : ''} ${className}`}
    {...props}
  >
    {children}
  </tr>
)

export const Td = ({
  children,
  className = '',
  ...props
}: React.ComponentProps<'td'>) => (
  <td className={`px-4 py-3 align-middle ${className}`} {...props}>
    {children}
  </td>
)

interface DateInputProps {
  label?: string
  error?: string
  className?: string
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  disabled?: boolean
}

export const DateInput = ({
  label,
  error,
  className = '',
  placeholder = 'DD/MM/AAAA',
  value = '',
  onChange,
  disabled = false,
}: DateInputProps) => {
  const inputRef = React.useRef<HTMLInputElement>(null)

  const formatToDisplay = (isoDate: string): string => {
    if (!isoDate) return ''
    const [year, month, day] = isoDate.split('-')
    return `${day}/${month}/${year}`
  }

  const formatToISO = (displayDate: string): string => {
    const digitsOnly = displayDate.replace(/\D/g, '')
    if (digitsOnly.length !== 8) return ''

    const day = digitsOnly.slice(0, 2)
    const month = digitsOnly.slice(2, 4)
    const year = digitsOnly.slice(4, 8)

    return `${year}-${month}-${day}`
  }

  const [displayValue, setDisplayValue] = useState(formatToDisplay(value))

  React.useEffect(() => {
    setDisplayValue(formatToDisplay(value))
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    const digitsOnly = newValue.replace(/\D/g, '').slice(0, 8)

    let masked = ''
    for (let i = 0; i < digitsOnly.length; i++) {
      if (i === 2 || i === 4) {
        masked += '/'
      }
      masked += digitsOnly[i]
    }

    if (
      newValue.endsWith('/') &&
      (digitsOnly.length === 2 || digitsOnly.length === 4)
    ) {
      if (!masked.endsWith('/')) {
        masked += '/'
      }
    }

    setDisplayValue(masked)

    if (digitsOnly.length === 8) {
      const isoDate = formatToISO(masked)
      const date = new Date(isoDate)
      if (!isNaN(date.getTime()) && onChange) {
        onChange(isoDate)
      }
    } else if (digitsOnly.length === 0 && onChange) {
      onChange('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const input = inputRef.current
    if (!input) return

    const cursorPos = input.selectionStart || 0

    if (e.key === 'ArrowRight' && (cursorPos === 2 || cursorPos === 5)) {
      e.preventDefault()
      input.setSelectionRange(cursorPos + 1, cursorPos + 1)
    }

    if (e.key === 'ArrowLeft' && (cursorPos === 3 || cursorPos === 6)) {
      e.preventDefault()
      input.setSelectionRange(cursorPos - 1, cursorPos - 1)
    }

    if (
      !/^\d$/.test(e.key) &&
      !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', '/'].includes(
        e.key
      )
    ) {
      if (!e.metaKey && !e.ctrlKey) {
        e.preventDefault()
      }
    }
  }

  const handleBlur = () => {
    if (displayValue) {
      const digitsOnly = displayValue.replace(/\D/g, '')
      if (digitsOnly.length === 8) {
        const isoDate = formatToISO(displayValue)
        const date = new Date(isoDate)
        if (!isNaN(date.getTime())) {
          setDisplayValue(formatToDisplay(isoDate))
        }
      }
    }
  }

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label className="text-[14px] text-textSec font-medium">{label}</label>
      )}
      <input
        ref={inputRef}
        type="text"
        className={`h-[38px] px-3 rounded-[4px] border border-border bg-white text-textMain text-sm focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary disabled:bg-gray-50 ${error ? 'border-statusRejected' : ''} ${className}`}
        placeholder={placeholder}
        value={displayValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        disabled={disabled}
        maxLength={10}
      />
      {error && <span className="text-xs text-statusRejected">{error}</span>}
    </div>
  )
}
