"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, Trash2, Eye, X, Upload, Edit } from "lucide-react"
import type { AnimalPhoto } from "@/lib/types"
import PhotoUploadForm from "./photo-upload-form"
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal"
import PhotoEditForm from "@/components/photo-edit-form"
import { apiClient } from "@/lib/api-client"

interface PhotoGalleryProps {
  photos: AnimalPhoto[]
  onAddPhoto: (photo: File, description: string) => Promise<void>
  onDownloadPhoto: (photoId: number) => void
  onDeletePhoto: (photoId: number) => void
  onRefresh: () => void
  fetchPhotos: () => Promise<void>
}

export default function PhotoGallery({ 
  photos, 
  onAddPhoto, 
  onDownloadPhoto, 
  onDeletePhoto, 
  onRefresh,
  fetchPhotos 
}: PhotoGalleryProps) {
  const [showAddPhotoForm, setShowAddPhotoForm] = useState(false)
  const [selectedPhotoForView, setSelectedPhotoForView] = useState<AnimalPhoto | null>(null)
  const [photoToDelete, setPhotoToDelete] = useState<AnimalPhoto | null>(null)
  const [photoToEdit, setPhotoToEdit] = useState<AnimalPhoto | null>(null)

  const handleDeleteClick = (photo: AnimalPhoto) => {
    setPhotoToDelete(photo)
  }

  const handleConfirmDelete = async () => {
    if (photoToDelete) {
      await onDeletePhoto(photoToDelete.id)
      setPhotoToDelete(null)
    }
  }

  const handleSavePhoto = async (file: File | null, description: string) => {
    if (!photoToEdit) return

    const formData = new FormData()
    if (file) {
      formData.append("file", file)
    }
    if (description !== photoToEdit.description) {
      formData.append("description", description)
    }

    try {
      await apiClient.put(`/api/user-animals/photos/${photoToEdit.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      
      // Actualitza la llista de fotos
      await fetchPhotos()
      onRefresh()
      setPhotoToEdit(null)
    } catch (error) {
      console.error("[v0] Error updating photo:", error)
    }
  }

  return (
    <>
      <div className="rounded-xl border-2 border-secondary/20 bg-gradient-to-br from-background to-secondary/5 p-6 shadow-lg pokedex-card">
        {photos.length === 0 ? (
          <div className="rounded-lg border-2 border-dashed border-border bg-muted/20 p-8 text-center">
            <div className="mb-2 text-3xl">📸</div>
            <p className="mb-4 text-sm text-muted-foreground">Encara no has afegit cap foto</p>
            <Button onClick={() => setShowAddPhotoForm(true)} variant="outline" size="sm">
              <Upload className="mr-2 h-4 w-4" />
              Afegeix la primera foto
            </Button>
          </div>
        ) : (
          <>
            <div className="mb-4 grid grid-cols-2 gap-3">
              {photos.map((photo) => (
                <div
                  key={photo.id}
                  className="group relative overflow-hidden rounded-lg border-2 border-border shadow-md"
                >
                  <img
                    src={`http://localhost:8080/api/images/user-animals/${photo.fileName}`}
                    alt={photo.description || "Animal photo"}
                    className="aspect-square w-full object-cover"
                  />
                  
                  {/* Descripció a la miniatura */}
                  {photo.description && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-2">
                      <p className="text-xs text-white line-clamp-2">{photo.description}</p>
                    </div>
                  )}
                  
                  <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => setSelectedPhotoForView(photo)}
                      className="h-8 w-8 p-0"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => setPhotoToEdit(photo)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => onDownloadPhoto(photo.id)}
                      className="h-8 w-8 p-0"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteClick(photo)}
                      className="h-8 w-8 p-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <Button onClick={() => setShowAddPhotoForm(true)} variant="outline" className="w-full">
              <Upload className="mr-2 h-4 w-4" />
              Afegeix més fotos
            </Button>
          </>
        )}

        {showAddPhotoForm && (
          <PhotoUploadForm
            onSubmit={async (photo, description) => {
              await onAddPhoto(photo, description)
              setShowAddPhotoForm(false)
            }}
            onCancel={() => setShowAddPhotoForm(false)}
          />
        )}
      </div>

      {/* Modal de visualització */}
      {selectedPhotoForView && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setSelectedPhotoForView(null)}
        >
          <div className="relative max-h-[90vh] max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <Button
              size="sm"
              variant="secondary"
              className="absolute -right-2 -top-2 h-8 w-8 rounded-full p-0 z-10"
              onClick={() => setSelectedPhotoForView(null)}
            >
              <X className="h-4 w-4" />
            </Button>
            
            <div className="rounded-lg bg-background shadow-2xl">
              <img
                src={`http://localhost:8080/api/images/user-animals/${selectedPhotoForView.fileName}`}
                alt={selectedPhotoForView.description || "Animal photo"}
                className="max-h-[80vh] rounded-t-lg object-contain w-full"
              />
              
              {/* Descripció al modal */}
              {selectedPhotoForView.description && (
                <div className="p-4 border-t">
                  <div className="flex items-start gap-2">
                    <div className="mt-0.5">
                      <span className="text-lg">📝</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground mb-1">Descripció:</p>
                      <p className="text-sm text-muted-foreground">{selectedPhotoForView.description}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal d'eliminació */}
      <DeleteConfirmationModal
        isOpen={!!photoToDelete}
        onClose={() => setPhotoToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Eliminar foto"
        message="Estàs segur que vols eliminar aquesta foto? Aquesta acció no es pot desfer."
        confirmText="Eliminar"
        cancelText="Cancel·lar"
      />

      {/* Modal d'edició */}
      {photoToEdit && (
        <PhotoEditForm
          photo={photoToEdit}
          onSave={handleSavePhoto}
          onCancel={() => setPhotoToEdit(null)}
        />
      )}
    </>
  )
}