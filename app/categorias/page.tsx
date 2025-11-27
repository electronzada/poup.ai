import prisma from '@/lib/prisma'
import { subDays } from "date-fns"
import type { DateRange } from "react-day-picker"
import { CategoriesHeader } from "@/components/categories/categories-header"
import { CategoriesKpis } from "@/components/categories/categories-kpis"
import { CategoriesChart } from "@/components/categories/categories-chart"
import { CategoriesTable } from "@/components/categories/categories-table"
import { DateRangeFilter } from "@/components/filters/date-range-filter"
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function CategoriesPage() {
  const dateRange: DateRange = { from: subDays(new Date(), 30), to: new Date() }
  
  // Obter usuário logado
  const session = await getServerSession(authOptions as any)
  
  if (!session?.user?.id) {
    redirect('/login')
  }

  // Buscar apenas categorias do usuário logado
  const categories = await prisma.category.findMany({ 
    where: { userId: session.user.id },
    orderBy: { name: 'asc' } 
  })

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Categorias</h1>
        <DateRangeFilter date={dateRange} className="w-full sm:w-auto" />
      </div>

      <CategoriesHeader />

      <CategoriesKpis />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <CategoriesChart />
        <CategoriesTable initialCategories={categories as any} />
      </div>
    </div>
  )
}
