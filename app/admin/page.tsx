"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from 'next/navigation'
import { adminApi } from "@/lib/api-client"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Users, PlusCircle, Calendar, Image, Unlock } from 'lucide-react'
import type { UserInfo, CreateAnimalRequest } from "@/lib/types"

// Defineix una interfície per a les dades reals que reps de l'API
interface ApiUserInfo {
  id: number
  name: string
  createdAt: string | null
  unlockedAnimals: number
  uploadedPhotos: number
}

export default function AdminDashboard() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [users, setUsers] = useState<ApiUserInfo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [newAnimal, setNewAnimal] = useState<CreateAnimalRequest>({
    commonName: "",
    scientificName: "",
    category: "",
    shortDescription: "",
    locationDescription: "",
    visibilityProbability: 0.5, // valor per defecte
    sightingMonths: "",
    mapUrl: "",
    photoLockFileName: "",
    photoUnlockFileName: "",
  })
  const [animalImage, setAnimalImage] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "ADMIN_ROLE")) {
      router.push("/")
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (user?.role === "ADMIN_ROLE") {
      fetchUsers()
    }
  }, [user])

  const fetchUsers = async () => {
    try {
      const response = await adminApi.getAllUsers()
      setUsers(response.data)
    } catch (error) {
      console.error("Error fetching users:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateAnimal = async (e: React.FormEvent) => {
  e.preventDefault()
  
  if (!newAnimal.commonName || !newAnimal.scientificName || !newAnimal.category) {
    alert("Si us plau, omple tots els camps obligatoris")
    return
  }

  setIsSubmitting(true)

  try {
    const formData = new FormData()
    
    // Debug: mostra els valors que s'envien
    console.log('Valors del formulari:', newAnimal)
    console.log('Imatge:', animalImage)
    
    // Afegeix les dades text
    formData.append('commonName', newAnimal.commonName)
    formData.append('scientificName', newAnimal.scientificName)
    formData.append('category', newAnimal.category)
    
    if (newAnimal.description) {
      formData.append('description', newAnimal.description)
    }
    
    
    if (animalImage) {
      formData.append('image', animalImage)
    } 

    // Debug: mostra el contingut del FormData
    for (let [key, value] of formData.entries()) {
      console.log(`FormData: ${key} =`, value)
    }

    const response = await adminApi.createAnimal(formData)
    console.log('Resposta del servidor:', response)
    
    // Reset form
    setNewAnimal({ 
      commonName: "", 
      scientificName: "", 
      category: "", 
      description: "" 
    })
    setAnimalImage(null)
    
    alert("Animal creat correctament!")
  } catch (error: any) {
    console.error("Error detallat:", error)
    if (error.response) {
      console.error("Dades de l'error:", error.response.data)
      console.error("Estat de l'error:", error.response.status)
      console.error("Capçaleres de l'error:", error.response.headers)
    }
    alert(`Error al crear l'animal: ${error.response?.data?.message || error.message}`)
  } finally {
    setIsSubmitting(false)
  }
}

  const formatDate = (dateString: string | null) => {
    if (!dateString) {
      return "01/01/1970" // Valor per defecte per a dates null
    }
    return new Date(dateString).toLocaleDateString("ca-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  if (authLoading || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-muted/10 to-background">
        <p className="text-muted-foreground">Carregant...</p>
      </div>
    )
  }

  if (!user || user.role !== "ADMIN_ROLE") {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/10 to-background">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 font-serif text-3xl font-bold text-foreground">
            Panell d'Administrador
          </h1>
          <p className="text-sm text-muted-foreground">
            Gestiona usuaris i animals del sistema
          </p>
        </div>

        <Tabs defaultValue="users" className="w-full">
          <TabsList className="mb-6 grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="users" className="gap-2">
              <Users className="h-4 w-4" />
              Usuaris
            </TabsTrigger>
            <TabsTrigger value="animals" className="gap-2">
              <PlusCircle className="h-4 w-4" />
              Afegir Animal
            </TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-4">
            <Card className="border-border bg-gradient-to-b from-card to-muted/5">
              <div className="p-6">
                <div className="mb-4 flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  <h2 className="font-serif text-xl font-bold text-foreground">
                    Llistat d'Usuaris Registrats
                  </h2>
                </div>
                <p className="mb-6 text-sm text-muted-foreground">
                  Total d'usuaris: {users.length}
                </p>

                <div className="space-y-3">
                  {users.map((userInfo) => (
                    <Card
                      key={userInfo.id}
                      className="border-border bg-background transition-all hover:shadow-md"
                    >
                      <div className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="mb-2 flex items-center gap-3">
                              <h3 className="font-semibold text-foreground">
                                {userInfo.name} {/* Canviat de username a name */}
                              </h3>
                              {/* Si tens dades de rol a l'API, afegir aquí, sinó eliminar el Badge */}
                              {/* <Badge variant="outline" className="text-xs">
                                {userInfo.role === "ADMIN_ROLE" ? "Admin" : "Usuari"}
                              </Badge> */}
                            </div>

                            <div className="grid grid-cols-1 gap-2 text-sm md:grid-cols-3">
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                <span>Registre: {formatDate(userInfo.createdAt)}</span>
                              </div>
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Unlock className="h-4 w-4" />
                                <span>Animals: {userInfo.unlockedAnimals}</span> {/* Canviat de unlockedAnimalsCount a unlockedAnimals */}
                              </div>
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Image className="h-4 w-4" />
                                <span>Fotos: {userInfo.uploadedPhotos}</span> {/* Canviat de uploadedPhotosCount a uploadedPhotos */}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}

                  {users.length === 0 && (
                    <div className="py-12 text-center">
                      <p className="text-muted-foreground">No hi ha usuaris registrats</p>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Animals Tab */}
          <TabsContent value="animals">
            <Card className="border-border bg-gradient-to-b from-card to-muted/5">
              <div className="p-6">
                <div className="mb-4 flex items-center gap-2">
                  <PlusCircle className="h-5 w-5 text-primary" />
                  <h2 className="font-serif text-xl font-bold text-foreground">
                    Afegir Nou Animal
                  </h2>
                </div>
                <p className="mb-6 text-sm text-muted-foreground">
                  Omple els camps per afegir un nou animal a la base de dades
                </p>

                <form onSubmit={handleCreateAnimal} className="space-y-4">
  <div className="grid gap-4 md:grid-cols-2">
    <div className="space-y-2">
      <Label htmlFor="commonName">
        Nom comú <span className="text-destructive">*</span>
      </Label>
      <Input
        id="commonName"
        placeholder="Ex: Llop ibèric"
        value={newAnimal.commonName}
        onChange={(e) =>
          setNewAnimal({ ...newAnimal, commonName: e.target.value })
        }
        required
      />
    </div>

    <div className="space-y-2">
      <Label htmlFor="scientificName">
        Nom científic <span className="text-destructive">*</span>
      </Label>
      <Input
        id="scientificName"
        placeholder="Ex: Canis lupus signatus"
        value={newAnimal.scientificName}
        onChange={(e) =>
          setNewAnimal({ ...newAnimal, scientificName: e.target.value })
        }
        required
      />
    </div>
  </div>

  <div className="space-y-2">
    <Label htmlFor="category">
      Categoria <span className="text-destructive">*</span>
    </Label>
    <Input
      id="category"
      placeholder="Ex: Mamífers"
      value={newAnimal.category}
      onChange={(e) =>
        setNewAnimal({ ...newAnimal, category: e.target.value })
      }
      required
    />
  </div>

  <div className="space-y-2">
    <Label htmlFor="shortDescription">Descripció curta</Label>
    <Textarea
      id="shortDescription"
      placeholder="Descripció curta de l'animal..."
      value={newAnimal.shortDescription}
      onChange={(e) =>
        setNewAnimal({ ...newAnimal, shortDescription: e.target.value })
      }
      rows={2}
    />
  </div>

  <div className="space-y-2">
    <Label htmlFor="locationDescription">Descripció de la ubicació</Label>
    <Textarea
      id="locationDescription"
      placeholder="On es pot trobar aquest animal..."
      value={newAnimal.locationDescription}
      onChange={(e) =>
        setNewAnimal({ ...newAnimal, locationDescription: e.target.value })
      }
      rows={2}
    />
  </div>

  <div className="grid gap-4 md:grid-cols-2">
    <div className="space-y-2">
      <Label htmlFor="visibilityProbability">
        Probabilitat de visibilitat (0-1)
      </Label>
      <Input
        id="visibilityProbability"
        type="number"
        min="0"
        max="1"
        step="0.1"
        placeholder="0.5"
        value={newAnimal.visibilityProbability}
        onChange={(e) =>
          setNewAnimal({ ...newAnimal, visibilityProbability: parseFloat(e.target.value) })
        }
      />
    </div>

    <div className="space-y-2">
      <Label htmlFor="sightingMonths">Mesos d'observació</Label>
      <Input
        id="sightingMonths"
        placeholder="Ex: Gener,Febrer,Març"
        value={newAnimal.sightingMonths}
        onChange={(e) =>
          setNewAnimal({ ...newAnimal, sightingMonths: e.target.value })
        }
      />
    </div>
  </div>

  <div className="space-y-2">
    <Label htmlFor="mapUrl">URL del mapa</Label>
    <Input
      id="mapUrl"
      placeholder="https://..."
      value={newAnimal.mapUrl}
      onChange={(e) =>
        setNewAnimal({ ...newAnimal, mapUrl: e.target.value })
      }
    />
  </div>

  <div className="grid gap-4 md:grid-cols-2">
    <div className="space-y-2">
      <Label htmlFor="photoLockFileName">Nom del fitxer de la foto bloquejada</Label>
      <Input
        id="photoLockFileName"
        placeholder="animal_locked.jpg"
        value={newAnimal.photoLockFileName}
        onChange={(e) =>
          setNewAnimal({ ...newAnimal, photoLockFileName: e.target.value })
        }
      />
    </div>

    <div className="space-y-2">
      <Label htmlFor="photoUnlockFileName">Nom del fitxer de la foto desbloquejada</Label>
      <Input
        id="photoUnlockFileName"
        placeholder="animal_unlocked.jpg"
        value={newAnimal.photoUnlockFileName}
        onChange={(e) =>
          setNewAnimal({ ...newAnimal, photoUnlockFileName: e.target.value })
        }
      />
    </div>
  </div>

  <div className="space-y-2">
    <Label htmlFor="image">Imatge de l'animal (opcional)</Label>
    <Input
      id="image"
      type="file"
      accept="image/*"
      onChange={(e) => setAnimalImage(e.target.files?.[0] || null)}
    />
    {animalImage && (
      <p className="text-xs text-muted-foreground">
        Fitxer seleccionat: {animalImage.name}
      </p>
    )}
  </div>

  <div className="flex justify-end pt-4">
    <Button type="submit" disabled={isSubmitting} className="gap-2">
      <PlusCircle className="h-4 w-4" />
      {isSubmitting ? "Creant..." : "Crear Animal"}
    </Button>
  </div>
</form>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Back to Dashboard Button */}
        <div className="mt-8">
          <Button
            variant="outline"
            onClick={() => router.push("/")}
          >
            Tornar al Dashboard
          </Button>
        </div>
      </div>
    </div>
  )
}