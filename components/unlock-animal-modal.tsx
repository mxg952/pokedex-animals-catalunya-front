"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { X, Upload, AlertCircle } from "lucide-react"
import type { Animal } from "@/lib/types"

interface UnlockAnimalModalProps {
  animal: Animal
  onClose: () => void
  onSubmit: (commonName: string, photo: File, description?: string) => Promise<void>
}

export default function UnlockAnimalModal({ animal, onClose, onSubmit }: UnlockAnimalModalProps) {
  const [commonName, setCommonName] = useState("")
  const [photo, setPhoto] = useState<File | null>(null)
  const [description, setDescription] = useState("")
  const [preview, setPreview] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPhoto(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!commonName.trim()) {
      setError("Si us plau, introdueix el nom de l'animal")
      return
    }

    if (!photo) {
      setError("Si us plau, puja una foto de l'animal")
      return
    }

    setIsLoading(true)
    try {
      await onSubmit(commonName, photo, description)
      onClose()
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al desbloquejar l'animal")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-lg border border-border bg-background p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-serif text-2xl font-bold text-foreground">Desbloqueja {animal.commonName}</h2>
          <button onClick={onClose} className="rounded-full p-1 hover:bg-muted" aria-label="Tancar">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="commonName">Nom comú de l'animal</Label>
            <Input
              id="commonName"
              type="text"
              placeholder="Ex: Linx ibèric"
              value={commonName}
              onChange={(e) => setCommonName(e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">Escriu el nom de l'animal per confirmar</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="photo">Foto de l'animal</Label>
            <div className="relative">
              <input id="photo" type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
              <label
                htmlFor="photo"
                className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/20 p-6 transition-colors hover:bg-muted/30"
              >
                {preview ? (
                  <img src={preview || "/placeholder.svg"} alt="Preview" className="h-32 w-32 rounded object-cover" />
                ) : (
                  <>
                    <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Clica per pujar una foto</span>
                  </>
                )}
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripció (opcional)</Label>
            <Textarea
              id="description"
              placeholder="Afegeix una descripció de la foto..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          {error && (
            <div className="flex items-start gap-2 rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Cancel·lar
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? "Desbloquejant..." : "Desbloquejar"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
