"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { EditTransactionForm } from "./edit-transaction-form"

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
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([])
  const [selectedTransactions, setSelectedTransactions] = useState<string[]>([])
  const [sortField, setSortField] = useState<keyof Transaction>("date")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [isLoading, setIsLoading] = useState(true)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
  const [filters, setFilters] = useState<{
    searchTerm: string
    selectedAccounts: string[]
    selectedCategories: string[]
  }>({ searchTerm: "", selectedAccounts: [], selectedCategories: [] })
  const { toast } = useToast()

  // Carregar transações da API com filtros
  const loadTransactions = useCallback(async (filterParams?: typeof filters) => {
    try {
      setIsLoading(true)
      
      // Construir URL com filtros
      const params = new URLSearchParams()
      if (filterParams?.selectedAccounts && filterParams.selectedAccounts.length > 0) {
        filterParams.selectedAccounts.forEach(id => params.append('accountId', id))
      }
      if (filterParams?.selectedCategories && filterParams.selectedCategories.length > 0) {
        filterParams.selectedCategories.forEach(id => params.append('categoryId', id))
      }
      
      const url = `/api/transactions?${params.toString()}`
      const response = await fetch(url)
      
      if (response.ok) {
        const data = await response.json()
        const transactionsData = data.transactions || data
        
        // Aplicar filtro de busca no cliente (não pode ser feito no servidor facilmente)
        let filtered = transactionsData
        if (filterParams?.searchTerm) {
          const search = filterParams.searchTerm.toLowerCase()
          filtered = transactionsData.filter((t: Transaction) => 
            t.description.toLowerCase().includes(search) ||
            t.notes?.toLowerCase().includes(search) ||
            t.tags.some(tag => tag.toLowerCase().includes(search))
          )
        }
        
        setTransactions(transactionsData)
        setFilteredTransactions(filtered)
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
  }, [toast])

  useEffect(() => {
    loadTransactions()
  }, [refreshTrigger, loadTransactions])

  // Escutar eventos de nova transação
  useEffect(() => {
    const handleTransactionCreated = () => {
      loadTransactions(filters)
    }

    window.addEventListener('transactionCreated', handleTransactionCreated)
    return () => window.removeEventListener('transactionCreated', handleTransactionCreated)
  }, [filters, loadTransactions])

  // Escutar eventos de filtros e recarregar dados
  useEffect(() => {
    const handleFilterChange = (e: Event) => {
      const customEvent = e as CustomEvent
      const newFilters = customEvent.detail
      setFilters(newFilters)
      loadTransactions(newFilters)
    }

    window.addEventListener('transactionsFilterChanged', handleFilterChange as EventListener)
    return () => window.removeEventListener('transactionsFilterChanged', handleFilterChange as EventListener)
  }, [loadTransactions])

  const handleSort = (field: keyof Transaction) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    let aValue: any = a[sortField]
    let bValue: any = b[sortField]

    // Para campos aninhados
    if (sortField === "account") {
      aValue = a.account.name
      bValue = b.account.name
    } else if (sortField === "category") {
      aValue = a.category.name
      bValue = b.category.name
    } else if (sortField === "date") {
      // Para datas, converter para Date para comparação
      aValue = new Date(aValue).getTime()
      bValue = new Date(bValue).getTime()
    }

    if (typeof aValue === "string" && sortField !== "date") {
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
          title: "Sucesso!",
          description: "Transações excluídas com sucesso.",
          variant: "success",
        })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível excluir as transações.",
        variant: "destructive"
      })
    }
  }

  const handleEditTransaction = async (transactionId: string) => {
    try {
      const response = await fetch(`/api/transactions/${transactionId}`)
      if (response.ok) {
        const transaction = await response.json()
        setEditingTransaction(transaction)
      } else {
        throw new Error('Erro ao carregar transação')
      }
    } catch (error) {
      console.error('Erro ao carregar transação:', error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar a transação.",
        variant: "destructive"
      })
    }
  }

  const handleSaveEdit = useCallback((updatedTransaction: Transaction) => {
    setTransactions((prev) => prev.map((t) => (t.id === updatedTransaction.id ? updatedTransaction : t)))
    setFilteredTransactions((prev) => prev.map((t) => (t.id === updatedTransaction.id ? updatedTransaction : t)))
    setEditingTransaction(null)
    loadTransactions(filters) // Recarregar com filtros atuais
  }, [filters, loadTransactions])

  const handleDeleteTransaction = async (transactionId: string) => {
    console.log('Delete clicked for transaction:', transactionId) // Debug log
    try {
      const response = await fetch(`/api/transactions/${transactionId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        // Recarregar a lista de transações com filtros atuais
        loadTransactions(filters)
        toast({
          title: "Sucesso!",
          description: "Transação excluída com sucesso.",
          variant: "success",
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
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <CardTitle>Lançamentos</CardTitle>
          {selectedTransactions.length > 0 && (
            <Button variant="destructive" size="sm" onClick={handleBulkDelete} className="w-full sm:w-auto">
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
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <div className="inline-block min-w-full align-middle px-4 sm:px-0">
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
            </div>
          </div>
        )}
      </CardContent>

      <Dialog open={!!editingTransaction} onOpenChange={() => setEditingTransaction(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Lançamento</DialogTitle>
          </DialogHeader>
          {editingTransaction && (
            <EditTransactionForm
              transaction={editingTransaction}
              onSave={handleSaveEdit}
              onClose={() => setEditingTransaction(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </Card>
  )
}