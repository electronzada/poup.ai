"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, ArrowUpDown, Edit, Trash2, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { useToast } from "@/hooks/use-toast"

interface Transaction {
  id: string
  date: string
  description: string
  amount: number
  type: "income" | "expense" | "transfer"
  notes?: string
  tags: string[]
  account: {
    id: string
    name: string
  }
  category: {
    id: string
    name: string
    color: string
  }
}

interface TransactionsTableProps {
  refreshTrigger?: number
}

export function TransactionsTable({ refreshTrigger }: TransactionsTableProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [selectedTransactions, setSelectedTransactions] = useState<string[]>([])
  const [sortField, setSortField] = useState<keyof Transaction>("date")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  // Carregar transações da API
  const loadTransactions = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/transactions')
      if (response.ok) {
        const data = await response.json()
        setTransactions(data.transactions || data)
      } else {
        throw new Error('Erro ao carregar transações')
      }
    } catch (error) {
      console.error('Erro ao carregar transações:', error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar as transações.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadTransactions()
  }, [refreshTrigger])

  // Escutar eventos de nova transação
  useEffect(() => {
    const handleTransactionCreated = () => {
      loadTransactions()
    }

    window.addEventListener('transactionCreated', handleTransactionCreated)
    return () => window.removeEventListener('transactionCreated', handleTransactionCreated)
  }, [])

  const handleSort = (field: keyof Transaction) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const sortedTransactions = [...transactions].sort((a, b) => {
    let aValue: any = a[sortField]
    let bValue: any = b[sortField]

    // Para campos aninhados
    if (sortField === "account") {
      aValue = a.account.name
      bValue = b.account.name
    } else if (sortField === "category") {
      aValue = a.category.name
      bValue = b.category.name
    }

    if (typeof aValue === "string") {
      aValue = aValue.toLowerCase()
      bValue = bValue.toLowerCase()
    }

    if (sortDirection === "asc") {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })

  const handleSelectTransaction = (id: string) => {
    if (selectedTransactions.includes(id)) {
      setSelectedTransactions((prev) => prev.filter((tid) => tid !== id))
    } else {
      setSelectedTransactions((prev) => [...prev, id])
    }
  }

  const handleSelectAll = () => {
    if (selectedTransactions.length === transactions.length) {
      setSelectedTransactions([])
    } else {
      setSelectedTransactions(transactions.map((t) => t.id))
    }
  }

  const handleBulkDelete = async () => {
    try {
      // Aqui você implementaria a exclusão em lote via API
      // Por enquanto, apenas remove do estado local
      setTransactions((prev) => prev.filter((t) => !selectedTransactions.includes(t.id)))
      setSelectedTransactions([])
      toast({
        title: "Sucesso",
        description: "Transações excluídas com sucesso.",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível excluir as transações.",
        variant: "destructive"
      })
    }
  }

  const handleEditTransaction = (transactionId: string) => {
    console.log('Edit clicked for transaction:', transactionId) // Debug log
    // TODO: Implementar modal de edição
    toast({
      title: "Funcionalidade em desenvolvimento",
      description: "A edição de transações será implementada em breve.",
    })
  }

  const handleDeleteTransaction = async (transactionId: string) => {
    console.log('Delete clicked for transaction:', transactionId) // Debug log
    try {
      const response = await fetch(`/api/transactions/${transactionId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        // Recarregar a lista de transações
        loadTransactions()
        toast({
          title: "Sucesso",
          description: "Transação excluída com sucesso.",
        })
      } else {
        throw new Error('Erro ao excluir transação')
      }
    } catch (error) {
      console.error('Erro ao excluir transação:', error)
      toast({
        title: "Erro",
        description: "Não foi possível excluir a transação.",
        variant: "destructive"
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Lançamentos</CardTitle>
          {selectedTransactions.length > 0 && (
            <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
              Excluir Selecionados ({selectedTransactions.length})
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">Carregando transações...</span>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedTransactions.length === transactions.length && transactions.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => handleSort("date")} className="h-auto p-0">
                    Data
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => handleSort("description")} className="h-auto p-0">
                    Descrição
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => handleSort("category")} className="h-auto p-0">
                    Categoria
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => handleSort("account")} className="h-auto p-0">
                    Conta
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="text-right">
                  <Button variant="ghost" onClick={() => handleSort("amount")} className="h-auto p-0">
                    Valor
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedTransactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    Nenhuma transação encontrada
                  </TableCell>
                </TableRow>
              ) : (
                sortedTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedTransactions.includes(transaction.id)}
                        onCheckedChange={() => handleSelectTransaction(transaction.id)}
                      />
                    </TableCell>
                    <TableCell>
                      {format(new Date(transaction.date), "dd/MM/yyyy", { locale: ptBR })}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{transaction.description}</div>
                        {transaction.notes && (
                          <div className="text-sm text-muted-foreground">{transaction.notes}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: transaction.category.color }}
                        />
                        <span>{transaction.category.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{transaction.account.name}</TableCell>
                    <TableCell className="text-right">
                      <span
                        className={`font-medium ${
                          transaction.type === "income"
                            ? "text-green-600"
                            : transaction.type === "expense"
                            ? "text-red-600"
                            : "text-blue-600"
                        }`}
                      >
                        {transaction.type === "expense" ? "-" : ""}R${" "}
                        {transaction.amount.toLocaleString("pt-BR", {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                    </TableCell>
                    <TableCell>
                      {transaction.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {transaction.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
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
                            onClick={() => handleEditTransaction(transaction.id)}
                            className="cursor-pointer"
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-destructive cursor-pointer"
                            onClick={() => handleDeleteTransaction(transaction.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}