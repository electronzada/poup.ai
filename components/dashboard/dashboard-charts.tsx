"use client"

import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Line, LineChart, ResponsiveContainer } from "recharts"

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

const chartData: Array<{ month: string; income: number; expense: number; balance: number }> = []

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
  return (
    <Card>
      <CardHeader>
        <CardTitle>Fluxo Financeiro</CardTitle>
        <CardDescription>
          Receitas, despesas e saldo dos últimos 6 meses
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
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
              tickFormatter={(value) => `R$ ${value}`}
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
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="text-muted-foreground">Sem dados para exibir.</div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
