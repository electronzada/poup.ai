import { cn } from "@/lib/utils"
import { semanticClasses } from "@/lib/semantic-colors"

interface SemanticBadgeProps {
  type: 'income' | 'expense' | 'transfer' | 'neutral'
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'outline' | 'ghost'
}

export function SemanticBadge({ 
  type, 
  children, 
  className,
  variant = 'default' 
}: SemanticBadgeProps) {
  const baseClasses = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors"
  
  const variantClasses = {
    default: semanticClasses[type].bg,
    outline: `border ${semanticClasses[type].border} ${semanticClasses[type].text}`,
    ghost: `hover:${semanticClasses[type].bg} ${semanticClasses[type].text}`
  }

  return (
    <span 
      className={cn(
        baseClasses,
        variantClasses[variant],
        variant === 'default' && semanticClasses[type].text,
        className
      )}
    >
      {children}
    </span>
  )
}

interface TransactionTypeBadgeProps {
  type: 'income' | 'expense' | 'transfer'
  amount?: number
  className?: string
}

export function TransactionTypeBadge({ type, amount, className }: TransactionTypeBadgeProps) {
  const labels = {
    income: 'Receita',
    expense: 'Despesa',
    transfer: 'Transferência'
  }

  const icons = {
    income: '↗',
    expense: '↘',
    transfer: '↔'
  }

  return (
    <SemanticBadge type={type} className={className}>
      <span className="mr-1">{icons[type]}</span>
      {labels[type]}
      {amount && (
        <span className="ml-1 font-mono">
          {type === 'expense' ? '-' : type === 'income' ? '+' : ''}
          R$ {amount.toFixed(2)}
        </span>
      )}
    </SemanticBadge>
  )
}

interface GoalStatusBadgeProps {
  percentage: number
  className?: string
}

export function GoalStatusBadge({ percentage, className }: GoalStatusBadgeProps) {
  const getStatus = (percentage: number) => {
    if (percentage < 90) return { type: 'success' as const, label: 'No prazo', icon: '✓' }
    if (percentage <= 100) return { type: 'warning' as const, label: 'Atenção', icon: '⚠' }
    return { type: 'danger' as const, label: 'Estourou', icon: '⚠' }
  }

  const status = getStatus(percentage)
  
  const statusClasses = {
    success: 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-400 dark:border-green-800',
    warning: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-800',
    danger: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-400 dark:border-red-800'
  }

  return (
    <span 
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        statusClasses[status.type],
        className
      )}
    >
      <span className="mr-1">{status.icon}</span>
      {status.label} ({percentage.toFixed(0)}%)
    </span>
  )
}
