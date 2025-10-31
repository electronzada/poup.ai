"use client"

import type React from "react"

import { ThemeProvider } from "next-themes"
import { Sidebar } from "./sidebar"
import { Header } from "./header"
import { usePathname } from "next/navigation"

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname()
  const isAuthPage = pathname?.startsWith("/login") || pathname?.startsWith("/register")

  if (isAuthPage) {
    return (
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <div className="min-h-screen bg-background">
          <main className="container mx-auto px-4 py-10 max-w-xl">{children}</main>
        </div>
      </ThemeProvider>
    )
  }
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-auto p-6">{children}</main>
        </div>
      </div>
    </ThemeProvider>
  )
}
