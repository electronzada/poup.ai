import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { MainLayout } from "@/components/layout/main-layout"
import "./globals.css"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "Dashboard Financeiro",
  description: "Sistema de controle financeiro pessoal",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="font-sans antialiased">
        <Suspense>
          <MainLayout>{children}</MainLayout>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
