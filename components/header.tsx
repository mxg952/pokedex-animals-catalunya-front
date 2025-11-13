"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"

export function Header() {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  // Don't show header on landing page
  if (pathname === "/") {
    return null
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link href={user ? "/dashboard" : "/"} className="flex items-center space-x-2">
          <span className="text-2xl">🦅</span>
          <span className="font-serif text-xl font-bold text-foreground">Pokédex Catalunya</span>
        </Link>

        <nav className="flex items-center gap-6">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === "/dashboard" ? "text-primary" : "text-muted-foreground"
                }`}
              >
                Inici
              </Link>
              
              {user.role === "ADMIN_ROLE" && (
                <Link
                  href="/admin"
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    pathname === "/admin" ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  Administrador
                </Link>
              )}
              <Button onClick={logout} variant="ghost" size="sm">
                Tancar sessió
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Iniciar sessió
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Registrar-se</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
