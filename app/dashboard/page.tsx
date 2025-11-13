"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { apiClient } from "@/lib/api-client"
import UserSidebar from "@/components/dashboard/user-sidebar"
import SearchFilters from "@/components/dashboard/search-filters"
import AnimalList from "@/components/dashboard/animal-list"
import AnimalDetailViewer from "@/components/AnimalDetailViewerGrid"
import UnlockAnimalModal from "@/components/unlock-animal-modal"
import type { Animal, UserAnimalStats } from "@/lib/types"
import AnimalDetailViewerGrid from "@/components/AnimalDetailViewerGrid"  


export default function DashboardPage() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState<UserAnimalStats | null>(null)
  const [animals, setAnimals] = useState<Animal[]>([])
  const [userAnimals, setUserAnimals] = useState<any[]>([])
  const [filteredAnimals, setFilteredAnimals] = useState<Animal[]>([])
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null)
  const [showUnlockModal, setShowUnlockModal] = useState(false)
  const [animalToUnlock, setAnimalToUnlock] = useState<Animal | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (user) {
      fetchData()
    }
  }, [user])

  useEffect(() => {
    filterAnimals()
  }, [searchTerm, categoryFilter, statusFilter, animals])

  const fetchData = async () => {
    try {
      console.log("[v0] Fetching animals and user animals...")
      const [animalsResponse, userAnimalsResponse] = await Promise.all([
        apiClient.get("/api/animals/get"),
        apiClient.get("/api/user-animals/get"),
      ])

      console.log("[v0] Animals response:", animalsResponse.data)
      console.log("[v0] User animals response:", userAnimalsResponse.data)

      const allAnimals = animalsResponse.data
      const userAnimalsList = userAnimalsResponse.data

      setUserAnimals(userAnimalsList)

      const animalsWithStatus = allAnimals.map((animal: Animal) => {
        const userAnimal = userAnimalsList.find((ua: any) => ua.animalId === animal.id)
        const isUnlocked = userAnimal && userAnimal.status === "UNLOCK"

        return {
          ...animal,
          isLocked: !isUnlocked,
          userAnimalId: userAnimal?.id,
        }
      })

      setAnimals(animalsWithStatus)
      setFilteredAnimals(animalsWithStatus)

      const unlockedCount = userAnimalsList.filter((ua: any) => ua.status === "UNLOCK").length
      const totalPhotos = userAnimalsList.reduce((sum: number, ua: any) => sum + (ua.totalPhotos || 0), 0)

      const categories = [...new Set(allAnimals.map((a: Animal) => a.category).filter(Boolean))]
      const categoriesStats = categories.map((category) => {
        const totalInCategory = allAnimals.filter((a: Animal) => a.category === category).length
        const unlockedInCategory = userAnimalsList.filter(
          (ua: any) =>
            ua.status === "UNLOCK" && allAnimals.find((a: Animal) => a.id === ua.animalId)?.category === category,
        ).length

        return {
          category,
          unlocked: unlockedInCategory,
          total: totalInCategory,
        }
      })

      setStats({
        totalUnlockedAnimals: unlockedCount,
        totalPhotos: totalPhotos,
        totalAnimals: allAnimals.length,
        categoriesStats,
      })

      console.log("🔍 [DEBUG] Estado calculado:", {
        animalsCount: animalsWithStatus.length,
        unlockedAnimals: animalsWithStatus.filter((a) => !a.isLocked).length,
        userAnimalsCount: userAnimalsList.length,
        userAnimalsStatus: userAnimalsList.map((ua) => ({
          animalId: ua.animalId,
          status: ua.status,
          animalCommonName: ua.animalCommonName,
        })),
        stats: {
          totalUnlocked: unlockedCount,
          totalPhotos,
          totalAnimals: allAnimals.length,
        },
      })
    } catch (error) {
      console.error("[v0] Error fetching data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterAnimals = () => {
    let filtered = [...animals]

    if (searchTerm) {
      filtered = filtered.filter(
        (animal) =>
          animal.commonName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          animal.scientificName?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter((animal) => animal.category?.toLowerCase() === categoryFilter.toLowerCase())
    }

    if (statusFilter === "locked") {
      filtered = filtered.filter((animal) => animal.isLocked)
    } else if (statusFilter === "unlocked") {
      filtered = filtered.filter((animal) => !animal.isLocked)
    }

    setFilteredAnimals(filtered)
  }

  const handleUnlockAnimal = async (commonName: string, photo: File, description?: string) => {
    if (!animalToUnlock) return

    const formData = new FormData()
    formData.append("commonName", commonName)
    formData.append("file", photo)
    if (description) {
      formData.append("description", description)
    }

    console.log("🔍 [DEBUG] Datos para desbloquear:", {
      commonName,
      photo: {
        name: photo?.name,
        size: photo?.size,
        type: photo?.type,
      },
      description,
    })

    console.log("📦 [DEBUG] FormData contenido:")
    for (const [key, value] of formData.entries()) {
      console.log(`   ${key}:`, value)
    }

    await apiClient.post("/api/user-animals/unlock", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })

    await fetchData()

    if (selectedAnimal?.id === animalToUnlock.id) {
      setSelectedAnimal({ ...animalToUnlock, isLocked: false })
    }
  }

  const categories = [...new Set(animals.map((a) => a.category).filter(Boolean))]

  if (authLoading || isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <p className="text-muted-foreground">Carregant...</p>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const getFilteredStats = () => {
    if (categoryFilter === "all" || !stats) {
      return stats
    }

    const categoryStat = stats.categoriesStats.find((cs) => cs.category === categoryFilter)
    if (!categoryStat) return stats

    return {
      ...stats,
      totalUnlockedAnimals: categoryStat.unlocked,
      totalAnimals: categoryStat.total,
      categoriesStats: [categoryStat],
    }
  }

  const displayStats = getFilteredStats()
  const displayPercentage = displayStats ? (displayStats.totalUnlockedAnimals / displayStats.totalAnimals) * 100 : 0

  return (
  <div className="min-h-[calc(100vh-4rem)]">
    <div className="flex h-screen">
      
      {/* ✅ USER SIDEBAR - OCUPA TOTA L'ALTURA */}
      <div className="w-1/4 border-r border-border bg-gradient-to-b from-muted/10 to-background">
        <div className="h-full overflow-y-auto"> {/* ✅ Scroll intern */}
          <UserSidebar
            user={user}
            stats={displayStats}
            displayPercentage={displayPercentage}
            categoryFilter={categoryFilter}
          />
        </div>
      </div>

      {/* ✅ FITXES D'ANIMALS - OCUPA TOTA L'ALTURA */}
      <div className="w-1/4 border-r border-border">
        <div className="h-full flex flex-col bg-gradient-to-b from-background to-muted/5">
          <div className="p-4 flex-shrink-0 border-b border-border"> {/* ✅ Header fix */}
            <div className="mb-4">
              <h1 className="mb-1 font-serif text-xl font-bold text-foreground">Catàleg d'animals</h1>
              <p className="text-xs text-muted-foreground">Selecciona un animal per veure els detalls</p>
            </div>

            <SearchFilters
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              categoryFilter={categoryFilter}
              onCategoryChange={setCategoryFilter}
              statusFilter={statusFilter}
              onStatusChange={setStatusFilter}
              categories={categories}
            />
          </div>
          
          {/* ✅ Llista ocupa tot l'espai restant */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4">
              <AnimalList animals={filteredAnimals} selectedAnimal={selectedAnimal} onSelectAnimal={setSelectedAnimal} />
            </div>
          </div>
        </div>
      </div>

      {/* ✅ VISUALITZADOR - OCUPA TOTA L'ALTURA */}
      <div className="w-2/4 h-screen overflow-y-auto bg-gradient-to-b from-muted/20 to-background p-6">
        <AnimalDetailViewer
          animal={selectedAnimal}
          userAnimals={userAnimals}
          onUnlock={() => {
            if (selectedAnimal) {
              setAnimalToUnlock(selectedAnimal)
              setShowUnlockModal(true)
            }
          }}
          onRefresh={fetchData}
        />
      </div>
    </div>
    
    {showUnlockModal && animalToUnlock && (
      <UnlockAnimalModal
        animal={animalToUnlock}
        onClose={() => {
          setShowUnlockModal(false)
          setAnimalToUnlock(null)
        }}
        onSubmit={handleUnlockAnimal}
      />
    )}
  </div>
)
}