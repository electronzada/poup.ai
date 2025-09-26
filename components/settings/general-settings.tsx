"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useTheme } from "next-themes"

export function GeneralSettings() {
  const { theme, setTheme } = useTheme()
  const [currency, setCurrency] = useState("BRL")
  const [firstDayOfMonth, setFirstDayOfMonth] = useState("1")
  const [notifications, setNotifications] = useState(true)
  const [autoBackup, setAutoBackup] = useState(false)

  const currencies = [
    { value: "BRL", label: "Real Brasileiro (R$)" },
    { value: "USD", label: "Dólar Americano ($)" },
    { value: "EUR", label: "Euro (€)" },
  ]

  const firstDayOptions = Array.from({ length: 28 }, (_, i) => ({
    value: (i + 1).toString(),
    label: `Dia ${i + 1}`,
  }))

  const handleSave = () => {
    // Aqui você salvaria as configurações
    console.log({
      theme,
      currency,
      firstDayOfMonth,
      notifications,
      autoBackup,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações Gerais</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="currency">Moeda Padrão</Label>
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
            <Label htmlFor="firstDay">Primeiro Dia do Mês Financeiro</Label>
            <Select value={firstDayOfMonth} onValueChange={setFirstDayOfMonth}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {firstDayOptions.map((day) => (
                  <SelectItem key={day.value} value={day.value}>
                    {day.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="theme">Tema</Label>
            <Select value={theme} onValueChange={setTheme}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Claro</SelectItem>
                <SelectItem value="dark">Escuro</SelectItem>
                <SelectItem value="system">Sistema</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="notifications">Notificações</Label>
              <p className="text-sm text-muted-foreground">Receber notificações sobre transações e lembretes</p>
            </div>
            <Switch id="notifications" checked={notifications} onCheckedChange={setNotifications} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="autoBackup">Backup Automático</Label>
              <p className="text-sm text-muted-foreground">Fazer backup automático dos dados semanalmente</p>
            </div>
            <Switch id="autoBackup" checked={autoBackup} onCheckedChange={setAutoBackup} />
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSave}>Salvar Configurações</Button>
        </div>
      </CardContent>
    </Card>
  )
}
