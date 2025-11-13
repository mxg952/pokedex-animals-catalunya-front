"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ImageIcon, X } from "lucide-react"

interface PhotoUploadFormProps {
  onSubmit: (photo: File, description: string) => Promise<void>
  onCancel: () => void
}

export default function PhotoUploadForm({ onSubmit, onCancel }: PhotoUploadFormProps) {
  const [newPhoto, setNewPhoto] = useState<File | null>(null)
  const [newPhotoDescription, setNewPhotoDescription] = useState("")
  const [preview, setPreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)

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
    if (!newPhoto) return

    setIsUploading(true)
    try {
      await onSubmit(newPhoto, newPhotoDescription)
      setNewPhoto(null)
      setNewPhotoDescription("")
      setPreview(null)
    } catch (error) {
      console.error("[v0] Error uploading photo:", error)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="mt-4 rounded-lg border-2 border-primary/30 bg-primary/5 p-4">
      <div className="mb-3 flex items-center justify-between">
        <h4 className="font-semibold text-foreground">Nova foto</h4>
        <Button size="sm" variant="ghost" onClick={onCancel} className="h-6 w-6 p-0">
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-3">
        <div>
          <Label htmlFor="photo-upload" className="mb-2 block text-sm font-medium">
            Foto
          </Label>
          <div className="flex items-center gap-3">
            <Button asChild variant="outline" size="sm" className="cursor-pointer bg-transparent">
              <label htmlFor="photo-upload" className="cursor-pointer">
                <ImageIcon className="mr-2 h-4 w-4" />
                Selecciona foto
              </label>
            </Button>
            <input
              id="photo-upload"
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="hidden"
              disabled={isUploading}
            />
            {newPhoto && <span className="text-sm text-muted-foreground">{newPhoto.name}</span>}
          </div>
        </div>

        {preview && (
          <div className="overflow-hidden rounded-lg border-2 border-border">
            <img src={preview || "/placeholder.svg"} alt="Preview" className="h-40 w-full object-cover" />
          </div>
        )}

        <div>
          <Label htmlFor="photo-description" className="mb-2 block text-sm font-medium">
            Descripció (opcional)
          </Label>
          <Textarea
            id="photo-description"
            value={newPhotoDescription}
            onChange={(e) => setNewPhotoDescription(e.target.value)}
            placeholder="On vas fer la foto? Què estaves fent?"
            className="resize-none"
            rows={3}
            disabled={isUploading}
          />
        </div>

        <Button onClick={handleSubmit} disabled={!newPhoto || isUploading} className="w-full">
          {isUploading ? "Pujant..." : "Afegeix foto"}
        </Button>
      </div>
    </div>
  )
}
