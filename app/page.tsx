"use client"

import { useState, useEffect } from "react"
import type { DateRange } from "react-day-picker"
import { subDays } from "date-fns"
import { KpiCard } from "@/components/ui/kpi-card"
import { DateRangeFilter } from "@/components/filters/date-range-filter"
import { DashboardCharts } from "@/components/dashboard/dashboard-charts"
import { DashboardFilters } from "@/components/dashboard/dashboard-filters"
import { TrendingUp, TrendingDown, Receipt, DollarSign, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

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

export default function DashboardPage() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  })
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  // Carregar estatísticas da API
  const loadStats = async () => {
    try {
      setIsLoading(true)
      const params = new URLSearchParams()
      
      if (dateRange?.from) {
        params.set('startDate', dateRange.from.toISOString())
      }
      if (dateRange?.to) {
        params.set('endDate', dateRange.to.toISOString())
      }

      const response = await fetch(`/api/dashboard/stats?${params}`)
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      } else {
        throw new Error('Erro ao carregar estatísticas')
      }
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar as estatísticas.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Carregar estatísticas quando o componente monta ou quando dateRange muda
  useEffect(() => {
    loadStats()
  }, [dateRange])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <DateRangeFilter date={dateRange} onDateChange={setDateRange} className="w-auto" />
      </div>

      <DashboardFilters />

      {/* KPI Cards */}
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-card border rounded-lg flex items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ))}
        </div>
      ) : stats ? (
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
