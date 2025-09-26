"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, Database, HardDrive, Activity, AlertTriangle, CheckCircle } from "lucide-react"

export function SystemSettings() {
  const [isRecalculating, setIsRecalculating] = useState(false)
  const [recalculateProgress, setRecalculateProgress] = useState(0)

  // Mock system data
  const systemInfo = {
    totalTransactions: 1247,
    totalCategories: 12,
    totalAccounts: 4,
    databaseSize: "2.3 MB",
    lastBackup: new Date("2024-12-05"),
    systemStatus: "healthy",
  }

  const handleRecalculateBalances = async () => {
    setIsRecalculating(true)
    setRecalculateProgress(0)

    // Simular processo de recálculo
    const interval = setInterval(() => {
      setRecalculateProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsRecalculating(false)
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  const handleClearCache = () => {
    console.log("Limpando cache...")
  }

  const handleExportBackup = () => {
    console.log("Exportando backup...")
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações do Sistema</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* System Status */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Status do Sistema</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <Database className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">{systemInfo.totalTransactions}</p>
                <p className="text-xs text-muted-foreground">Transações</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <Activity className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">{systemInfo.totalCategories}</p>
                <p className="text-xs text-muted-foreground">Categorias</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <HardDrive className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">{systemInfo.databaseSize}</p>
                <p className="text-xs text-muted-foreground">Tamanho BD</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <CheckCircle className="h-5 w-5 text-success" />
              <div>
                <Badge variant="outline" className="text-success border-success">
                  Saudável
                </Badge>
                <p className="text-xs text-muted-foreground">Sistema</p>
              </div>
            </div>
          </div>
        </div>

        {/* Backup Info */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Backup</h4>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="text-sm font-medium">Último Backup</p>
              <p className="text-xs text-muted-foreground">{formatDate(systemInfo.lastBackup)}</p>
            </div>
            <Button variant="outline" onClick={handleExportBackup}>
              Criar Backup
            </Button>
          </div>
        </div>

        {/* System Actions */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Ações do Sistema</h4>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="text-sm font-medium">Recalcular Saldos</p>
                <p className="text-xs text-muted-foreground">
                  Recalcula todos os saldos das contas baseado nas transações
                </p>
              </div>
              <Button onClick={handleRecalculateBalances} disabled={isRecalculating} className="gap-2">
                <RefreshCw className={`h-4 w-4 ${isRecalculating ? "animate-spin" : ""}`} />
                {isRecalculating ? "Recalculando..." : "Recalcular"}
              </Button>
            </div>

            {isRecalculating && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progresso</span>
                  <span>{recalculateProgress}%</span>
                </div>
                <Progress value={recalculateProgress} className="w-full" />
              </div>
            )}

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="text-sm font-medium">Limpar Cache</p>
                <p className="text-xs text-muted-foreground">Remove dados temporários para melhorar a performance</p>
              </div>
              <Button variant="outline" onClick={handleClearCache}>
                Limpar Cache
              </Button>
            </div>
          </div>
        </div>

        {/* Warning Section */}
        <div className="p-4 border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/20 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-800 dark:text-amber-200">Atenção</p>
              <p className="text-xs text-amber-700 dark:text-amber-300">
                As operações de sistema podem afetar a performance temporariamente. Recomendamos fazer backup antes de
                executar ações críticas.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
