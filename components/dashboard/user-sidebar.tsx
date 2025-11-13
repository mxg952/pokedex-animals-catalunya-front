"use client"

import CharacterAvatar from "@/components/character-avatar"
import type { UserAnimalStats } from "@/lib/types"

interface UserSidebarProps {
  user: { username: string; character: string }
  stats: UserAnimalStats | null
  displayPercentage: number
  categoryFilter: string
}

export default function UserSidebar({ user, stats, displayPercentage, categoryFilter }: UserSidebarProps) {
  return (
    <div className="h-full w-full bg-gradient-to-b from-primary/5 to-secondary/5 p-6"> {/* ✅ ELIMINAT w-80, AFEGIT h-full w-full */}
      <div className="mb-6 rounded-xl border-2 border-primary/20 bg-background/80 p-6 text-center shadow-lg pokedex-card">
        <CharacterAvatar character={user.character || "explorer"} size="lg" username={user.username} />
        <p className="mt-4 text-sm font-medium text-primary">Descobreix la fauna catalana!</p>
      </div>

      <div className="space-y-3">
        <div className="rounded-lg border border-primary/30 bg-background/90 p-4 shadow-md pokedex-card">
          <div className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {categoryFilter !== "all" ? categoryFilter : "Animals"} descoberts
          </div>
          <div className="text-3xl font-bold text-primary">
            {stats?.totalUnlockedAnimals || 0}/{stats?.totalAnimals || 0}
          </div>
          <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
              style={{ width: `${displayPercentage}%` }}
            />
          </div>
          <div className="mt-1 text-right text-xs font-medium text-primary">{displayPercentage.toFixed(1)}%</div>
        </div>

        <div className="rounded-lg border border-secondary/30 bg-background/90 p-4 shadow-md pokedex-card">
          <div className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">Total de fotos</div>
          <div className="text-3xl font-bold text-secondary">{stats?.totalPhotos || 0}</div>
        </div>

        {stats?.categoriesStats && stats.categoriesStats.length > 0 && categoryFilter === "all" && (
          <div className="rounded-lg border-2 border-primary/20 bg-gradient-to-br from-background to-muted/30 p-4 pokedex-card">
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
                    <div className="h-2 w-24 overflow-hidden rounded-full bg-muted">
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
    </div>
  )
}