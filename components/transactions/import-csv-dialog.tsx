"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, FileText, CheckCircle } from "lucide-react"

interface ImportCsvDialogProps {
  onClose: () => void
}

export function ImportCsvDialog({ onClose }: ImportCsvDialogProps) {
  const [file, setFile] = useState<File | null>(null)
  const [step, setStep] = useState<"upload" | "mapping" | "preview">("upload")
  const [columnMapping, setColumnMapping] = useState({
    date: "",
    description: "",
    amount: "",
    category: "",
    account: "",
  })

  // Mock CSV columns
  const csvColumns = ["Data", "Descrição", "Valor", "Categoria", "Conta", "Observações"]
  const requiredFields = [
    { key: "date", label: "Data" },
    { key: "description", label: "Descrição" },
    { key: "amount", label: "Valor" },
    { key: "category", label: "Categoria" },
    { key: "account", label: "Conta" },
  ]

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0]
    if (uploadedFile && uploadedFile.type === "text/csv") {
      setFile(uploadedFile)
      setStep("mapping")
    }
  }

  const handleMapping = () => {
    // Validar se todos os campos obrigatórios foram mapeados
    const allMapped = requiredFields.every((field) => columnMapping[field.key as keyof typeof columnMapping])
    if (allMapped) {
      setStep("preview")
    }
  }

  const handleImport = () => {
    // Aqui você processaria o arquivo CSV
    console.log("Importando arquivo:", file?.name, "com mapeamento:", columnMapping)
    onClose()
  }

  return (
    <div className="space-y-6">
      {step === "upload" && (
        <div className="space-y-4">
          <div className="text-center">
            <div className="mx-auto w-12 h-12 bg-muted rounded-lg flex items-center justify-center mb-4">
              <Upload className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium">Selecione o arquivo CSV</h3>
            <p className="text-sm text-muted-foreground">Faça upload do arquivo CSV com seus lançamentos financeiros</p>
          </div>

          <div className="border-2 border-dashed border-border rounded-lg p-6">
            <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" id="csv-upload" />
            <label htmlFor="csv-upload" className="cursor-pointer flex flex-col items-center gap-2">
              <FileText className="h-8 w-8 text-muted-foreground" />
              <span className="text-sm font-medium">Clique para selecionar arquivo</span>
              <span className="text-xs text-muted-foreground">Apenas arquivos .csv</span>
            </label>
          </div>
        </div>
      )}

      {step === "mapping" && (
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium">Mapear Colunas</h3>
            <p className="text-sm text-muted-foreground">Associe as colunas do seu CSV aos campos do sistema</p>
          </div>

          <div className="space-y-4">
            {requiredFields.map((field) => (
              <div key={field.key} className="grid grid-cols-2 gap-4 items-center">
                <Label>{field.label}</Label>
                <Select
                  value={columnMapping[field.key as keyof typeof columnMapping]}
                  onValueChange={(value) => setColumnMapping((prev) => ({ ...prev, [field.key]: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar coluna" />
                  </SelectTrigger>
                  <SelectContent>
                    {csvColumns.map((column) => (
                      <SelectItem key={column} value={column}>
                        {column}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setStep("upload")}>
              Voltar
            </Button>
            <Button onClick={handleMapping}>Continuar</Button>
          </div>
        </div>
      )}

      {step === "preview" && (
        <div className="space-y-4">
          <div className="text-center">
            <div className="mx-auto w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mb-4">
              <CheckCircle className="h-6 w-6 text-success" />
            </div>
            <h3 className="text-lg font-medium">Pronto para importar</h3>
            <p className="text-sm text-muted-foreground">Arquivo: {file?.name} • Mapeamento concluído</p>
          </div>

          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="font-medium mb-2">Resumo do mapeamento:</h4>
            <div className="space-y-1 text-sm">
              {requiredFields.map((field) => (
                <div key={field.key} className="flex justify-between">
                  <span>{field.label}:</span>
                  <span className="text-muted-foreground">
                    {columnMapping[field.key as keyof typeof columnMapping]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setStep("mapping")}>
              Voltar
            </Button>
            <Button onClick={handleImport}>Importar Lançamentos</Button>
          </div>
        </div>
      )}
    </div>
  )
}
