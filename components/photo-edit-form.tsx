// Crea un nou arxiu: photo-edit-form.tsx
"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ImageIcon, X, Save, Edit } from "lucide-react"

interface PhotoEditFormProps {
  photo: any
  onSave: (file: File | null, description: string) => Promise<void>
  onCancel: () => void
}

export default function PhotoEditForm({ photo, onSave, onCancel }: PhotoEditFormProps) {
  const [newDescription, setNewDescription] = useState(photo.description || "")
  const [newPhoto, setNewPhoto] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setNewPhoto(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async () => {
    setIsSaving(true)
    try {
      await onSave(newPhoto, newDescription)
    } catch (error) {
      console.error("[v0] Error updating photo:", error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="w-full max-w-md rounded-2xl bg-background p-6 shadow-2xl border-2 border-primary/20">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Editar Foto
          </h3>
          <Button size="sm" variant="ghost" onClick={onCancel} className="h-8 w-8 rounded-full p-0">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-4">
          {/* Vista prèvia actual */}
          <div>
            <Label className="mb-2 block text-sm font-medium">Foto actual</Label>
            <img
              src={preview || `http://localhost:8080/api/images/user-animals/${photo.fileName}`}
              alt={photo.description || "Animal photo"}
              className="h-32 w-full object-cover rounded-lg border-2 border-border"
            />
          </div>

          {/* Nou arxiu */}
          <div>
            <Label htmlFor="edit-photo-upload" className="mb-2 block text-sm font-medium">
              Canviar foto (opcional)
            </Label>
            <div className="flex items-center gap-3">
              <Button asChild variant="outline" size="sm" className="cursor-pointer bg-transparent">
                <label htmlFor="edit-photo-upload" className="cursor-pointer">
                  <ImageIcon className="mr-2 h-4 w-4" />
                  Nova foto
                </label>
              </Button>
              <input
                id="edit-photo-upload"
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
                disabled={isSaving}
              />
              {newPhoto && <span className="text-sm text-muted-foreground">{newPhoto.name}</span>}
            </div>
          </div>

          {/* Descripció */}
          <div>
            <Label htmlFor="edit-description" className="mb-2 block text-sm font-medium">
              Descripció
            </Label>
            <Textarea
              id="edit-description"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="Descriu aquesta foto..."
              className="resize-none"
              rows={3}
              disabled={isSaving}
            />
          </div>

          {/* Accions */}
          <div className="flex gap-3">
            <Button variant="outline" onClick={onCancel} className="flex-1" disabled={isSaving}>
              Cancel·lar
            </Button>
            <Button onClick={handleSubmit} disabled={isSaving} className="flex-1">
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? "Guardant..." : "Guardar"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}