"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Account {
  id: string
  name: string
  type: "cash" | "checking" | "credit" | "savings"
  currency: string
  balance: number
  lastTransaction: Date
}

interface EditAccountFormProps {
  account: Account
  onSave: (account: Account) => void
  onClose: () => void
}

const accountTypes = [
  { value: "cash", label: "Dinheiro" },
  { value: "checking", label: "Conta Corrente" },
  { value: "credit", label: "Cartão de Crédito" },
  { value: "savings", label: "Poupança" },
]

const currencies = [
  { value: "BRL", label: "Real (BRL)" },
  { value: "USD", label: "Dólar (USD)" },
  { value: "EUR", label: "Euro (EUR)" },
]

export function EditAccountForm({ account, onSave, onClose }: EditAccountFormProps) {
  const [name, setName] = useState(account.name)
  const [type, setType] = useState<"cash" | "checking" | "credit" | "savings">(account.type)
  const [currency, setCurrency] = useState(account.currency)
  const [balance, setBalance] = useState(account.balance.toString())

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      ...account,
      name,
      type,
      currency,
      balance: Number.parseFloat(balance) || 0,
    })
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
        <Select value={type} onValueChange={(value: "cash" | "checking" | "credit" | "savings") => setType(value)}>
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
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit">Salvar Alterações</Button>
      </div>
    </form>
  )
}
