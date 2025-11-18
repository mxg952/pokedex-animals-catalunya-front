"use client"

import { useState, useEffect } from "react"
import { apiClient } from "@/lib/api-client"
import type { Animal, AnimalPhoto } from "@/lib/types"
import AnimalInfoCard from "./animal-detail/animal-info-card"
import PhotoGallery from "./animal-detail/photo-gallery"
import { Lock } from "lucide-react" // ✅ Importem icona de bloqueig
import MapCard from '@/components/animal-detail/mapa-location'
import MapComponent from "@/components/animal-detail/mapa-location"



interface AnimalDetailViewerProps {
  animal: Animal | null
  userAnimals: any[]
  onUnlock: () => void
  onRefresh: () => void
}

export default function AnimalDetailViewer({ animal, userAnimals, onUnlock, onRefresh }: AnimalDetailViewerProps) {
  const [photos, setPhotos] = useState<AnimalPhoto[]>([])

  const isLocked = animal ? !userAnimals.some((ua) => ua.animalId === animal.id && ua.status === "UNLOCK") : true

  useEffect(() => {
    if (animal && !isLocked) {
      fetchPhotos()
    } else {
      setPhotos([])
    }
  }, [animal, isLocked])

  const fetchPhotos = async () => {
    if (!animal || isLocked) return

    try {
      const userAnimal = userAnimals.find((ua) => ua.animalId === animal.id && ua.status === "UNLOCK")
      if (!userAnimal) {
        console.log("[v0] No unlocked userAnimal found for animal", animal.id)
        return
      }

      // ✅ FORÇA una nova càrrega de les dades actualitzades
      const response = await apiClient.get(`/api/user-animals/get`)
      const updatedUserAnimals = response.data
      
      // ✅ TROBA el userAnimal actualitzat
      const updatedUserAnimal = updatedUserAnimals.find((ua: any) => 
        ua.animalId === animal.id && ua.status === "UNLOCK"
      )
      
      if (updatedUserAnimal) {
        const userAnimalPhotos = updatedUserAnimal.photos || []
        console.log("[v0] Photos actualitzades:", userAnimalPhotos)
        setPhotos(userAnimalPhotos)
      }
    } catch (error) {
      console.error("[v0] Error fetching photos:", error)
      setPhotos([])
    }
  }

  const handleAddPhoto = async (photo: File, description: string) => {
    if (!animal) return

    const userAnimal = userAnimals.find((ua) => ua.animalId === animal.id && ua.unlocked === true)
    if (!userAnimal) {
      console.error("[v0] No unlocked userAnimal found")
      return
    }

    const formData = new FormData()
    formData.append("file", photo)
    if (description) {
      formData.append("description", description)
    }

    await apiClient.post(`/api/user-animals/${animal.id}/photos`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })

    await fetchPhotos()
    onRefresh()
  }

  const handleDownloadPhoto = async (photoId: number) => {
    try {
      const response = await apiClient.get(`/api/user-animals/${photoId}/download`, {
        responseType: "blob",
      })

      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", `animal-photo-${photoId}.jpg`)
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (error) {
      console.error("[v0] Error downloading photo:", error)
    }
  }

  const handleDeletePhoto = async (photoId: number) => {
    try {
      await apiClient.delete(`/api/user-animals/photos/${photoId}`)
      await fetchPhotos()
      onRefresh()
    } catch (error) {
      console.error("[v0] Error deleting photo:", error)
    }
  }

  if (!animal) {
    return (
      <div className="flex h-full items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/20 p-8">
        <div className="text-center">
          <div className="mb-3 text-4xl">🔍</div>
          <p className="text-muted-foreground">Selecciona un animal per veure els detalls</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full space-y-4">
      {/* ✅ GRID PRINCIPAL - 2 columnes */}
      <div className="grid grid-cols-2 gap-4 h-[calc(100%-60px)]">
        
        {/* ✅ COLUMNA ESQUERRA */}
        <div className="space-y-4">
          {/* INFORMACIÓ DE L'ANIMAL */}
          <div className="rounded-xl border-2 border-secondary/20 bg-gradient-to-br from-background to-secondary/5 p-4">
            <AnimalInfoCard animal={animal} isLocked={isLocked} onUnlock={onUnlock} />
          </div>
        </div>

        {/* ✅ COLUMNA DRETA */}
        
        <div className="space-y-4">

          <MapComponent animal={animal} isLocked={isLocked} />
          {/* ✅ ALBUM DE FOTOS - SEMPRE VISIBLE */}
          <div className={`rounded-xl border-2 ${isLocked ? 'border-destructive/20 bg-destructive/5' : 'border-secondary/20 bg-gradient-to-br from-background to-secondary/5'} p-4`}>
            
            {/* ✅ TÍTOL AMB ICONA DE BLOQUEIG SI CAL */}
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-serif text-xl font-bold text-foreground">Les meves fotos</h3>
              {isLocked && (
                <div className="flex items-center gap-2 text-destructive">
                  <Lock className="h-5 w-5" />
                  <span className="text-sm font-medium">Bloquejat</span>
                </div>
              )}
            </div>

            {isLocked ? (
              /* ✅ ESTAT BLOQUEJAT - ÀLBUM NO DISPONIBLE */
              <div className="rounded-lg border-2 border-dashed border-destructive/30 bg-destructive/10 p-8 text-center">
                <div className="mb-4 flex justify-center">
                  <div className="rounded-full bg-destructive/20 p-4">
                    <Lock className="h-8 w-8 text-destructive" />
                  </div>
                </div>
                <h4 className="mb-2 text-lg font-semibold text-destructive">Àlbum bloquejat</h4>
                <p className="text-sm text-destructive/80 mb-4">
                  Desbloqueja aquest animal per poder afegir les teves fotos a l'àlbum
                </p>
                <button
                  onClick={onUnlock}
                  className="inline-flex items-center gap-2 rounded-lg bg-destructive px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-destructive/80"
                >  <Lock className="mr-2 h-4 w-4" />
                  Desbloqueja l'animal
                </button>
              </div>
            ) : (
              /* ✅ ESTAT DESBLOQUEJAT - ÀLBUM NORMAL */
              <PhotoGallery
                photos={photos}
                onAddPhoto={handleAddPhoto}
                onDownloadPhoto={handleDownloadPhoto}
                onDeletePhoto={handleDeletePhoto}
                onRefresh={onRefresh}
                fetchPhotos={fetchPhotos}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}