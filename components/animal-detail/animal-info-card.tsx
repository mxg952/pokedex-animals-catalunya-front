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
  // Función para determinar el color de la probabilidad
  const getProbabilityColor = (probability: string) => {
    const prob = probability?.toLowerCase()
    if (prob?.includes('alta') || prob?.includes('high')) return 'text-green-600'
    if (prob?.includes('mitjana') || prob?.includes('medium')) return 'text-yellow-600'
    if (prob?.includes('baixa') || prob?.includes('low')) return 'text-red-600'
    return 'text-muted-foreground'
  }

  const probabilityColor = getProbabilityColor(animal.visibilityProbability)

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

      {/* PROBABILIDAD DE AVISTAMIENTO Y MESES JUNTOS - SIEMPRE VISIBLES */}
      <div className="space-y-3 rounded-lg border border-border bg-muted/30 p-4">
        {/* Probabilidad - SIEMPRE VISIBLE */}
        {animal.visibilityProbability && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-accent" />
              <span className="font-semibold text-foreground">Probabilitat d'avistament</span>
            </div>
            <Badge 
              variant="outline" 
              className={`font-medium ${probabilityColor} border-current`}
            >
              {animal.visibilityProbability}
            </Badge>
          </div>
        )}

        {/* Meses de Avistamiento - SIEMPRE VISIBLE */}
        <div className="flex items-start gap-2 pt-2 border-t border-border/50">
          <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
          <div className="flex-1">
            <div className="font-semibold text-foreground mb-2">Mesos d'avistament</div>
            
            {animal.sightingMonths && animal.sightingMonths.length > 0 ? (
              // ✅ MOSTRAR MESES (siempre visible)
              <div className="flex flex-wrap gap-1">
                {animal.sightingMonths.map((month, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary"
                    className="text-xs bg-blue-50 text-blue-700 border-blue-200 font-medium"
                  >
                    {month.trim()}
                  </Badge>
                ))}
              </div>
            ) : (
              // ✅ MOSTRAR MENSAJE CUANDO NO HAY MESES (siempre visible)
              <div className="text-sm text-muted-foreground italic">
                No s'han especificat mesos d'observació
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Descripción - SOLO DESBLOQUEADO */}
      {!isLocked && animal.shortDescription && (
        <div className="rounded-lg border border-border bg-muted/30 p-4">
          <div className="mb-1 font-semibold text-foreground">Descripció</div>
          <p className="text-sm leading-relaxed text-muted-foreground">{animal.shortDescription}</p>
        </div>
      )}


    </div>
  )
}