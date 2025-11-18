"use client"

import CharacterAvatar from "@/components/character-avatar"
import type { UserAnimalStats } from "@/lib/types"
import { Trophy, Star, Zap, Award } from 'lucide-react'

interface UserSidebarProps {
  user: { name: string; character: string }
  stats: UserAnimalStats | null
  displayPercentage: number
  categoryFilter: string
}

const getCharacterDisplayName = (character: string) => {
  const characterNames: { [key: string]: string } = {
    explorer: "Explorador/a",
    biologist: "Bióleg/a", 
    photographer: "Fotògraf/a",
    ranger: "Guardabosc"
  }
  return characterNames[character] || "Explorador/a"
}

// Función para calcular el nivel del usuario
const getUserLevel = (unlockedAnimals: number, totalPhotos: number) => {
  const score = unlockedAnimals * 2 + totalPhotos
  
  if (score >= 30) return { 
    level: "Expert", 
    color: "from-purple-500 to-purple-600",
    bgColor: "bg-purple-50 border-purple-200",
    textColor: "text-purple-700",
    icon: Trophy,
    description: "Mestre de la fauna catalana!",
    progress: 100
  }
  
  if (score >= 15) return { 
    level: "Intermedi", 
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-50 border-blue-200",
    textColor: "text-blue-700",
    icon: Zap,
    description: "Coneixedor de la natura",
    progress: 66
  }
  
  return { 
    level: "Principiant", 
    color: "from-green-500 to-green-600",
    bgColor: "bg-green-50 border-green-200",
    textColor: "text-green-700",
    icon: Star,
    description: "Començant l'aventura",
    progress: 33
  }
}

export default function UserSidebar({ user, stats, displayPercentage, categoryFilter }: UserSidebarProps) {
  const userLevel = getUserLevel(stats?.totalUnlockedAnimals || 0, stats?.totalPhotos || 0)
  const LevelIcon = userLevel.icon

  return (
    <div className="h-full w-full bg-gradient-to-b from-primary/5 to-secondary/5 p-5">
      <div className="mb-5 rounded-xl border-2 border-primary/20 bg-background/80 p-5 shadow-lg">
        {/* ✅ CONTENIDOR FLEX PER AL LAYOUT HORITZONTAL */}
        <div className="flex items-start gap-5">
          
          {/* ✅ COLUMNA ESQUERRA - AVATAR I INFO USUARI */}
          <div className="flex-shrink-0 text-center">
            <CharacterAvatar character={user.character || "explorer"} size="lg" />

            <h2 className="mt-3 text-xl font-bold text-foreground">
              {user?.name}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Descobreix la fauna catalana!
            </p>
          </div>

          {/* ✅ COLUMNA DRETA - ESTADÍSTIQUES */}
          <div className="flex-1 space-y-4">
            {/* NIVEL DEL USUARIO - VERSIÓN EQUILIBRADA */}
            <div className={`rounded-lg border-2 ${userLevel.bgColor} p-4`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`rounded-full bg-gradient-to-r ${userLevel.color} p-2`}>
                    <LevelIcon className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Nivell
                    </div>
                    <div className={`text-lg font-bold ${userLevel.textColor}`}>
                      {userLevel.level}
                    </div>
                  </div>
                </div>
                <Award className={`h-5 w-5 ${userLevel.textColor}`} />
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                {userLevel.description}
              </div>
            </div>

            {/* ANIMALS DESCOBERTS */}
            <div className="rounded-lg border border-primary/30 bg-background/90 p-4">
              <div className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {categoryFilter !== "all" ? categoryFilter : "Animals"} descoberts
              </div>
              <div className="text-2xl font-bold text-primary">
                {stats?.totalUnlockedAnimals || 0}/{stats?.totalAnimals || 0}
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
                  style={{ width: `${displayPercentage}%` }}
                />
              </div>
              <div className="mt-1 text-right text-xs font-medium text-primary">{displayPercentage.toFixed(1)}%</div>
            </div>

            {/* TOTAL FOTOS */}
            <div className="rounded-lg border border-secondary/30 bg-background/90 p-4">
              <div className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">Total de fotos</div>
              <div className="text-2xl font-bold text-secondary">{stats?.totalPhotos || 0}</div>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ ESTADÍSTIQUES PER CATEGORIA */}
      {stats?.categoriesStats && stats.categoriesStats.length > 0 && categoryFilter === "all" && (
        <div className="rounded-lg border-2 border-primary/20 bg-gradient-to-br from-background to-muted/30 p-4">
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-foreground">
            Estadístiques per categoria
          </h3>
          <div className="space-y-2">
            {stats.categoriesStats.map((catStat) => (
              <div
                key={catStat.category}
                className="flex items-center justify-between rounded-md bg-background/50 p-2 text-sm"
              >
                <span className="font-medium text-foreground">{catStat.category}</span>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-primary">
                    {catStat.unlocked}/{catStat.total}
                  </span>
                  <div className="h-2 w-20 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-secondary"
                      style={{ width: `${(catStat.unlocked / catStat.total) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}