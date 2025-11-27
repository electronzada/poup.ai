"use client"

import { useState, useEffect } from "react"
import { KpiCard } from "@/components/ui/kpi-card"
import { Tag, TrendingDown, TrendingUp, Hash, Loader2 } from "lucide-react"

interface Category {
  id: string
  name: string
  type: string
}

interface Transaction {
  id: string
  amount: number
  categoryId: string
  category: {
    id: string
    name: string
  }
}

export function CategoriesKpis() {
  const [totalCategories, setTotalCategories] = useState(0)
  const [mostExpensiveCategoryName, setMostExpensiveCategoryName] = useState("-")
  const [mostExpensiveCategoryAmount, setMostExpensiveCategoryAmount] = useState(0)
  const [mostUsedCategoryName, setMostUsedCategoryName] = useState("-")
  const [mostUsedCategoryCount, setMostUsedCategoryCount] = useState(0)
  const [averagePerCategory, setAveragePerCategory] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        const [categoriesRes, transactionsRes] = await Promise.all([
          fetch('/api/categories'),
          fetch('/api/transactions')
        ])
        
        if (categoriesRes.ok && transactionsRes.ok) {
          const categories: Category[] = await categoriesRes.json()
          const transactionsData = await transactionsRes.json()
          const transactions: Transaction[] = transactionsData.transactions || transactionsData
          
          setTotalCategories(categories.length)
          
          // Calcular categoria com maior gasto
          const expenseTransactions = transactions.filter(t => t.category && t.amount)
          const categoryTotals: Record<string, { amount: number; count: number; name: string }> = {}
          
          expenseTransactions.forEach(transaction => {
            const catId = transaction.categoryId
            if (!categoryTotals[catId]) {
              categoryTotals[catId] = { amount: 0, count: 0, name: transaction.category?.name || 'Desconhecida' }
            }
            categoryTotals[catId].amount += transaction.amount
            categoryTotals[catId].count += 1
          })
          
          const categoryEntries = Object.entries(categoryTotals)
          
          if (categoryEntries.length > 0) {
            // Categoria com maior gasto
            const mostExpensive = categoryEntries.reduce((max, [id, data]) => 
              data.amount > max[1].amount ? [id, data] : max
            )
            setMostExpensiveCategoryName(mostExpensive[1].name)
            setMostExpensiveCategoryAmount(mostExpensive[1].amount)
            
            // Categoria mais usada
            const mostUsed = categoryEntries.reduce((max, [id, data]) => 
              data.count > max[1].count ? [id, data] : max
            )
            setMostUsedCategoryName(mostUsed[1].name)
            setMostUsedCategoryCount(mostUsed[1].count)
            
            // Média por categoria
            const totalAmount = categoryEntries.reduce((sum, [, data]) => sum + data.amount, 0)
            const avg = totalAmount / categoryEntries.length
            setAveragePerCategory(avg)
          }
        }
      } catch (error) {
        console.error('Erro ao carregar dados de categorias:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-card border rounded-lg flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ))}
      </div>
    )
  }

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
