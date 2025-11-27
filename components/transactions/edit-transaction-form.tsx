"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { cn } from "@/lib/utils"
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

interface EditTransactionFormProps {
  transaction: Transaction
  onSave: (transaction: Transaction) => void
  onClose: () => void
}

interface Account {
  id: string
  name: string
  type: string
  balance: number
}

interface Category {
  id: string
  name: string
  type: string
  color: string
}

export function EditTransactionForm({ transaction, onSave, onClose }: EditTransactionFormProps) {
  const [date, setDate] = useState<Date>(new Date(transaction.date))
  const [type, setType] = useState<"income" | "expense" | "transfer">(transaction.type)
  const [description, setDescription] = useState(transaction.description)
  const [amount, setAmount] = useState(transaction.amount.toString())
  const [categoryId, setCategoryId] = useState(transaction.category.id)
  const [accountId, setAccountId] = useState(transaction.account.id)
  const [notes, setNotes] = useState(transaction.notes || "")
  const [tags, setTags] = useState(transaction.tags.join(", "))
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [errors, setErrors] = useState<{
    description?: string
    amount?: string
    categoryId?: string
    accountId?: string
  }>({})
  
  const [accounts, setAccounts] = useState<Account[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const { toast } = useToast()

  // Carregar dados reais com cache
  useEffect(() => {
    const loadData = async () => {
      try {
        // Verificar cache
        const cachedAccounts = sessionStorage.getItem('accounts_cache')
        const cachedCategories = sessionStorage.getItem('categories_cache')
        const cacheTime = 60000 // 1 minuto

        if (cachedAccounts && cachedCategories) {
          const { data: accountsData, timestamp } = JSON.parse(cachedAccounts)
          const { data: categoriesData, timestamp: catTimestamp } = JSON.parse(cachedCategories)
          
          if (Date.now() - timestamp < cacheTime && Date.now() - catTimestamp < cacheTime) {
            setAccounts(accountsData)
            setCategories(categoriesData)
            setIsLoadingData(false)
            return
          }
        }

        const [accountsRes, categoriesRes] = await Promise.all([
          fetch('/api/accounts'),
          fetch('/api/categories')
        ])
        
        if (accountsRes.ok && categoriesRes.ok) {
          const accountsData = await accountsRes.json()
          const categoriesData = await categoriesRes.json()
          
          setAccounts(accountsData)
          setCategories(categoriesData)
          
          // Salvar no cache
          sessionStorage.setItem('accounts_cache', JSON.stringify({ data: accountsData, timestamp: Date.now() }))
          sessionStorage.setItem('categories_cache', JSON.stringify({ data: categoriesData, timestamp: Date.now() }))
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error)
        toast({
          title: "Erro",
          description: "Não foi possível carregar os dados. Tente novamente.",
          variant: "destructive"
        })
      } finally {
        setIsLoadingData(false)
      }
    }

    loadData()
  }, [toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    
    // Validações
    const newErrors: typeof errors = {}
    
    if (!description || description.trim() === "") {
      newErrors.description = "A descrição é obrigatória"
    }
    
    if (!amount || amount.trim() === "") {
      newErrors.amount = "O valor é obrigatório"
    } else {
      const amountValue = Number.parseFloat(amount)
      if (isNaN(amountValue)) {
        newErrors.amount = "O valor deve ser um número válido"
      } else if (amountValue <= 0) {
        newErrors.amount = "O valor deve ser maior que zero"
      } else if (amountValue < 0) {
        newErrors.amount = "Não são permitidos valores negativos"
      }
    }
    
    if (!categoryId) {
      newErrors.categoryId = "A categoria é obrigatória"
    }
    
    if (!accountId) {
      newErrors.accountId = "A conta é obrigatória"
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      const errorMessages = Object.values(newErrors).join(", ")
      toast({
        title: "Campos inválidos",
        description: errorMessages,
        variant: "destructive"
      })
      return
    }

    setIsLoading(true)
    
    try {
      const amountValue = Number.parseFloat(amount)
      
      const response = await fetch(`/api/transactions/${transaction.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amountValue,
          type,
          description: description.trim(),
          date: date.toISOString(),
          notes: notes || null,
          tags: tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean),
          accountId,
          categoryId
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        throw new Error(errorData?.error || 'Erro ao atualizar transação')
      }

      const updatedTransaction = await response.json()
      
      const transactionType = type === "expense" ? "gasto" : type === "income" ? "receita" : "transferência"
      // Limpar cache de contas e categorias
      sessionStorage.removeItem('accounts_cache')
      sessionStorage.removeItem('categories_cache')
      
      toast({
        title: "Sucesso!",
        description: `${transactionType === "gasto" ? "Gasto" : transactionType === "receita" ? "Receita" : "Transferência"} atualizado com sucesso!`,
        variant: "success",
      })
      
      onSave({
        ...transaction,
        ...updatedTransaction,
      })
      onClose()
    } catch (error) {
      console.error('Erro ao atualizar transação:', error)
      const errorMessage = error instanceof Error ? error.message : "Não foi possível atualizar o lançamento."
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoadingData) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2">Carregando dados...</span>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="type">Tipo</Label>
          <Select value={type} onValueChange={(value: "income" | "expense" | "transfer") => setType(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="expense">Gasto</SelectItem>
              <SelectItem value="income">Entrada</SelectItem>
              <SelectItem value="transfer">Transferência</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="date">Data</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "dd/MM/yyyy", { locale: ptBR }) : "Selecionar data"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(date) => date && setDate(date)}
                initialFocus
                locale={ptBR}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Input
          id="description"
          value={description}
          onChange={(e) => {
            setDescription(e.target.value)
            if (errors.description) setErrors(prev => ({ ...prev, description: undefined }))
          }}
          placeholder="Ex: Supermercado, Salário, etc."
          required
          aria-invalid={!!errors.description}
          className={errors.description ? "border-destructive" : ""}
        />
        {errors.description && (
          <p className="text-sm text-destructive">{errors.description}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="amount">Valor</Label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          min="0.01"
          value={amount}
          onChange={(e) => {
            let value = e.target.value
            // Remove o sinal de menos se houver
            value = value.replace(/^-/, '')
            // Não permite valores negativos
            if (value === "" || (!isNaN(Number.parseFloat(value)) && Number.parseFloat(value) >= 0)) {
              setAmount(value)
            }
            if (errors.amount) setErrors(prev => ({ ...prev, amount: undefined }))
          }}
          onKeyDown={(e) => {
            // Bloqueia a tecla de menos
            if (e.key === '-' || e.key === 'e' || e.key === 'E') {
              e.preventDefault()
            }
          }}
          placeholder="0,00"
          required
          aria-invalid={!!errors.amount}
          className={errors.amount ? "border-destructive" : ""}
        />
        {errors.amount && (
          <p className="text-sm text-destructive">{errors.amount}</p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">Categoria</Label>
          <Select 
            value={categoryId} 
            onValueChange={(value) => {
              setCategoryId(value)
              if (errors.categoryId) setErrors(prev => ({ ...prev, categoryId: undefined }))
            }}
          >
            <SelectTrigger aria-invalid={!!errors.categoryId} className={errors.categoryId ? "border-destructive" : ""}>
              <SelectValue placeholder="Selecionar categoria" />
            </SelectTrigger>
            <SelectContent>
              {categories
                .filter(cat => cat.type === type || type === "transfer")
                .map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          {errors.categoryId && (
            <p className="text-sm text-destructive">{errors.categoryId}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="account">Conta</Label>
          <Select 
            value={accountId} 
            onValueChange={(value) => {
              setAccountId(value)
              if (errors.accountId) setErrors(prev => ({ ...prev, accountId: undefined }))
            }}
          >
            <SelectTrigger aria-invalid={!!errors.accountId} className={errors.accountId ? "border-destructive" : ""}>
              <SelectValue placeholder="Selecionar conta" />
            </SelectTrigger>
            <SelectContent>
              {accounts.map((acc) => (
                <SelectItem key={acc.id} value={acc.id}>
                  {acc.name} - R$ {acc.balance.toFixed(2)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.accountId && (
            <p className="text-sm text-destructive">{errors.accountId}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Observações</Label>
        <Input
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Observações adicionais"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
        <Input
          id="tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="Ex: trabalho, casa, urgente"
        />
      </div>


      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Salvando...
            </>
          ) : (
            "Salvar Alterações"
          )}
        </Button>
      </div>
    </form>
  )
}

