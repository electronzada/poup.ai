import prisma from '@/lib/prisma'
import { AccountsHeader } from "@/components/accounts/accounts-header"
import { AccountsKpis } from "@/components/accounts/accounts-kpis"
import { AccountsTable } from "@/components/accounts/accounts-table"
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function AccountsPage() {
  // Obter usuário logado
  const session = await getServerSession(authOptions as any)
  
  if (!session?.user?.id) {
    redirect('/login')
  }

  // Buscar apenas contas do usuário logado
  const accounts = await prisma.account.findMany({ 
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' } 
  })
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Contas</h1>
      </div>

      <AccountsHeader />

      <AccountsKpis />

      <AccountsTable initialAccounts={accounts as any} />
    </div>
  )
}
