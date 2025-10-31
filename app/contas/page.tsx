import prisma from '@/lib/prisma'
import { AccountsHeader } from "@/components/accounts/accounts-header"
import { AccountsKpis } from "@/components/accounts/accounts-kpis"
import { AccountsTable } from "@/components/accounts/accounts-table"

export default async function AccountsPage() {
  const accounts = await prisma.account.findMany({ orderBy: { createdAt: 'desc' } })
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Contas</h1>
      </div>

      <AccountsHeader />

      <AccountsKpis />

      <AccountsTable initialAccounts={accounts as any} />
    </div>
  )
}
