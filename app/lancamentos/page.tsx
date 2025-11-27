"use client"

import { useState } from "react"
import type { DateRange } from "react-day-picker"
import { subDays } from "date-fns"
import { TransactionsTable } from "@/components/transactions/transactions-table"
import { TransactionsSidebar } from "@/components/transactions/transactions-sidebar"
import { TransactionsHeader } from "@/components/transactions/transactions-header"
import { DateRangeFilter } from "@/components/filters/date-range-filter"

export default function TransactionsPage() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  })

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Lançamentos</h1>
        <DateRangeFilter date={dateRange} onDateChange={setDateRange} className="w-full sm:w-auto" />
      </div>

      <TransactionsHeader />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="lg:col-span-3 order-2 lg:order-1">
          <TransactionsTable />
        </div>
        <div className="lg:col-span-1 order-1 lg:order-2">
          <TransactionsSidebar dateRange={dateRange} />
        </div>
      </div>
    </div>
  )
}
