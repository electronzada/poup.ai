"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface NewAccountFormProps {
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

export function NewAccountForm({ onClose }: NewAccountFormProps) {
  const [name, setName] = useState("")
  const [type, setType] = useState<"cash" | "checking" | "credit" | "savings">("checking")
  const [currency, setCurrency] = useState("BRL")
  const [initialBalance, setInitialBalance] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Aqui você salvaria a conta
    console.log({
      name,
      type,
      currency,
      balance: Number.parseFloat(initialBalance) || 0,
    })
    onClose()
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
        <Label htmlFor="balance">Saldo Inicial</Label>
        <Input
          id="balance"
          type="number"
          step="0.01"
          value={initialBalance}
          onChange={(e) => setInitialBalance(e.target.value)}
          placeholder="0,00"
        />
        <p className="text-xs text-muted-foreground">Deixe em branco se não souber o saldo atual</p>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit">Criar Conta</Button>
      </div>
    </form>
  )
}
