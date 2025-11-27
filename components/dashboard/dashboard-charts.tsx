"use client"

import { useState, useEffect } from "react"
import { TrendingUp, TrendingDown, Minus, Loader2 } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Line, LineChart, ResponsiveContainer } from "recharts"
import { format, subMonths, startOfMonth, endOfMonth, eachMonthOfInterval } from "date-fns"
import { ptBR } from "date-fns/locale"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "A linear area chart"

const chartConfig = {
  income: {
    label: "Receitas",
    color: "var(--income)",
  },
  expense: {
    label: "Despesas", 
    color: "var(--expense)",
  },
  balance: {
    label: "Saldo",
    color: "var(--primary)",
  },
} satisfies ChartConfig

export function DashboardCharts() {
  const [chartData, setChartData] = useState<Array<{ month: string; income: number; expense: number; balance: number }>>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadChartData = async () => {
      try {
        setIsLoading(true)
        // Buscar transações dos últimos 6 meses
        const sixMonthsAgo = subMonths(new Date(), 5)
        const startDate = startOfMonth(sixMonthsAgo)
        const endDate = endOfMonth(new Date())

        const response = await fetch(
          `/api/transactions?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`
        )

        if (!response.ok) {
          throw new Error('Erro ao carregar transações')
        }

        const data = await response.json()
        const transactions = data.transactions || data

        // Criar array de meses
        const months = eachMonthOfInterval({ start: startDate, end: endDate })
        
        // Inicializar dados do gráfico
        const monthlyData = months.map(month => ({
          month: format(month, 'MMM yyyy', { locale: ptBR }),
          income: 0,
          expense: 0,
          balance: 0
        }))

        // Agrupar transações por mês
        transactions.forEach((transaction: any) => {
          const transactionDate = new Date(transaction.date)
          const monthIndex = months.findIndex(m => 
            m.getMonth() === transactionDate.getMonth() && 
            m.getFullYear() === transactionDate.getFullYear()
          )

          if (monthIndex >= 0) {
            if (transaction.type === 'income') {
              monthlyData[monthIndex].income += transaction.amount
            } else if (transaction.type === 'expense') {
              monthlyData[monthIndex].expense += transaction.amount
            }
          }
        })

        // Calcular saldo acumulado
        let runningBalance = 0
        monthlyData.forEach((month, index) => {
          runningBalance += month.income - month.expense
          month.balance = runningBalance
        })

        setChartData(monthlyData)
      } catch (error) {
        console.error('Erro ao carregar dados do gráfico:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadChartData()
  }, [])

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Fluxo Financeiro</CardTitle>
          <CardDescription>
            Receitas, despesas e saldo dos últimos 6 meses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[200px]">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fluxo Financeiro</CardTitle>
        <CardDescription>
          Receitas, despesas e saldo dos últimos 6 meses
        </CardDescription>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <div className="flex items-center justify-center h-[200px] text-muted-foreground">
            Sem dados para exibir
          </div>
        ) : (
          <div className="overflow-x-auto">
            <ChartContainer config={chartConfig} className="h-[300px] w-full min-w-[600px]">
            <LineChart
              accessibilityLayer
              data={chartData}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <Line
                dataKey="income"
                type="monotone"
                stroke="var(--color-income)"
                strokeWidth={2}
                dot={{ fill: "var(--color-income)", strokeWidth: 2, r: 4 }}
              />
              <Line
                dataKey="expense"
                type="monotone"
                stroke="var(--color-expense)"
                strokeWidth={2}
                dot={{ fill: "var(--color-expense)", strokeWidth: 2, r: 4 }}
              />
              <Line
                dataKey="balance"
                type="monotone"
                stroke="var(--color-balance)"
                strokeWidth={3}
                dot={{ fill: "var(--color-balance)", strokeWidth: 2, r: 5 }}
                strokeDasharray="5 5"
              />
            </LineChart>
          </ChartContainer>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            {chartData.length > 0 && (
              <>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                  <span className="text-muted-foreground">Receitas</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500" />
                  <span className="text-muted-foreground">Despesas</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-blue-500" />
                  <span className="text-muted-foreground">Saldo Acumulado</span>
                </div>
              </>
            )}
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
