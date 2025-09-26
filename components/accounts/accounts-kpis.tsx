import { KpiCard } from "@/components/ui/kpi-card"
import { CreditCard, Wallet, PiggyBank, TrendingUp } from "lucide-react"

export function AccountsKpis() {
  // Mock data - em uma aplicação real, estes dados viriam de uma API
  const kpiData = {
    totalAccounts: 4,
    totalBalance: 15420.5,
    highestBalance: { name: "Conta Corrente", amount: 8500.3 },
    monthlyGrowth: 12.5,
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <KpiCard
        title="Total de Contas"
        value={kpiData.totalAccounts.toString()}
        change="1 nova este mês"
        changeType="neutral"
        icon={CreditCard}
      />
      <KpiCard
        title="Saldo Total"
        value={`R$ ${kpiData.totalBalance.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
        change={`+${kpiData.monthlyGrowth}% este mês`}
        changeType="positive"
        icon={Wallet}
      />
      <KpiCard
        title="Maior Saldo"
        value={kpiData.highestBalance.name}
        change={`R$ ${kpiData.highestBalance.amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
        changeType="neutral"
        icon={PiggyBank}
      />
      <KpiCard
        title="Crescimento Mensal"
        value={`${kpiData.monthlyGrowth}%`}
        change="Média dos últimos 6 meses"
        changeType="positive"
        icon={TrendingUp}
      />
    </div>
  )
}
