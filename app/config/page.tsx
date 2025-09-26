"use client"

import { SettingsHeader } from "@/components/settings/settings-header"
import { GeneralSettings } from "@/components/settings/general-settings"
import { ExportSettings } from "@/components/settings/export-settings"
import { SystemSettings } from "@/components/settings/system-settings"

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Configurações</h1>
      </div>

      <SettingsHeader />

      <div className="grid gap-6">
        <GeneralSettings />
        <ExportSettings />
        <SystemSettings />
      </div>
    </div>
  )
}
