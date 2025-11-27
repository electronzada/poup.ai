"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Receipt, Loader2 } from "lucide-react"
import type { DateRange } from "react-day-picker"

interface TransactionsSidebarProps {
  dateRange?: DateRange
}

interface Transaction {
  id: string
  amount: number
  type: "income" | "expense" | "transfer"
  account: {
    id: string
    name: string
  }
  category: {
    id: string
    name: string
  }
}

export function TransactionsSidebar({ dateRange }: TransactionsSidebarProps) {
  const [summaryData, setSummaryData] = useState({
    totalTransactions: 0,
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
  })
  const [activeFilters, setActiveFilters] = useState<Array<{ type: string; value: string }>>([])
  const [isLoading, setIsLoading] = useState(true)

  const loadSummary = async () => {
    try {
      setIsLoading(true)
      
      // Construir URL com filtros de data
      let url = '/api/transactions?'
      if (dateRange?.from) {
        url += `startDate=${dateRange.from.toISOString()}&`
      }
      if (dateRange?.to) {
        url += `endDate=${dateRange.to.toISOString()}&`
      }

      // Usar cache para evitar requisições desnecessárias
      const cacheKey = `summary_${url}`
      const cached = sessionStorage.getItem(cacheKey)
      const cacheTime = 10000 // 10 segundos

      if (cached) {
        const { data, timestamp } = JSON.parse(cached)
        if (Date.now() - timestamp < cacheTime) {
          setSummaryData(data)
          setIsLoading(false)
          return
        }
      }

      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        const transactions: Transaction[] = data.transactions || data

        // Calcular resumo
        const totalTransactions = transactions.length
        const totalIncome = transactions
          .filter(t => t.type === 'income')
          .reduce((sum, t) => sum + (t.amount || 0), 0)
        const totalExpenses = transactions
          .filter(t => t.type === 'expense')
          .reduce((sum, t) => sum + (t.amount || 0), 0)
        const balance = totalIncome - totalExpenses

        const summary = {
          totalTransactions,
          totalIncome,
          totalExpenses,
          balance,
        }

        setSummaryData(summary)
        
        // Salvar no cache
        sessionStorage.setItem(cacheKey, JSON.stringify({ data: summary, timestamp: Date.now() }))
      }
    } catch (error) {
      console.error('Erro ao carregar resumo:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadSummary()
  }, [dateRange])

  // Recarregar quando uma transação for criada, editada ou excluída
  useEffect(() => {
    const handleTransactionChange = () => {
      // Limpar cache ao criar/editar/excluir
      const cacheKey = `summary_/api/transactions?`
      sessionStorage.removeItem(cacheKey)
      loadSummary()
    }

    window.addEventListener('transactionCreated', handleTransactionChange)
    return () => window.removeEventListener('transactionCreated', handleTransactionChange)
  }, [dateRange])

  // Escutar eventos de filtros ativos
  useEffect(() => {
    const handleFilterChange = async (e: Event) => {
      const customEvent = e as CustomEvent
      const filters: Array<{ type: string; value: string }> = []
      
      if (customEvent.detail?.searchTerm) {
        filters.push({ type: 'Busca', value: customEvent.detail.searchTerm })
      }
      
      // Buscar nomes das contas e categorias
      if (customEvent.detail?.selectedAccounts?.length > 0 || customEvent.detail?.selectedCategories?.length > 0) {
        try {
          const [accountsRes, categoriesRes] = await Promise.all([
            customEvent.detail?.selectedAccounts?.length > 0 ? fetch('/api/accounts') : Promise.resolve(null),
            customEvent.detail?.selectedCategories?.length > 0 ? fetch('/api/categories') : Promise.resolve(null)
          ])
          
          if (customEvent.detail?.selectedAccounts?.length > 0 && accountsRes?.ok) {
            const accounts = await accountsRes.json()
            customEvent.detail.selectedAccounts.forEach((accountId: string) => {
              const account = accounts.find((a: any) => a.id === accountId)
              if (account) {
                filters.push({ type: 'Conta', value: account.name })
              }
            })
          }
          
          if (customEvent.detail?.selectedCategories?.length > 0 && categoriesRes?.ok) {
            const categories = await categoriesRes.json()
            customEvent.detail.selectedCategories.forEach((categoryId: string) => {
              const category = categories.find((c: any) => c.id === categoryId)
              if (category) {
                filters.push({ type: 'Categoria', value: category.name })
              }
            })
          }
        } catch (error) {
          console.error('Erro ao carregar nomes dos filtros:', error)
        }
      }
      
      setActiveFilters(filters)
    }

    window.addEventListener('transactionsFilterChanged', handleFilterChange as EventListener)
    return () => window.removeEventListener('transactionsFilterChanged', handleFilterChange as EventListener)
  }, [])

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
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Receipt className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Lançamentos</span>
                </div>
                <span className="font-medium">{summaryData.totalTransactions}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Entradas</span>
                </div>
                <span className="font-medium text-green-600">
                  R${" "}
                  {summaryData.totalIncome.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingDown className="h-4 w-4 text-red-600" />
                  <span className="text-sm">Gastos</span>
                </div>
                <span className="font-medium text-red-600">
                  R${" "}
                  {summaryData.totalExpenses.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Saldo do Período</span>
                  <span className={`font-bold ${summaryData.balance >= 0 ? "text-green-600" : "text-red-600"}`}>
                    R${" "}
                    {summaryData.balance.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
