"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

interface Account {
  id: string
  name: string
  type: "checking" | "savings" | "credit" | "investment"
  currency: string
  balance: number
  lastTransaction?: Date
}

interface EditAccountFormProps {
  account: Account
  onSave: (account: Account) => void
  onClose: () => void
}

const accountTypes = [
  { value: "checking", label: "Conta Corrente" },
  { value: "savings", label: "Poupança" },
  { value: "credit", label: "Cartão de Crédito" },
  { value: "investment", label: "Investimento" },
]

const currencies = [
  { value: "BRL", label: "Real (BRL)" },
  { value: "USD", label: "Dólar (USD)" },
  { value: "EUR", label: "Euro (EUR)" },
]

export function EditAccountForm({ account, onSave, onClose }: EditAccountFormProps) {
  const [name, setName] = useState(account.name)
  const [type, setType] = useState<"checking" | "savings" | "credit" | "investment">(account.type)
  const [currency, setCurrency] = useState(account.currency)
  const [balance, setBalance] = useState(account.balance.toString())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const response = await fetch(`/api/accounts/${account.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          type,
          currency,
        }),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => null)
        throw new Error(data?.error || 'Erro ao atualizar conta')
      }

      const updatedAccount = await response.json()
      onSave({
        ...account,
        ...updatedAccount,
        name,
        type,
        currency,
        balance: account.balance, // Mantém o saldo original, pois não é editável via API
      })
      toast({
        title: "Sucesso!",
        description: "Conta atualizada com sucesso.",
        variant: "success",
      })
      onClose()
    } catch (err: any) {
      setError(err?.message || 'Erro ao atualizar conta')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome da Conta</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ex: Conta Corrente, Cartão Nubank, etc."
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="type">Tipo de Conta</Label>
        <Select value={type} onValueChange={(value: "checking" | "savings" | "credit" | "investment") => setType(value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {accountTypes.map((accountType) => (
              <SelectItem key={accountType.value} value={accountType.value}>
                {accountType.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="currency">Moeda</Label>
        <Select value={currency} onValueChange={setCurrency}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {currencies.map((curr) => (
              <SelectItem key={curr.value} value={curr.value}>
                {curr.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="balance">Saldo Atual</Label>
        <Input
          id="balance"
          type="number"
          step="0.01"
          value={balance}
          onChange={(e) => setBalance(e.target.value)}
          placeholder="0,00"
          disabled
        />
        <p className="text-xs text-muted-foreground">
          O saldo é atualizado automaticamente através das transações.
        </p>
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
