import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Receipt } from "lucide-react"

export function TransactionsSidebar() {
  const summaryData = {
    totalTransactions: 0,
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
  }

  const activeFilters: Array<{ type: string; value: string }> = []

  return (
    <div className="space-y-6">
      {/* Resumo dos Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filtros Ativos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {activeFilters.length === 0 && (
            <div className="text-sm text-muted-foreground">Sem filtros ativos.</div>
          )}
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
