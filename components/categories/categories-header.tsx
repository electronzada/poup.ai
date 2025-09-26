"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus } from "lucide-react"
import { NewCategoryForm } from "./new-category-form"

export function CategoriesHeader() {
  const [isNewCategoryOpen, setIsNewCategoryOpen] = useState(false)

  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-muted-foreground">Gerencie suas categorias de receitas e despesas</p>
      </div>

      <Dialog open={isNewCategoryOpen} onOpenChange={setIsNewCategoryOpen}>
        <DialogTrigger asChild>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Nova Categoria
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Nova Categoria</DialogTitle>
          </DialogHeader>
          <NewCategoryForm onClose={() => setIsNewCategoryOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
