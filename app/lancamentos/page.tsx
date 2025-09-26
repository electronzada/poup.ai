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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Lançamentos</h1>
        <DateRangeFilter date={dateRange} onDateChange={setDateRange} className="w-auto" />
      </div>

      <TransactionsHeader />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <TransactionsTable />
        </div>
        <div className="lg:col-span-1">
          <TransactionsSidebar />
        </div>
      </div>
    </div>
  )
}
