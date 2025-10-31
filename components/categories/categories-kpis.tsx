import { KpiCard } from "@/components/ui/kpi-card"
import { Tag, TrendingDown, TrendingUp, Hash } from "lucide-react"

export function CategoriesKpis() {
  const totalCategories = 0
  const mostExpensiveCategoryName = "-"
  const mostExpensiveCategoryAmount = 0
  const mostUsedCategoryName = "-"
  const mostUsedCategoryCount = 0
  const averagePerCategory = 0

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <KpiCard
        title="Total de Categorias"
        value={totalCategories.toString()}
        change=""
        changeType="neutral"
        icon={Hash}
      />
      <KpiCard
        title="Categoria com Maior Gasto"
        value={mostExpensiveCategoryName}
        change={`R$ ${mostExpensiveCategoryAmount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
        changeType="neutral"
        icon={TrendingDown}
      />
      <KpiCard
        title="Categoria Mais Usada"
        value={mostUsedCategoryName}
        change={`${mostUsedCategoryCount} lançamentos`}
        changeType="neutral"
        icon={Tag}
      />
      <KpiCard
        title="Média por Categoria"
        value={`R$ ${averagePerCategory.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
        change=""
        changeType="neutral"
        icon={TrendingUp}
      />
    </div>
  )
}
