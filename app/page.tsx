import prisma from '@/lib/prisma'
import type { DateRange } from "react-day-picker"
import { subDays } from "date-fns"
import { KpiCard } from "@/components/ui/kpi-card"
import { DateRangeFilter } from "@/components/filters/date-range-filter"
import { DashboardCharts } from "@/components/dashboard/dashboard-charts"
import { DashboardFilters } from "@/components/dashboard/dashboard-filters"
import { TrendingUp, TrendingDown, Receipt, DollarSign } from "lucide-react"
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'

interface DashboardStats {
  overview: {
    totalAccounts: number
    totalTransactions: number
    totalBalance: number
    totalIncome: number
    totalExpenses: number
    netIncome: number
  }
}

export default async function DashboardPage({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  // Obter usuário logado
  const session = await getServerSession(authOptions as any)
  
  if (!session?.user?.id) {
    redirect('/login')
  }

  const userId = session.user.id

  const fromIso = typeof searchParams?.startDate === 'string' ? searchParams.startDate : undefined
  const toIso = typeof searchParams?.endDate === 'string' ? searchParams.endDate : undefined
  const dateRange: DateRange = {
    from: fromIso ? new Date(fromIso) : subDays(new Date(), 30),
    to: toIso ? new Date(toIso) : new Date(),
  }

  const dateFilter: any = {}
  if (dateRange.from) dateFilter.gte = dateRange.from
  if (dateRange.to) dateFilter.lte = dateRange.to

  const userFilter = { userId }

  const [totalAccounts, totalTransactions, totalIncomeAgg, totalExpensesAgg, accounts] = await Promise.all([
    prisma.account.count({ where: { ...userFilter, isActive: true } }),
    prisma.transaction.count({ where: { ...userFilter, ...(Object.keys(dateFilter).length ? { date: dateFilter } : {}) } }),
    prisma.transaction.aggregate({ where: { ...userFilter, type: 'income', ...(Object.keys(dateFilter).length ? { date: dateFilter } : {}) }, _sum: { amount: true } }),
    prisma.transaction.aggregate({ where: { ...userFilter, type: 'expense', ...(Object.keys(dateFilter).length ? { date: dateFilter } : {}) }, _sum: { amount: true } }),
    prisma.account.findMany({ where: { ...userFilter, isActive: true }, select: { balance: true } }),
  ])

  const totalBalance = accounts.reduce((sum, a) => sum + (a.balance || 0), 0)
  const stats: DashboardStats = {
    overview: {
      totalAccounts,
      totalTransactions,
      totalBalance,
      totalIncome: totalIncomeAgg._sum.amount || 0,
      totalExpenses: totalExpensesAgg._sum.amount || 0,
      netIncome: (totalIncomeAgg._sum.amount || 0) - (totalExpensesAgg._sum.amount || 0),
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Dashboard</h1>
        <DateRangeFilter date={dateRange} className="w-full sm:w-auto" />
      </div>

      <DashboardFilters />

      {/* KPI Cards */}
      {stats ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <KpiCard
            title="Saldo Total"
            value={`R$ ${stats.overview.totalBalance.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
            change={`${stats.overview.totalAccounts} conta(s) ativa(s)`}
            changeType="neutral"
            icon={DollarSign}
          />
          <KpiCard
            title="Total de Despesas"
            value={`R$ ${stats.overview.totalExpenses.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
            change={stats.overview.totalExpenses > 0 ? "Período selecionado" : "Nenhuma despesa"}
            changeType={stats.overview.totalExpenses > 0 ? "negative" : "neutral"}
            icon={TrendingDown}
          />
          <KpiCard
            title="Total de Receitas"
            value={`R$ ${stats.overview.totalIncome.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
            change={stats.overview.totalIncome > 0 ? "Período selecionado" : "Nenhuma receita"}
            changeType={stats.overview.totalIncome > 0 ? "positive" : "neutral"}
            icon={TrendingUp}
          />
          <KpiCard
            title="Nº de Lançamentos"
            value={stats.overview.totalTransactions.toString()}
            change={`Lucro líquido: R$ ${stats.overview.netIncome.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
            changeType={stats.overview.netIncome >= 0 ? "positive" : "negative"}
            icon={Receipt}
          />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="h-32 bg-card border rounded-lg flex items-center justify-center text-muted-foreground">
            Erro ao carregar dados
          </div>
        </div>
      )}

      {/* Charts */}
      <DashboardCharts />
    </div>
  )
}
