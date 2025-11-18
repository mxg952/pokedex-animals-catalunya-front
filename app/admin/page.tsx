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
import { 
  Users, 
  PlusCircle, 
  Calendar, 
  Image, 
  Unlock, 
  Mail,
  User,
  Camera,
  Zap,
  Trophy,
  Activity,
  Search
} from 'lucide-react'
import type { UserInfo, CreateAnimalRequest } from "@/lib/types"

// Defineix una interfície per a les dades reals que reps de l'API
interface ApiUserInfo {
  id: number
  name: string
  email?: string
  createdAt: string | null
  unlockedAnimals: number
  uploadedPhotos: number
  lastActivity?: string
  role?: string
}

export default function AdminDashboard() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [users, setUsers] = useState<ApiUserInfo[]>([])
  const [filteredUsers, setFilteredUsers] = useState<ApiUserInfo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [newAnimal, setNewAnimal] = useState<CreateAnimalRequest>({
    commonName: "",
    scientificName: "",
    category: "",
    shortDescription: "",
    locationDescription: "",
    visibilityProbability: "",
    sightingMonths: "",
    mapUrl: "",
    photoLockFileName: "",
    photoUnlockFileName: "",
  })
  const [lockedImage, setLockedImage] = useState<File | null>(null)
  const [unlockedImage, setUnlockedImage] = useState<File | null>(null)
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

  useEffect(() => {
    // Filtrar usuarios basado en el término de búsqueda
    const filtered = users.filter(user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredUsers(filtered)
  }, [users, searchTerm])

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
      
      // Campos de texto
      formData.append('commonName', newAnimal.commonName)
      formData.append('scientificName', newAnimal.scientificName)
      formData.append('category', newAnimal.category)
      formData.append('shortDescription', newAnimal.shortDescription || '')
      formData.append('locationDescription', newAnimal.locationDescription || '')
      formData.append('visibilityProbability', newAnimal.visibilityProbability?.toString() || 'Mitjana')
      formData.append('mapUrl', newAnimal.mapUrl || '')
      formData.append('photoLockFileName', newAnimal.photoLockFileName || '')

      
      // Convertir sightingMonths de string a array
      if (newAnimal.sightingMonths) {
        const monthsArray = newAnimal.sightingMonths
          .split(',')
          .map(month => month.trim())
          .filter(month => month.length > 0)
        
        monthsArray.forEach(month => {
          formData.append('sightingMonths', month)
        })
      }

      // Imágenes
      if (lockedImage) {
        formData.append('lockedImage', lockedImage)
      }
      if (unlockedImage) {
        formData.append('unlockedImage', unlockedImage)
      }

      const response = await adminApi.createAnimal(formData)
      
      // Reset form
      setNewAnimal({ 
        commonName: "", 
        scientificName: "", 
        category: "", 
        shortDescription: "",
        locationDescription: "",
        visibilityProbability: "",
        sightingMonths: "",
        mapUrl: "",
        photoLockFileName: "",
        photoUnlockFileName: ""
      })
      setLockedImage(null)
      setUnlockedImage(null)
      
      alert("Animal creat correctament!")
    } catch (error: any) {
      console.error("Error detallat:", error)
      alert(`Error al crear l'animal: ${error.response?.data?.message || error.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "No disponible"
    return new Date(dateString).toLocaleDateString("ca-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return "No disponible"
    return new Date(dateString).toLocaleDateString("ca-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getUserLevel = (unlockedAnimals: number, uploadedPhotos: number) => {
    const score = unlockedAnimals * 2 + uploadedPhotos
    if (score >= 20) return { level: "Expert", color: "bg-purple-100 text-purple-800 border-purple-300" }
    if (score >= 10) return { level: "Intermedi", color: "bg-blue-100 text-blue-800 border-blue-300" }
    return { level: "Principiant", color: "bg-green-100 text-green-800 border-green-300" }
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
              Usuaris ({users.length})
            </TabsTrigger>
            <TabsTrigger value="animals" className="gap-2">
              <PlusCircle className="h-4 w-4" />
              Afegir Animal
            </TabsTrigger>
          </TabsList>

          {/* Users Tab - NUEVA VERSIÓN MEJORADA */}
          <TabsContent value="users" className="space-y-6">
            <Card className="border-border bg-gradient-to-b from-card to-muted/5">
              <div className="p-6">
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    <h2 className="font-serif text-xl font-bold text-foreground">
                      Llistat d'Usuaris Registrats
                    </h2>
                  </div>
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
                    <Input
                      placeholder="Cercar per nom..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Stats Overview */}
                <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                  <Card className="bg-gradient-to-br from-blue-50 to-blue-100 p-4">
                    <div className="flex items-center gap-3">
                      <Users className="h-8 w-8 text-blue-600" />
                      <div>
                        <p className="text-sm font-medium text-blue-900">Total Usuaris</p>
                        <p className="text-2xl font-bold text-blue-700">{users.length}</p>
                      </div>
                    </div>
                  </Card>
                  
                  <Card className="bg-gradient-to-br from-green-50 to-green-100 p-4">
                    <div className="flex items-center gap-3">
                      <Unlock className="h-8 w-8 text-green-600" />
                      <div>
                        <p className="text-sm font-medium text-green-900">Animals Desbloquejats</p>
                        <p className="text-2xl font-bold text-green-700">
                          {users.reduce((sum, user) => sum + user.unlockedAnimals, 0)}
                        </p>
                      </div>
                    </div>
                  </Card>
                  
                  <Card className="bg-gradient-to-br from-orange-50 to-orange-100 p-4">
                    <div className="flex items-center gap-3">
                      <Camera className="h-8 w-8 text-orange-600" />
                      <div>
                        <p className="text-sm font-medium text-orange-900">Fotos Pujades</p>
                        <p className="text-2xl font-bold text-orange-700">
                          {users.reduce((sum, user) => sum + user.uploadedPhotos, 0)}
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>

                <div className="space-y-4">
                  {filteredUsers.map((userInfo) => {
                    const userLevel = getUserLevel(userInfo.unlockedAnimals, userInfo.uploadedPhotos)
                    return (
                      <Card
                        key={userInfo.id}
                        className="border-border bg-background transition-all hover:shadow-lg hover:border-primary/20"
                      >
                        <div className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="mb-4 flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/70">
                                    <User className="h-6 w-6 text-white" />
                                  </div>
                                  <div>
                                    <h3 className="text-lg font-semibold text-foreground">
                                      {userInfo.name}
                                    </h3>
                                    {userInfo.email && (
                                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Mail className="h-3 w-3" />
                                        {userInfo.email}
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                  <Badge variant="outline" className={userLevel.color}>
                                    <Trophy className="mr-1 h-3 w-3" />
                                    {userLevel.level}
                                  </Badge>
                                  <Badge variant="secondary" className="text-xs">
                                    ID: {userInfo.id}
                                  </Badge>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                <div className="flex items-center gap-3 rounded-lg bg-muted/30 p-3">
                                  <Calendar className="h-5 w-5 text-muted-foreground" />
                                  <div>
                                    <p className="text-xs text-muted-foreground">Data de Registre</p>
                                    <p className="font-medium text-foreground">{formatDate(userInfo.createdAt)}</p>
                                  </div>
                                </div>

                                <div className="flex items-center gap-3 rounded-lg bg-blue-50 p-3">
                                  <Unlock className="h-5 w-5 text-blue-600" />
                                  <div>
                                    <p className="text-xs text-blue-600">Animals Desbloquejats</p>
                                    <p className="font-bold text-blue-700">{userInfo.unlockedAnimals}</p>
                                  </div>
                                </div>

                                <div className="flex items-center gap-3 rounded-lg bg-orange-50 p-3">
                                  <Camera className="h-5 w-5 text-orange-600" />
                                  <div>
                                    <p className="text-xs text-orange-600">Fotos Pujades</p>
                                    <p className="font-bold text-orange-700">{userInfo.uploadedPhotos}</p>
                                  </div>
                                </div>

                                
                              </div>

                              {userInfo.lastActivity && (
                                <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                                  <Activity className="h-3 w-3" />
                                  <span>Última activitat: {formatDateTime(userInfo.lastActivity)}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </Card>
                    )
                  })}

                  {filteredUsers.length === 0 && (
                    <div className="py-16 text-center">
                      <Users className="mx-auto h-12 w-12 text-muted-foreground/50" />
                      <p className="mt-4 text-muted-foreground">
                        {searchTerm ? "No s'han trobat usuaris amb aquest criteri" : "No hi ha usuaris registrats"}
                      </p>
                      {searchTerm && (
                        <Button 
                          variant="outline" 
                          onClick={() => setSearchTerm("")}
                          className="mt-4"
                        >
                          Netejar cerca
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </TabsContent>

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
            rows={3}
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
            rows={3}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="visibilityProbability">
              Probabilitat de visibilitat
            </Label>
            <Input
              id="visibilityProbability"
              placeholder="Mitjana"
              value={newAnimal.visibilityProbability}
              onChange={(e) =>
                setNewAnimal({ ...newAnimal, visibilityProbability: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sightingMonths">Mesos d'observació</Label>
            
            {/* Selector de meses con checkboxes */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 p-3 border rounded-md bg-muted/20">
              {[
                'Gener', 'Febrer', 'Març', 'Abril', 'Maig', 'Juny',
                'Juliol', 'Agost', 'Setembre', 'Octubre', 'Novembre', 'Desembre'
              ].map(month => (
                <div key={month} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`month-${month}`}
                    checked={newAnimal.sightingMonths?.includes(month) || false}
                    onChange={(e) => {
                      const currentMonths = newAnimal.sightingMonths 
                        ? newAnimal.sightingMonths.split(',').filter(m => m.trim())
                        : [];
                      
                      if (e.target.checked) {
                        if (!currentMonths.includes(month)) {
                          currentMonths.push(month);
                        }
                      } else {
                        const index = currentMonths.indexOf(month);
                        if (index > -1) currentMonths.splice(index, 1);
                      }
                      
                      setNewAnimal({
                        ...newAnimal,
                        sightingMonths: currentMonths.join(',')
                      });
                    }}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <Label 
                    htmlFor={`month-${month}`} 
                    className="text-sm font-normal cursor-pointer"
                  >
                    {month}
                  </Label>
                </div>
              ))}
            </div>
            
            {/* Mostrar meses seleccionados */}
            {newAnimal.sightingMonths && (
              <div className="text-xs text-muted-foreground mt-2">
                <strong>Mesos seleccionats:</strong> {newAnimal.sightingMonths}
              </div>
            )}
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

        {/* ✅ SECCIÓN MODIFICADA - AHORA CON DOS CAMPOS DE ARCHIVO */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="lockedImage">
              Imatge bloquejada <span className="text-muted-foreground">(obligatoria)</span>
            </Label>
            <Input
              id="lockedImage"
              type="file"
              accept="image/*"
              onChange={(e) => setLockedImage(e.target.files?.[0] || null)}
              required
            />
            {lockedImage && (
              <p className="text-xs text-muted-foreground">
                Fitxer seleccionat: {lockedImage.name}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="unlockedImage">Imatge desbloquejada</Label>
            <Input
              id="unlockedImage"
              type="file"
              accept="image/*"
              onChange={(e) => setUnlockedImage(e.target.files?.[0] || null)}
            />
            {unlockedImage && (
              <p className="text-xs text-muted-foreground">
                Fitxer seleccionat: {unlockedImage.name}
              </p>
            )}
          </div>
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

    
      </div>
    </div>
  )
}