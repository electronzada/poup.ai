import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Receipt } from "lucide-react"

export function TransactionsSidebar() {
  // Mock data - em uma aplicação real, estes dados viriam dos filtros ativos
  const summaryData = {
    totalTransactions: 127,
    totalIncome: 24170.8,
    totalExpenses: 8750.3,
    balance: 15420.5,
  }

  const activeFilters = [
    { type: "Período", value: "Últimos 30 dias" },
    { type: "Conta", value: "Conta Corrente" },
    { type: "Categoria", value: "Alimentação" },
  ]

  return (
    <div className="space-y-6">
      {/* Resumo dos Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filtros Ativos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {activeFilters.map((filter, index) => (
            <div key={index} className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">{filter.type}:</span>
              <Badge variant="secondary" className="text-xs">
                {filter.value}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Resumo Financeiro */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Resumo do Período</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Receipt className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Lançamentos</span>
            </div>
            <span className="font-medium">{summaryData.totalTransactions}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-success" />
              <span className="text-sm">Entradas</span>
            </div>
            <span className="font-medium text-success">
              R${" "}
              {summaryData.totalIncome.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-destructive" />
              <span className="text-sm">Gastos</span>
            </div>
            <span className="font-medium text-destructive">
              R${" "}
              {summaryData.totalExpenses.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}
            </span>
          </div>

          <div className="border-t pt-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Saldo do Período</span>
              <span className={`font-bold ${summaryData.balance >= 0 ? "text-success" : "text-destructive"}`}>
                R${" "}
                {summaryData.balance.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
