"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { LayoutDashboard, Receipt, Tag, CreditCard, Settings, TrendingUp, Plus, DollarSign } from "lucide-react"
import { NewTransactionForm } from "@/components/transactions/new-transaction-form"

const navigation = [
  {
    name: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Lançamentos",
    href: "/lancamentos",
    icon: Receipt,
  },
  {
    name: "Categorias",
    href: "/categorias",
    icon: Tag,
  },
  {
    name: "Contas",
    href: "/contas",
    icon: CreditCard,
  },
  {
    name: "Configurações",
    href: "/config",
    icon: Settings,
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const [isNewTransactionOpen, setIsNewTransactionOpen] = useState(false)

  return (
    <div className="flex h-full w-64 flex-col bg-sidebar border-r border-sidebar-border">
      <div className="flex h-16 items-center px-6 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <DollarSign className="h-6 w-6 text-sidebar-primary" />
          <span className="text-lg font-semibold text-sidebar-foreground">Poup.ai</span>
        </div>
      </div>

      <div className="flex-1 px-4 py-6">
        <div className="mb-6">
          <Dialog open={isNewTransactionOpen} onOpenChange={setIsNewTransactionOpen}>
            <DialogTrigger asChild>
              <Button className="w-full justify-start gap-2 cursor-pointer" size="sm">
                <Plus className="h-4 w-4" />
                Novo Lançamento
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Novo Lançamento</DialogTitle>
              </DialogHeader>
              <NewTransactionForm onClose={() => setIsNewTransactionOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>

        <nav className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
