"use client"

import { useState } from "react"
import type { DateRange } from "react-day-picker"
import { subDays } from "date-fns"
import { CategoriesHeader } from "@/components/categories/categories-header"
import { CategoriesKpis } from "@/components/categories/categories-kpis"
import { CategoriesChart } from "@/components/categories/categories-chart"
import { CategoriesTable } from "@/components/categories/categories-table"
import { DateRangeFilter } from "@/components/filters/date-range-filter"

export default function CategoriesPage() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Categorias</h1>
        <DateRangeFilter date={dateRange} onDateChange={setDateRange} className="w-auto" />
      </div>

      <CategoriesHeader />

      <CategoriesKpis />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategoriesChart />
        <CategoriesTable />
      </div>
    </div>
  )
}
