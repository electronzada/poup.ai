import { KpiCard } from "@/components/ui/kpi-card"
import { Tag, TrendingDown, TrendingUp, Hash } from "lucide-react"

export function CategoriesKpis() {
  // Mock data - em uma aplicação real, estes dados viriam de uma API
  const kpiData = {
    totalCategories: 12,
    mostExpensiveCategory: { name: "Alimentação", amount: 2500 },
    mostUsedCategory: { name: "Transporte", count: 45 },
    averagePerCategory: 729.17,
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <KpiCard
        title="Total de Categorias"
        value={kpiData.totalCategories.toString()}
        change="2 novas este mês"
        changeType="neutral"
        icon={Hash}
      />
      <KpiCard
        title="Categoria com Maior Gasto"
        value={kpiData.mostExpensiveCategory.name}
        change={`R$ ${kpiData.mostExpensiveCategory.amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
        changeType="neutral"
        icon={TrendingDown}
      />
      <KpiCard
        title="Categoria Mais Usada"
        value={kpiData.mostUsedCategory.name}
        change={`${kpiData.mostUsedCategory.count} lançamentos`}
        changeType="neutral"
        icon={Tag}
      />
      <KpiCard
        title="Média por Categoria"
        value={`R$ ${kpiData.averagePerCategory.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
        change="+15.2% em relação ao mês anterior"
        changeType="positive"
        icon={TrendingUp}
      />
    </div>
  )
}
