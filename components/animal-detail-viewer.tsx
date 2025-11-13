"use client"

import { useState, useEffect } from "react"
import { apiClient } from "@/lib/api-client"
import type { Animal, AnimalPhoto } from "@/lib/types"
import AnimalInfoCard from "./animal-detail/animal-info-card"
import PhotoGallery from "./animal-detail/photo-gallery"

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
    <div className="space-y-4">
      <AnimalInfoCard animal={animal} isLocked={isLocked} onUnlock={onUnlock} />

      {!isLocked && (
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
  )
}
