"use client"

import { usePathname } from "next/navigation"
import { ReactNode } from "react"
import Header from "./Header"
import { AuthProvider } from "../contexts/AuthContext"

export default function LayoutClient({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const isPreview = pathname.startsWith("/preview")

  const showHeader =
    !pathname.startsWith("/admin") &&
    !pathname.startsWith("/checkout") &&
    !isPreview

  return (
    <AuthProvider>
      {showHeader && <Header />}
      {children}
    </AuthProvider>
  )
}