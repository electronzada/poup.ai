"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Search, Filter, X } from "lucide-react"

export function DashboardFilters() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])

  const accounts: string[] = []
  const categories: string[] = []

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
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 max-w-sm">
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
                <label key={account} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedAccounts.includes(account)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedAccounts((prev) => [...prev, account])
                      } else {
                        setSelectedAccounts((prev) => prev.filter((item) => item !== account))
                      }
                    }}
                    className="rounded border-border"
                  />
                  <span className="text-sm">{account}</span>
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
                <label key={category} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedCategories((prev) => [...prev, category])
                      } else {
                        setSelectedCategories((prev) => prev.filter((item) => item !== category))
                      }
                    }}
                    className="rounded border-border"
                  />
                  <span className="text-sm">{category}</span>
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
          {selectedAccounts.map((account) => (
            <Badge key={account} variant="secondary" className="gap-1">
              {account}
              <X className="h-3 w-3 cursor-pointer" onClick={() => removeFilter("account", account)} />
            </Badge>
          ))}
          {selectedCategories.map((category) => (
            <Badge key={category} variant="secondary" className="gap-1">
              {category}
              <X className="h-3 w-3 cursor-pointer" onClick={() => removeFilter("category", category)} />
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
