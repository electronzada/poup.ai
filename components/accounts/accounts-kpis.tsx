import { KpiCard } from "@/components/ui/kpi-card"
import { CreditCard, Wallet, PiggyBank, TrendingUp } from "lucide-react"

export function AccountsKpis() {
  const totalAccounts = 0
  const totalBalance = 0
  const highestBalanceName = "-"
  const highestBalanceAmount = 0
  const monthlyGrowth = 0

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <KpiCard
        title="Total de Contas"
        value={totalAccounts.toString()}
        change=""
        changeType="neutral"
        icon={CreditCard}
      />
      <KpiCard
        title="Saldo Total"
        value={`R$ ${totalBalance.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
        change={""}
        changeType="neutral"
        icon={Wallet}
      />
      <KpiCard
        title="Maior Saldo"
        value={highestBalanceName}
        change={`R$ ${highestBalanceAmount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
        changeType="neutral"
        icon={PiggyBank}
      />
      <KpiCard
        title="Crescimento Mensal"
        value={`${monthlyGrowth}%`}
        change=""
        changeType="neutral"
        icon={TrendingUp}
      />
    </div>
  )
}
