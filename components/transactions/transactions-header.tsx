"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Plus, Upload, Download, Filter, Search, X } from "lucide-react"
import { NewTransactionForm } from "./new-transaction-form"
import { ImportCsvDialog } from "./import-csv-dialog"

interface Account {
  id: string
  name: string
  type: string
}

interface Category {
  id: string
  name: string
  type: string
}

export function TransactionsHeader() {
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [isNewTransactionOpen, setIsNewTransactionOpen] = useState(false)
  const [isImportOpen, setIsImportOpen] = useState(false)
  
  const [accounts, setAccounts] = useState<Account[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Carregar dados reais com cache simples
  useEffect(() => {
    const loadData = async () => {
      try {
        // Verificar cache simples
        const cachedAccounts = sessionStorage.getItem('accounts_cache')
        const cachedCategories = sessionStorage.getItem('categories_cache')
        const cacheTime = 60000 // 1 minuto

        if (cachedAccounts && cachedCategories) {
          const { data: accountsData, timestamp } = JSON.parse(cachedAccounts)
          const { data: categoriesData, timestamp: catTimestamp } = JSON.parse(cachedCategories)
          
          if (Date.now() - timestamp < cacheTime && Date.now() - catTimestamp < cacheTime) {
            setAccounts(accountsData)
            setCategories(categoriesData)
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
      }
    }

    loadData()
  }, [])

  // Debounce para busca
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    debounceTimerRef.current = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 300) // 300ms de debounce

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [searchTerm])

  // Disparar evento quando filtros mudarem (com debounce na busca)
  useEffect(() => {
    const event = new CustomEvent('transactionsFilterChanged', {
      detail: { searchTerm: debouncedSearchTerm, selectedAccounts, selectedCategories }
    })
    window.dispatchEvent(event)
  }, [debouncedSearchTerm, selectedAccounts, selectedCategories])

  const removeFilter = (type: "account" | "category", value: string) => {
    if (type === "account") {
      setSelectedAccounts((prev) => prev.filter((item) => item !== value))
    } else {
      setSelectedCategories((prev) => prev.filter((item) => item !== value))
    }
  }

  const clearAllFilters = () => {
    setSearchTerm("")
    setSelectedAccounts([])
    setSelectedCategories([])
  }

  const hasActiveFilters = searchTerm || selectedAccounts.length > 0 || selectedCategories.length > 0

  return (
    <div className="space-y-4">
      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-4">
        <Dialog open={isNewTransactionOpen} onOpenChange={setIsNewTransactionOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 cursor-pointer">
              <Plus className="h-4 w-4" />
              Novo Lançamento
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Novo Lançamento</DialogTitle>
            </DialogHeader>
            <NewTransactionForm onClose={() => setIsNewTransactionOpen(false)} />
          </DialogContent>
        </Dialog>

        <Dialog open={isImportOpen} onOpenChange={setIsImportOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="gap-2 bg-transparent">
              <Upload className="h-4 w-4" />
              Importar CSV
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Importar Lançamentos via CSV</DialogTitle>
            </DialogHeader>
            <ImportCsvDialog onClose={() => setIsImportOpen(false)} />
          </DialogContent>
        </Dialog>

        <Button variant="outline" className="gap-2 bg-transparent">
          <Download className="h-4 w-4" />
          Exportar CSV
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-4">
        <div className="relative flex-1 min-w-[200px] sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por descrição ou tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2 bg-transparent">
              <Filter className="h-4 w-4" />
              Contas
              {selectedAccounts.length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {selectedAccounts.length}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56">
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Selecionar Contas</h4>
              {accounts.map((account) => (
                <label key={account.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedAccounts.includes(account.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedAccounts((prev) => [...prev, account.id])
                      } else {
                        setSelectedAccounts((prev) => prev.filter((item) => item !== account.id))
                      }
                    }}
                    className="rounded border-border"
                  />
                  <span className="text-sm">{account.name}</span>
                </label>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2 bg-transparent">
              <Filter className="h-4 w-4" />
              Categorias
              {selectedCategories.length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {selectedCategories.length}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56">
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Selecionar Categorias</h4>
              {categories.map((category) => (
                <label key={category.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedCategories((prev) => [...prev, category.id])
                      } else {
                        setSelectedCategories((prev) => prev.filter((item) => item !== category.id))
                      }
                    }}
                    className="rounded border-border"
                  />
                  <span className="text-sm">{category.name}</span>
                </label>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {hasActiveFilters && (
          <Button variant="ghost" onClick={clearAllFilters} className="gap-2">
            <X className="h-4 w-4" />
            Limpar Filtros
          </Button>
        )}
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Filtros ativos:</span>
          {searchTerm && (
            <Badge variant="secondary" className="gap-1">
              Busca: {searchTerm}
              <X className="h-3 w-3 cursor-pointer" onClick={() => setSearchTerm("")} />
            </Badge>
          )}
          {selectedAccounts.map((accountId) => {
            const account = accounts.find(acc => acc.id === accountId)
            return account ? (
              <Badge key={accountId} variant="secondary" className="gap-1">
                {account.name}
                <X className="h-3 w-3 cursor-pointer" onClick={() => removeFilter("account", accountId)} />
              </Badge>
            ) : null
          })}
          {selectedCategories.map((categoryId) => {
            const category = categories.find(cat => cat.id === categoryId)
            return category ? (
              <Badge key={categoryId} variant="secondary" className="gap-1">
                {category.name}
                <X className="h-3 w-3 cursor-pointer" onClick={() => removeFilter("category", categoryId)} />
              </Badge>
            ) : null
          })}
        </div>
      )}
    </div>
  )
}
