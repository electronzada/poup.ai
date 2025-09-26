/**
 * Utilitários para cores semânticas do dashboard financeiro
 * Seguindo as recomendações de design: Clean & Trust
 */

export const semanticColors = {
  // Cores semânticas principais
  income: {
    light: '#16A34A', // Verde esmeralda
    dark: '#22C55E',
    bg: {
      light: '#F0FDF4',
      dark: '#052E16'
    }
  },
  expense: {
    light: '#EF4444', // Vermelho rubi
    dark: '#F87171',
    bg: {
      light: '#FEF2F2',
      dark: '#450A0A'
    }
  },
  transfer: {
    light: '#0EA5E9', // Azul petróleo
    dark: '#38BDF8',
    bg: {
      light: '#F0F9FF',
      dark: '#0C4A6E'
    }
  },
  neutral: {
    light: '#64748B', // Cinza azulado
    dark: '#9CA3AF',
    bg: {
      light: '#F8FAFC',
      dark: '#1F2937'
    }
  }
} as const

// Status de metas
export const goalStatusColors = {
  success: {
    light: '#16A34A', // Abaixo da meta (verde-suave)
    dark: '#22C55E',
    bg: {
      light: '#F0FDF4',
      dark: '#052E16'
    }
  },
  warning: {
    light: '#F59E0B', // Atenção 90-100% (âmbar)
    dark: '#FBBF24',
    bg: {
      light: '#FFFBEB',
      dark: '#451A03'
    }
  },
  danger: {
    light: '#EF4444', // Estourou a meta (vermelho-forte)
    dark: '#F87171',
    bg: {
      light: '#FEF2F2',
      dark: '#450A0A'
    }
  }
} as const

// Função para obter cor baseada no tipo de transação
export function getTransactionColor(type: 'income' | 'expense' | 'transfer', isDark = false) {
  const colors = semanticColors[type]
  return isDark ? colors.dark : colors.light
}

// Função para obter cor de fundo baseada no tipo de transação
export function getTransactionBgColor(type: 'income' | 'expense' | 'transfer', isDark = false) {
  const colors = semanticColors[type]
  return isDark ? colors.bg.dark : colors.bg.light
}

// Função para obter cor baseada no status da meta
export function getGoalStatusColor(percentage: number, isDark = false) {
  if (percentage < 90) {
    const colors = goalStatusColors.success
    return isDark ? colors.dark : colors.light
  } else if (percentage <= 100) {
    const colors = goalStatusColors.warning
    return isDark ? colors.dark : colors.light
  } else {
    const colors = goalStatusColors.danger
    return isDark ? colors.dark : colors.light
  }
}

// Função para obter cor de fundo baseada no status da meta
export function getGoalStatusBgColor(percentage: number, isDark = false) {
  if (percentage < 90) {
    const colors = goalStatusColors.success
    return isDark ? colors.bg.dark : colors.bg.light
  } else if (percentage <= 100) {
    const colors = goalStatusColors.warning
    return isDark ? colors.bg.dark : colors.bg.light
  } else {
    const colors = goalStatusColors.danger
    return isDark ? colors.bg.dark : colors.bg.light
  }
}

// Classes CSS para uso com Tailwind
export const semanticClasses = {
  income: {
    text: 'text-green-600 dark:text-green-400',
    bg: 'bg-green-50 dark:bg-green-950',
    border: 'border-green-200 dark:border-green-800'
  },
  expense: {
    text: 'text-red-600 dark:text-red-400',
    bg: 'bg-red-50 dark:bg-red-950',
    border: 'border-red-200 dark:border-red-800'
  },
  transfer: {
    text: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-50 dark:bg-blue-950',
    border: 'border-blue-200 dark:border-blue-800'
  },
  neutral: {
    text: 'text-slate-600 dark:text-slate-400',
    bg: 'bg-slate-50 dark:bg-slate-900',
    border: 'border-slate-200 dark:border-slate-700'
  }
} as const
