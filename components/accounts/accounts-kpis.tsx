"use client"

import { useState, useEffect } from "react"
import { KpiCard } from "@/components/ui/kpi-card"
import { CreditCard, Wallet, PiggyBank, TrendingUp, Loader2 } from "lucide-react"

interface Account {
  id: string
  name: string
  balance: number
  type: string
  createdAt: string
  isActive?: boolean
}

export function AccountsKpis() {
  const [totalAccounts, setTotalAccounts] = useState(0)
  const [totalBalance, setTotalBalance] = useState(0)
  const [highestBalanceName, setHighestBalanceName] = useState("-")
  const [highestBalanceAmount, setHighestBalanceAmount] = useState(0)
  const [monthlyGrowth, setMonthlyGrowth] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/accounts')
        
        if (response.ok) {
          const accounts: Account[] = await response.json()
          const activeAccounts = accounts.filter(acc => acc.isActive !== false)
          
          setTotalAccounts(activeAccounts.length)
          
          const balance = activeAccounts.reduce((sum, acc) => sum + (acc.balance || 0), 0)
          setTotalBalance(balance)
          
          if (activeAccounts.length > 0) {
            const highest = activeAccounts.reduce((max, acc) => 
              (acc.balance || 0) > (max.balance || 0) ? acc : max
            )
            setHighestBalanceName(highest.name)
            setHighestBalanceAmount(highest.balance || 0)
          }
          
          // Calcular crescimento mensal baseado em transações
          try {
            const now = new Date()
            const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
            const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59)
            const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
            
            const [lastMonthRes, thisMonthRes] = await Promise.all([
              fetch(`/api/transactions?startDate=${lastMonthStart.toISOString()}&endDate=${lastMonthEnd.toISOString()}`),
              fetch(`/api/transactions?startDate=${thisMonthStart.toISOString()}&endDate=${now.toISOString()}`)
            ])
            
            if (lastMonthRes.ok && thisMonthRes.ok) {
              const lastMonthData = await lastMonthRes.json()
              const thisMonthData = await thisMonthRes.json()
              
              const lastMonthTransactions = lastMonthData.transactions || lastMonthData
              const thisMonthTransactions = thisMonthData.transactions || thisMonthData
              
              const lastMonthIncome = lastMonthTransactions
                .filter((t: any) => t.type === 'income')
                .reduce((sum: number, t: any) => sum + (t.amount || 0), 0)
              
              const thisMonthIncome = thisMonthTransactions
                .filter((t: any) => t.type === 'income')
                .reduce((sum: number, t: any) => sum + (t.amount || 0), 0)
              
              const growth = lastMonthIncome > 0 
                ? ((thisMonthIncome - lastMonthIncome) / lastMonthIncome) * 100 
                : (thisMonthIncome > 0 ? 100 : 0)
              
              setMonthlyGrowth(growth)
            }
          } catch (error) {
            console.error('Erro ao calcular crescimento mensal:', error)
            setMonthlyGrowth(0)
          }
        }
      } catch (error) {
        console.error('Erro ao carregar dados de contas:', error)
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
        value={`${monthlyGrowth >= 0 ? '+' : ''}${monthlyGrowth.toFixed(1)}%`}
        change=""
        changeType={monthlyGrowth >= 0 ? "positive" : "negative"}
        icon={TrendingUp}
      />
    </div>
  )
}
