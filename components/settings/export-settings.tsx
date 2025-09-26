"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Download, FileText } from "lucide-react"

export function ExportSettings() {
  const [exportFormat, setExportFormat] = useState("csv")
  const [includeCategories, setIncludeCategories] = useState(true)
  const [includeAccounts, setIncludeAccounts] = useState(true)
  const [includeTags, setIncludeTags] = useState(false)
  const [dateFormat, setDateFormat] = useState("dd/mm/yyyy")

  const exportFormats = [
    { value: "csv", label: "CSV (Excel)" },
    { value: "xlsx", label: "Excel (.xlsx)" },
    { value: "pdf", label: "PDF" },
    { value: "json", label: "JSON" },
  ]

  const dateFormats = [
    { value: "dd/mm/yyyy", label: "DD/MM/AAAA" },
    { value: "mm/dd/yyyy", label: "MM/DD/AAAA" },
    { value: "yyyy-mm-dd", label: "AAAA-MM-DD" },
  ]

  const handleExportAll = () => {
    console.log("Exportando todos os dados...")
  }

  const handleExportFiltered = () => {
    console.log("Exportando dados filtrados...")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações de Exportação</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="exportFormat">Formato de Exportação</Label>
            <Select value={exportFormat} onValueChange={setExportFormat}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {exportFormats.map((format) => (
                  <SelectItem key={format.value} value={format.value}>
                    {format.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dateFormat">Formato de Data</Label>
            <Select value={dateFormat} onValueChange={setDateFormat}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {dateFormats.map((format) => (
                  <SelectItem key={format.value} value={format.value}>
                    {format.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-medium">Incluir nos Exports</h4>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="includeCategories">Categorias</Label>
              <p className="text-sm text-muted-foreground">Incluir informações de categoria nas exportações</p>
            </div>
            <Switch id="includeCategories" checked={includeCategories} onCheckedChange={setIncludeCategories} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="includeAccounts">Contas</Label>
              <p className="text-sm text-muted-foreground">Incluir informações de conta nas exportações</p>
            </div>
            <Switch id="includeAccounts" checked={includeAccounts} onCheckedChange={setIncludeAccounts} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="includeTags">Tags</Label>
              <p className="text-sm text-muted-foreground">Incluir tags das transações nas exportações</p>
            </div>
            <Switch id="includeTags" checked={includeTags} onCheckedChange={setIncludeTags} />
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button onClick={handleExportAll} className="gap-2">
            <Download className="h-4 w-4" />
            Exportar Todos os Dados
          </Button>
          <Button variant="outline" onClick={handleExportFiltered} className="gap-2 bg-transparent">
            <FileText className="h-4 w-4" />
            Exportar Dados Filtrados
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
