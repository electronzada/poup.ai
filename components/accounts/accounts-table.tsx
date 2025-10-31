"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { MoreHorizontal, Edit, Trash2, CreditCard, PiggyBank, Banknote, Loader2 } from "lucide-react"
import { EditAccountForm } from "./edit-account-form"
import { useToast } from "@/hooks/use-toast"

interface Account {
  id: string
  name: string
  type: "checking" | "savings" | "credit" | "investment"
  currency: string
  balance: number
  description?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

const accountTypeConfig = {
  checking: { label: "Conta Corrente", icon: CreditCard, color: "bg-blue-500" },
  savings: { label: "Poupança", icon: PiggyBank, color: "bg-green-500" },
  credit: { label: "Cartão de Crédito", icon: CreditCard, color: "bg-red-500" },
  investment: { label: "Investimento", icon: Banknote, color: "bg-purple-500" },
}

export function AccountsTable({ initialAccounts }: { initialAccounts?: Account[] }) {
  const [accounts, setAccounts] = useState<Account[]>(initialAccounts || [])
  const [editingAccount, setEditingAccount] = useState<Account | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  // Carregar contas da API
  const loadAccounts = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/accounts')
      if (response.ok) {
        const data = await response.json()
        setAccounts(data)
      } else {
        throw new Error('Erro ao carregar contas')
      }
    } catch (error) {
      console.error('Erro ao carregar contas:', error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar as contas.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (!initialAccounts || initialAccounts.length === 0) {
      loadAccounts()
    } else {
      setIsLoading(false)
    }
    const handler = () => loadAccounts()
    if (typeof window !== 'undefined') {
      window.addEventListener('accounts:changed', handler)
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('accounts:changed', handler)
      }
    }
  }, [])

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/accounts/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        loadAccounts() // Recarregar a lista
        toast({
          title: "Sucesso",
          description: "Conta excluída com sucesso.",
        })
      } else {
        throw new Error('Erro ao excluir conta')
      }
    } catch (error) {
      console.error('Erro ao excluir conta:', error)
      toast({
        title: "Erro",
        description: "Não foi possível excluir a conta.",
        variant: "destructive"
      })
    }
  }

  const handleEdit = (account: Account) => {
    setEditingAccount(account)
  }

  const handleSaveEdit = (updatedAccount: Account) => {
    setAccounts((prev) => prev.map((acc) => (acc.id === updatedAccount.id ? updatedAccount : acc)))
    setEditingAccount(null)
    loadAccounts() // Recarregar para garantir dados atualizados
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR")
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Todas as Contas</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="ml-2">Carregando contas...</span>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Conta</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Moeda</TableHead>
                  <TableHead className="text-right">Saldo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {accounts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      Nenhuma conta encontrada
                    </TableCell>
                  </TableRow>
                ) : (
                  accounts.map((account) => {
                    const typeConfig = accountTypeConfig[account.type]
                    const IconComponent = typeConfig.icon

                    return (
                      <TableRow key={account.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${typeConfig.color} text-white`}>
                              <IconComponent className="h-4 w-4" />
                            </div>
                            <div>
                              <span className="font-medium">{account.name}</span>
                              {account.description && (
                                <p className="text-sm text-muted-foreground">{account.description}</p>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{typeConfig.label}</Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{account.currency}</TableCell>
                        <TableCell className="text-right">
                          <span className={`font-medium ${account.balance >= 0 ? "text-green-600" : "text-red-600"}`}>
                            {account.balance >= 0 ? "" : "-"}
                            R${" "}
                            {Math.abs(account.balance).toLocaleString("pt-BR", {
                              minimumFractionDigits: 2,
                            })}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge variant={account.isActive ? "default" : "secondary"}>
                            {account.isActive ? "Ativa" : "Inativa"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="cursor-pointer">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem 
                                onClick={() => handleEdit(account)}
                                className="cursor-pointer"
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-destructive cursor-pointer" 
                                onClick={() => handleDelete(account.id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Excluir
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!editingAccount} onOpenChange={() => setEditingAccount(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Conta</DialogTitle>
          </DialogHeader>
          {editingAccount && (
            <EditAccountForm account={editingAccount} onSave={handleSaveEdit} onClose={() => setEditingAccount(null)} />
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
