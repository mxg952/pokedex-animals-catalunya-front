"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle } from "lucide-react"

export default function LoginPage() {
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      await login(name, password)
    } catch (err: any) {
      console.error("[v0] Login failed:", err)

      if (err.message === "Network Error" || err.code === "ECONNABORTED") {
        setError("No es pot connectar amb el servidor. Assegura't que el backend està corrent a http://localhost:8080")
      } else if (err.response?.status === 401 || err.response?.status === 403) {
        setError("Nom d'usuari o contrasenya incorrectes")
      } else if (err.response?.status === 404) {
        setError("Usuari no trobat")
      } else {
        setError(err.response?.data?.message || "Error en iniciar sessió. Si us plau, torna-ho a intentar.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="mb-2 font-serif text-3xl font-bold text-foreground">Iniciar sessió</h1>
          <p className="text-muted-foreground">Accedeix al teu compte per continuar descobrint animals</p>
        </div>

        <div className="rounded-lg border border-border bg-background p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom d'usuari</Label>
              <Input
                id="name"
                type="text"
                placeholder="El teu nom d'usuari"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contrasenya</Label>
              <Input
                id="password"
                type="password"
                placeholder="La teva contrasenya"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <div className="flex items-start gap-2 rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <p className="leading-relaxed">{error}</p>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Iniciant sessió..." : "Iniciar sessió"}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            <span className="text-muted-foreground">No tens compte? </span>
            <Link href="/register" className="font-medium text-primary hover:underline">
              Registra't
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
