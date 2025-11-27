"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Icon } from "@/components/ui/icon"
import { useToast } from "@/hooks/use-toast"

interface Category {
  id: string
  name: string
  color: string
  icon: string
  type: "income" | "expense" | "transfer"
  monthlyTotal?: number
  transactionCount?: number
}

interface EditCategoryFormProps {
  category: Category
  onSave: (category: Category) => void
  onClose: () => void
}

const colorOptions = [
  { value: "#ef4444", label: "Vermelho" },
  { value: "#f97316", label: "Laranja" },
  { value: "#f59e0b", label: "Amarelo" },
  { value: "#22c55e", label: "Verde" },
  { value: "#10b981", label: "Verde Esmeralda" },
  { value: "#06b6d4", label: "Ciano" },
  { value: "#3b82f6", label: "Azul" },
  { value: "#6366f1", label: "Índigo" },
  { value: "#8b5cf6", label: "Roxo" },
  { value: "#ec4899", label: "Rosa" },
]

const iconOptions = [
  "utensils",
  "car", 
  "home",
  "heart",
  "book",
  "gamepad2",
  "laptop",
  "dollar-sign",
  "trending-up",
  "briefcase",
  "arrow-left-right",
]

export function EditCategoryForm({ category, onSave, onClose }: EditCategoryFormProps) {
  const [name, setName] = useState(category.name)
  const [type, setType] = useState<"income" | "expense" | "transfer">(category.type)
  const [color, setColor] = useState(category.color)
  const [icon, setIcon] = useState(category.icon)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const response = await fetch(`/api/categories/${category.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          type,
          color,
          icon,
        }),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => null)
        throw new Error(data?.error || 'Erro ao atualizar categoria')
      }

      const updatedCategory = await response.json()
      onSave({
        ...category,
        ...updatedCategory,
        name,
        type,
        color,
        icon,
      })
      toast({
        title: "Sucesso!",
        description: "Categoria atualizada com sucesso.",
        variant: "success",
      })
      onClose()
    } catch (err: any) {
      setError(err?.message || 'Erro ao atualizar categoria')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome da Categoria</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ex: Alimentação, Transporte, etc."
          required
        />
      </div>

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
        <Label htmlFor="color">Cor</Label>
        <div className="grid grid-cols-5 gap-2">
          {colorOptions.map((colorOption) => (
            <button
              key={colorOption.value}
              type="button"
              className={`w-8 h-8 rounded-full border-2 ${
                color === colorOption.value ? "border-foreground" : "border-border"
              }`}
              style={{ backgroundColor: colorOption.value }}
              onClick={() => setColor(colorOption.value)}
              title={colorOption.label}
            />
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="icon">Ícone</Label>
        <div className="grid grid-cols-10 gap-2">
          {iconOptions.map((iconOption) => (
            <button
              key={iconOption}
              type="button"
              className={`w-8 h-8 rounded border flex items-center justify-center ${
                icon === iconOption ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
              }`}
              onClick={() => setIcon(iconOption)}
            >
              <Icon name={iconOption} className="h-4 w-4" />
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
          {error}
        </div>
      )}
      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Salvando...' : 'Salvar Alterações'}
        </Button>
      </div>
    </form>
  )
}
