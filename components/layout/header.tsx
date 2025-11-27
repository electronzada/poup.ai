"use client"

import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useIsMobile } from "@/hooks/use-mobile"
import { useSidebar } from "./main-layout"

export function Header() {
  const isMobile = useIsMobile()
  const sidebarContext = useSidebar()
  
  const handleOpenSidebar = () => {
    if (sidebarContext?.setIsMobileOpen) {
      sidebarContext.setIsMobileOpen(true)
    }
  }

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-card px-4 sm:px-6">
      <div className="flex items-center gap-4">
        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleOpenSidebar}
            className="md:hidden"
            aria-label="Abrir menu"
            type="button"
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}
        <h1 className="text-lg sm:text-xl font-semibold text-card-foreground">Dashboard Financeiro</h1>
      </div>
    </header>
  )
}
