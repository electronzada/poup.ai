"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus } from "lucide-react"
import { NewAccountForm } from "./new-account-form"

export function AccountsHeader() {
  const [isNewAccountOpen, setIsNewAccountOpen] = useState(false)

  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-muted-foreground">Gerencie suas contas bancárias, cartões e carteiras</p>
      </div>

      <Dialog open={isNewAccountOpen} onOpenChange={setIsNewAccountOpen}>
        <DialogTrigger asChild>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Nova Conta
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Nova Conta</DialogTitle>
          </DialogHeader>
          <NewAccountForm onClose={() => setIsNewAccountOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
