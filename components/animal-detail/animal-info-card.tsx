"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Lock, MapPin, Calendar, Eye } from "lucide-react"
import type { Animal } from "@/lib/types"

interface AnimalInfoCardProps {
  animal: Animal
  isLocked: boolean
  onUnlock: () => void
}

export default function AnimalInfoCard({ animal, isLocked, onUnlock }: AnimalInfoCardProps) {
  return (
    <div
      className={`space-y-4 rounded-xl border-2 p-6 shadow-lg pokedex-card ${
        isLocked ? "animal-locked" : "animal-unlocked"
      }`}
    >
      <div className="relative aspect-square overflow-hidden rounded-lg bg-muted shadow-md">
        <img
          src={isLocked ? animal.photoLockUrl : animal.photoUnlockUrl}
          alt={animal.commonName}
          className={`h-full w-full object-cover ${isLocked ? "opacity-40 grayscale" : ""}`}
          onError={(e) => {
            console.error("[v0] Error loading animal image:", isLocked ? animal.photoLockUrl : animal.photoUnlockUrl)
            e.currentTarget.src = "/gray-animal-silhouette.jpg"
          }}
        />
        {isLocked && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <Lock className="h-20 w-20 text-muted-foreground drop-shadow-lg" />
          </div>
        )}
      </div>

      <div>
        <div className="mb-2 flex items-start justify-between gap-2">
          <h2 className="font-serif text-2xl font-bold text-foreground">{animal.commonName}</h2>
          <Badge variant={isLocked ? "secondary" : "default"} className="font-bold">
            {isLocked ? "Bloquejat" : "Desbloquejat"}
          </Badge>
        </div>
        <p className="italic text-muted-foreground">{animal.scientificName}</p>
        {animal.category && (
          <Badge variant="outline" className="mt-2 font-semibold">
            {animal.category}
          </Badge>
        )}
      </div>

       {isLocked && (
        <div className="rounded-lg border-2 border-primary/30 bg-primary/10 p-4 shadow-md">
          <p className="mb-3 text-sm text-foreground">
            Desbloqueja aquest animal per veure tota la informació i contribuir amb les teves fotos
          </p>
          <Button onClick={onUnlock} className="w-full font-bold shadow-md">
            <Lock className="mr-2 h-4 w-4" />
            Desbloqueja ara
          </Button>
        </div>
      )}

      {animal.visibilityProbability && (
            <div className="flex items-start gap-2 rounded-md bg-muted/30 p-3 text-sm">
              <Eye className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              <div>
                <div className="font-semibold text-foreground">Probabilitat d'avistament</div>
                <div className="text-muted-foreground">{animal.visibilityProbability}</div>
              </div>
            </div>
          )}

          {!isLocked && (
        <>
          {animal.shortDescription && (
            <div className="rounded-lg border border-border bg-muted/30 p-4">
              <div className="mb-1 font-semibold text-foreground">Descripció</div>
              <p className="text-sm leading-relaxed text-muted-foreground">{animal.shortDescription}</p>
            </div>
          )}
        </>
      )}

      {animal.locationDescription && (
        <div className="flex items-start gap-2 rounded-md bg-muted/30 p-3 text-sm">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <div>
            <div className="font-semibold text-foreground">Hàbitat</div>
            <div className="text-muted-foreground">{animal.locationDescription}</div>
          </div>
        </div>
      )}

    

      {animal.sightingMonths && animal.sightingMonths.length > 0 && (
        <div className="flex items-start gap-2 rounded-md bg-muted/30 p-3 text-sm">
          <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
          <div>
            <div className="font-semibold text-foreground">Mesos d'avistament</div>
            <div className="text-muted-foreground">{animal.sightingMonths.join(", ")}</div>
          </div>
        </div>
      )}
    </div>
  )
}
