"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { MoreHorizontal, Edit, Trash2, Circle, Loader2 } from "lucide-react"
import { EditCategoryForm } from "./edit-category-form"
import { useToast } from "@/hooks/use-toast"
import { Icon } from "@/components/ui/icon"

interface Category {
  id: string
  name: string
  color: string
  icon?: string
  type: "income" | "expense" | "transfer"
  description?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export function CategoriesTable({ initialCategories }: { initialCategories?: Category[] }) {
  const [categories, setCategories] = useState<Category[]>(initialCategories || [])
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  // Carregar categorias da API
  const loadCategories = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
      } else {
        throw new Error('Erro ao carregar categorias')
      }
    } catch (error) {
      console.error('Erro ao carregar categorias:', error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar as categorias.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // Se veio dado inicial do servidor, evita a primeira chamada
    if (!initialCategories || initialCategories.length === 0) {
      loadCategories()
    } else {
      setIsLoading(false)
    }
    // Recarregar quando categorias forem alteradas (criação/edição/remoção)
    const handler = () => loadCategories()
    if (typeof window !== 'undefined') {
      window.addEventListener('categories:changed', handler)
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('categories:changed', handler)
      }
    }
  }, [])

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        loadCategories() // Recarregar a lista
        toast({
          title: "Sucesso!",
          description: "Categoria excluída com sucesso.",
          variant: "success",
        })
      } else {
        throw new Error('Erro ao excluir categoria')
      }
    } catch (error) {
      console.error('Erro ao excluir categoria:', error)
      toast({
        title: "Erro",
        description: "Não foi possível excluir a categoria.",
        variant: "destructive"
      })
    }
  }

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
  }

  const handleSaveEdit = (updatedCategory: Category) => {
    setCategories((prev) => prev.map((cat) => (cat.id === updatedCategory.id ? updatedCategory : cat)))
    setEditingCategory(null)
    loadCategories() // Recarregar para garantir dados atualizados
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Todas as Categorias</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="ml-2">Carregando categorias...</span>
            </div>
          ) : (
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <div className="inline-block min-w-full align-middle px-4 sm:px-0">
                <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      Nenhuma categoria encontrada
                    </TableCell>
                  </TableRow>
                ) : (
                  categories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <Circle className="h-3 w-3" style={{ color: category.color, fill: category.color }} />
                            {category.icon && <Icon name={category.icon} className="h-4 w-4" />}
                          </div>
                          <span className="font-medium">{category.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={category.type === "income" ? "default" : category.type === "expense" ? "destructive" : "secondary"}
                          className={
                            category.type === "income" 
                              ? "bg-green-600 text-white" 
                              : category.type === "expense"
                              ? "bg-red-600 text-white"
                              : "bg-blue-600 text-white"
                          }
                        >
                          {category.type === "income" ? "Receita" : category.type === "expense" ? "Despesa" : "Transferência"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={category.isActive ? "default" : "secondary"}>
                          {category.isActive ? "Ativa" : "Inativa"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {category.description || "Sem descrição"}
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
                              onClick={() => handleEdit(category)}
                              className="cursor-pointer"
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-destructive cursor-pointer" 
                              onClick={() => handleDelete(category.id)}
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
      </Card>

      <Dialog open={!!editingCategory} onOpenChange={() => setEditingCategory(null)}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Categoria</DialogTitle>
          </DialogHeader>
          {editingCategory && (
            <EditCategoryForm
              category={editingCategory}
              onSave={handleSaveEdit}
              onClose={() => setEditingCategory(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
