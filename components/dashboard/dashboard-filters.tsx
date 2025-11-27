"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Search, Filter, X } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"

interface Account {
  id: string
  name: string
}

interface Category {
  id: string
  name: string
}

export function DashboardFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || "")
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [accounts, setAccounts] = useState<Account[]>([])
  const [categories, setCategories] = useState<Category[]>([])

  // Carregar dados reais
  useEffect(() => {
    const loadData = async () => {
      try {
        const [accountsRes, categoriesRes] = await Promise.all([
          fetch('/api/accounts'),
          fetch('/api/categories')
        ])
        
        if (accountsRes.ok && categoriesRes.ok) {
          const accountsData = await accountsRes.json()
          const categoriesData = await categoriesRes.json()
          
          setAccounts(accountsData)
          setCategories(categoriesData)
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error)
      }
    }

    loadData()
  }, [])

  const removeFilter = (type: "account" | "category", value: string) => {
    if (type === "account") {
      const newAccounts = selectedAccounts.filter((item) => item !== value)
      setSelectedAccounts(newAccounts)
      applyFilters(searchTerm, newAccounts, selectedCategories)
    } else {
      const newCategories = selectedCategories.filter((item) => item !== value)
      setSelectedCategories(newCategories)
      applyFilters(searchTerm, selectedAccounts, newCategories)
    }
  }

  const clearAllFilters = () => {
    setSearchTerm("")
    setSelectedAccounts([])
    setSelectedCategories([])
    applyFilters("", [], [])
  }

  const applyFilters = (search: string, accounts: string[], cats: string[]) => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (search) {
      params.set('search', search)
    } else {
      params.delete('search')
    }
    
    if (accounts.length > 0) {
      params.set('accounts', accounts.join(','))
    } else {
      params.delete('accounts')
    }
    
    if (cats.length > 0) {
      params.set('categories', cats.join(','))
    } else {
      params.delete('categories')
    }
    
    router.push(`/?${params.toString()}`)
  }

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    // Debounce seria ideal, mas por simplicidade aplica direto
    setTimeout(() => applyFilters(value, selectedAccounts, selectedCategories), 500)
  }

  const hasActiveFilters = searchTerm || selectedAccounts.length > 0 || selectedCategories.length > 0

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2 sm:gap-4">
        <div className="relative flex-1 min-w-[200px] sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por descrição ou tags..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
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
              {accounts.length === 0 ? (
                <p className="text-sm text-muted-foreground">Nenhuma conta encontrada</p>
              ) : (
                accounts.map((account) => (
                  <label key={account.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedAccounts.includes(account.id)}
                      onChange={(e) => {
                        const newAccounts = e.target.checked
                          ? [...selectedAccounts, account.id]
                          : selectedAccounts.filter((item) => item !== account.id)
                        setSelectedAccounts(newAccounts)
                        applyFilters(searchTerm, newAccounts, selectedCategories)
                      }}
                      className="rounded border-border"
                    />
                    <span className="text-sm">{account.name}</span>
                  </label>
                ))
              )}
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
              {categories.length === 0 ? (
                <p className="text-sm text-muted-foreground">Nenhuma categoria encontrada</p>
              ) : (
                categories.map((category) => (
                  <label key={category.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category.id)}
                      onChange={(e) => {
                        const newCategories = e.target.checked
                          ? [...selectedCategories, category.id]
                          : selectedCategories.filter((item) => item !== category.id)
                        setSelectedCategories(newCategories)
                        applyFilters(searchTerm, selectedAccounts, newCategories)
                      }}
                      className="rounded border-border"
                    />
                    <span className="text-sm">{category.name}</span>
                  </label>
                ))
              )}
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
            const account = accounts.find(a => a.id === accountId)
            return account ? (
              <Badge key={accountId} variant="secondary" className="gap-1">
                {account.name}
                <X className="h-3 w-3 cursor-pointer" onClick={() => removeFilter("account", accountId)} />
              </Badge>
            ) : null
          })}
          {selectedCategories.map((categoryId) => {
            const category = categories.find(c => c.id === categoryId)
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
