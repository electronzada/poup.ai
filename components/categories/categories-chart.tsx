"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

// Mock data
const chartData = [
  { categoria: "Alimentação", valor: 2500, transacoes: 32 },
  { categoria: "Transporte", valor: 1200, transacoes: 45 },
  { categoria: "Casa", valor: 1500, transacoes: 18 },
  { categoria: "Saúde", valor: 800, transacoes: 12 },
  { categoria: "Lazer", valor: 900, transacoes: 28 },
  { categoria: "Educação", valor: 600, transacoes: 8 },
  { categoria: "Roupas", valor: 400, transacoes: 15 },
  { categoria: "Tecnologia", valor: 350, transacoes: 6 },
]

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
      </CardContent>
    </Card>
  )
}
