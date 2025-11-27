"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useTheme } from "next-themes"
import { signOut } from "next-auth/react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { LayoutDashboard, Receipt, Tag, CreditCard, Settings, TrendingUp, Plus, DollarSign, User, Sun, Moon, ChevronsLeft, ChevronsRight, LogOut, MessageCircle, Menu } from "lucide-react"
import { NewTransactionForm } from "@/components/transactions/new-transaction-form"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useIsMobile } from "@/hooks/use-mobile"

const navigation = [
  {
    name: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Lançamentos",
    href: "/lancamentos",
    icon: Receipt,
  },
  {
    name: "Categorias",
    href: "/categorias",
    icon: Tag,
  },
  {
    name: "Contas",
    href: "/contas",
    icon: CreditCard,
  },
]

interface SidebarProps {
  isMobileOpen?: boolean
  setIsMobileOpen?: (open: boolean) => void
}

export function Sidebar({ isMobileOpen: externalIsMobileOpen, setIsMobileOpen: externalSetIsMobileOpen }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { data: session } = useSession()
  const { theme, setTheme } = useTheme()
  const isMobile = useIsMobile()
  const [isNewTransactionOpen, setIsNewTransactionOpen] = useState(false)
  const [internalMobileOpen, setInternalMobileOpen] = useState(false)
  
  // Usar estado externo se fornecido, senão usar interno
  const isMobileOpen = externalIsMobileOpen ?? internalMobileOpen
  const setIsMobileOpen = externalSetIsMobileOpen ?? setInternalMobileOpen
  
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('sidebar-collapsed') === 'true'
    }
    return false
  })

  useEffect(() => {
    if (typeof window !== 'undefined' && !isMobile) {
      localStorage.setItem('sidebar-collapsed', String(isCollapsed))
    }
  }, [isCollapsed, isMobile])

  // Fechar sidebar mobile ao navegar
  useEffect(() => {
    if (isMobile && isMobileOpen) {
      setIsMobileOpen(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  const getUserInitials = (name?: string | null) => {
    if (!name) return "U"
    const parts = name.split(" ")
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
  }

  const handleLogout = async () => {
    try {
      // Fazer logout sem redirecionamento automático
      await signOut({ 
        callbackUrl: "/login",
        redirect: false 
      })
      
      // Redirecionar manualmente após logout
      window.location.href = "/login"
    } catch (error) {
      console.error("Erro ao fazer logout:", error)
      // Em caso de erro, forçar redirecionamento
      window.location.href = "/login"
    }
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const sidebarContent = (
    <>
      <div className={cn(
        "flex h-16 items-center border-b border-sidebar-border transition-all",
        isCollapsed ? "justify-center px-2" : "px-6"
      )}>
        <div className="flex items-center gap-2">
          <DollarSign className="h-6 w-6 text-sidebar-primary flex-shrink-0" />
          {!isCollapsed && (
            <span className="text-lg font-semibold text-sidebar-foreground">Poup.ai</span>
          )}
        </div>
      </div>

      <div className={cn(
        "flex-1 overflow-y-auto transition-all",
        isCollapsed ? "px-2 py-6" : "px-4 py-6"
      )}>
        <div className="mb-6">
          <Dialog open={isNewTransactionOpen} onOpenChange={setIsNewTransactionOpen}>
            <DialogTrigger asChild>
              <Button 
                className={cn(
                  "w-full cursor-pointer h-9",
                  isCollapsed ? "justify-center px-2" : "justify-start gap-2"
                )} 
                size="sm"
              >
                <Plus className="h-4 w-4 flex-shrink-0" />
                {!isCollapsed && <span>Novo Lançamento</span>}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Novo Lançamento</DialogTitle>
              </DialogHeader>
              <NewTransactionForm onClose={() => setIsNewTransactionOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>

        <nav className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center rounded-lg text-sm font-medium transition-colors h-9",
                  isCollapsed ? "justify-center px-2" : "gap-3 px-3",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                )}
                title={isCollapsed ? item.name : undefined}
              >
                <item.icon className="h-4 w-4 flex-shrink-0" />
                {!isCollapsed && <span>{item.name}</span>}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Settings Section */}
      <div className={cn(
        "space-y-1 transition-all",
        isCollapsed ? "px-2 py-2" : "px-4 py-2"
      )}>
        <button
          onClick={() => router.push('/config')}
          className={cn(
            "w-full flex items-center rounded-lg text-sm font-medium transition-colors text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground h-9",
            isCollapsed ? "justify-center px-2" : "gap-3 px-3",
            pathname === '/config' && "bg-sidebar-accent text-sidebar-accent-foreground"
          )}
          title={isCollapsed ? "Configurações" : undefined}
        >
          <Settings className="h-4 w-4 flex-shrink-0" />
          {!isCollapsed && <span>Configurações</span>}
        </button>

        <button
          onClick={toggleTheme}
          className={cn(
            "w-full flex items-center rounded-lg text-sm font-medium transition-colors text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground h-9",
            isCollapsed ? "justify-center px-2" : "gap-3 px-3"
          )}
          title={isCollapsed ? "Tema" : undefined}
        >
          {theme === "dark" ? (
            <Moon className="h-4 w-4 flex-shrink-0" />
          ) : (
            <Sun className="h-4 w-4 flex-shrink-0" />
          )}
          {!isCollapsed && <span>Tema</span>}
        </button>

        {!isMobile && (
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={cn(
              "w-full flex items-center rounded-lg text-sm font-medium transition-colors text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground h-9",
              isCollapsed ? "justify-center px-2" : "gap-3 px-3"
            )}
            title={isCollapsed ? "Expandir" : "Encolher"}
          >
            {isCollapsed ? (
              <ChevronsRight className="h-4 w-4 flex-shrink-0" />
            ) : (
              <ChevronsLeft className="h-4 w-4 flex-shrink-0" />
            )}
            {!isCollapsed && <span>Encolher</span>}
          </button>
        )}

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button
              className={cn(
                "w-full flex items-center rounded-lg text-sm font-medium transition-colors text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 h-9",
                isCollapsed ? "justify-center px-2" : "gap-3 px-3"
              )}
              title={isCollapsed ? "Sair" : undefined}
            >
              <LogOut className="h-4 w-4 flex-shrink-0" />
              {!isCollapsed && <span>Sair</span>}
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar saída</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja sair da sua conta? Você precisará fazer login novamente para acessar o sistema.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Sair
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* User Profile Section */}
      {!isCollapsed && (
        <div className="border-t border-sidebar-border p-3">
          <button
            onClick={() => router.push('/perfil')}
            className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sidebar-foreground"
          >
            <Avatar className="h-10 w-10 flex-shrink-0">
              <AvatarFallback className="bg-sidebar-accent text-sidebar-accent-foreground text-sm">
                {getUserInitials(session?.user?.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 text-left min-w-0">
              <div className="font-medium truncate">
                {session?.user?.name || "Usuário"}
              </div>
              <div className="text-xs text-sidebar-foreground/70 truncate">
                {session?.user?.email || ""}
              </div>
            </div>
          </button>
        </div>
      )}

      {/* User Profile Section - Collapsed */}
      {isCollapsed && !isMobile && (
        <div className="border-t border-sidebar-border p-5">
          <button
            onClick={() => router.push('/perfil')}
            className="w-full flex items-center justify-center rounded-lg transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sidebar-foreground"
            title={session?.user?.name || "Perfil"}
          >
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-sidebar-accent text-sidebar-accent-foreground text-sm">
                {getUserInitials(session?.user?.name)}
              </AvatarFallback>
            </Avatar>
          </button>
        </div>
      )}
    </>
  )

  return (
    <>
      {/* Desktop: sidebar normal */}
      <div className={cn(
        "hidden md:flex h-full flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}>
        {sidebarContent}
      </div>

      {/* Mobile: Sheet (drawer) - sempre renderizado mas só funciona em mobile */}
      <Sheet open={isMobile ? isMobileOpen : false} onOpenChange={isMobile ? setIsMobileOpen : () => {}}>
        <SheetContent side="left" className="w-64 p-0 bg-sidebar border-sidebar-border [&>button]:hidden">
          <SheetHeader className="sr-only">
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>
          <div className="flex h-full flex-col">
            {sidebarContent}
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
