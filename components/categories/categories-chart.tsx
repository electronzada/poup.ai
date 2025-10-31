"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const chartData: Array<{ categoria: string; valor: number; transacoes: number }> = []

export function CategoriesChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Categorias por Valor (Período Filtrado)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              type="number"
              className="text-muted-foreground"
              fontSize={12}
              tickFormatter={(value) => `R$ ${value}`}
            />
            <YAxis type="category" dataKey="categoria" className="text-muted-foreground" fontSize={12} width={80} />
            <Tooltip
              formatter={(value: number, name: string) => {
                if (name === "valor") {
                  return [`R$ ${value.toLocaleString("pt-BR")}`, "Valor Total"]
                }
                return [value, name]
              }}
              labelStyle={{ color: "hsl(var(--foreground))" }}
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "6px",
              }}
            />
            <Bar dataKey="valor" fill="hsl(var(--chart-1))" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
        {chartData.length === 0 && (
          <div className="text-sm text-muted-foreground mt-4">Sem dados para o período selecionado.</div>
        )}
      </CardContent>
    </Card>
  )
}
