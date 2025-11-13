"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle } from "lucide-react"
import CharacterSelector from "@/components/character-selector"
import type { CharacterType } from "@/lib/types"

export default function RegisterPage() {
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [selectedCharacter, setSelectedCharacter] = useState<CharacterType>("explorer")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { register } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (password !== confirmPassword) {
      setError("Les contrasenyes no coincideixen")
      return
    }

    if (password.length < 5) {
      setError("La contrasenya ha de tenir almenys 5 caràcters")
      return
    }

    if (name.length < 2) {
      setError("El nom ha de tenir almenys 2 caràcters")
      return
    }

    setIsLoading(true)

    try {
      await register(name, password, selectedCharacter)
    } catch (err: any) {
      console.error("[v0] Registration failed:", err)

      if (err.message === "Network Error" || err.code === "ECONNABORTED") {
        setError("No es pot connectar amb el servidor. Assegura't que el backend està corrent")
      } else if (err.response?.status === 409 || err.response?.data?.message?.includes("already exists")) {
        setError("Aquest nom d'usuari ja existeix. Prova amb un altre nom.")
      } else if (err.response?.status === 400) {
        setError(
          err.response?.data?.message || "Dades invàlides. Comprova que el nom i contrasenya compleixin els requisits.",
        )
      } else {
        setError(err.response?.data?.message || "Error en registrar-se. Si us plau, torna-ho a intentar.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="mb-2 font-serif text-3xl font-bold text-foreground">Registrar-se</h1>
          <p className="text-muted-foreground">Crea un compte per començar a explorar la fauna catalana</p>
        </div>

        <div className="rounded-lg border border-border bg-background p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <CharacterSelector selected={selectedCharacter} onSelect={setSelectedCharacter} />

            <div className="space-y-2">
              <Label htmlFor="name">Nom d'usuari</Label>
              <Input
                id="name"
                type="text"
                placeholder="Escull un nom d'usuari"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                minLength={2}
                maxLength={50}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contrasenya</Label>
              <Input
                id="password"
                type="password"
                placeholder="Escull una contrasenya (mínim 5 caràcters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={5}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirma la contrasenya</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Repeteix la contrasenya"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
              {isLoading ? "Registrant..." : "Registrar-se"}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            <span className="text-muted-foreground">Ja tens compte? </span>
            <Link href="/login" className="font-medium text-primary hover:underline">
              Inicia sessió
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
