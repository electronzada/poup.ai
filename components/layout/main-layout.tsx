"use client"

import type React from "react"
import { useState, createContext, useContext } from "react"

import { ThemeProvider } from "next-themes"
import { SessionProvider } from "next-auth/react"
import { Sidebar } from "./sidebar"
import { Header } from "./header"
import { usePathname } from "next/navigation"

// Context para controlar sidebar mobile
const SidebarContext = createContext<{
  isMobileOpen: boolean
  setIsMobileOpen: (open: boolean) => void
}>({
  isMobileOpen: false,
  setIsMobileOpen: () => {},
})

export const useSidebar = () => useContext(SidebarContext)

interface MainLayoutProps {
  children: React.ReactNode
}

function LayoutContent({ children }: { children: React.ReactNode }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  return (
    <SidebarContext.Provider value={{ isMobileOpen, setIsMobileOpen }}>
      <div className="flex h-screen bg-background">
        <Sidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />
        <div className="flex flex-1 flex-col overflow-hidden w-0 min-w-0">
          <Header />
          <main className="flex-1 overflow-auto p-4 sm:p-6">{children}</main>
        </div>
      </div>
    </SidebarContext.Provider>
  )
}

export function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname()
  const isAuthPage = pathname?.startsWith("/login") || pathname?.startsWith("/register") || pathname?.startsWith("/forgot-password")

  if (isAuthPage) {
    return (
      <SessionProvider>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <div className="min-h-screen bg-background flex items-center justify-center">
            <main className="w-full max-w-xl">{children}</main>
          </div>
        </ThemeProvider>
      </SessionProvider>
    )
  }
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <LayoutContent>{children}</LayoutContent>
      </ThemeProvider>
    </SessionProvider>
  )
}
