"use client"

import { Badge } from "@/components/ui/badge"
import { Lock } from "lucide-react"
import type { Animal } from "@/lib/types"

interface AnimalListProps {
  animals: Animal[]
  selectedAnimal: Animal | null
  onSelectAnimal: (animal: Animal) => void
}

export default function AnimalList({ animals, selectedAnimal, onSelectAnimal }: AnimalListProps) {
  if (animals.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">No s'han trobat animals amb aquests filtres</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {animals.map((animal) => (
        <button
          key={animal.id}
          onClick={() => onSelectAnimal(animal)}
          className={`flex w-full items-center gap-3 rounded-lg border-2 p-2.5 text-left transition-all hover:shadow-lg ${
            selectedAnimal?.id === animal.id
              ? "border-primary bg-primary/10 shadow-md"
              : animal.isLocked
                ? "animal-locked border-border/50"
                : "animal-unlocked border-primary/20"
          }`}
        >
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-muted shadow-sm">
            <img
              src={animal.isLocked ? animal.photoLockUrl : animal.photoUnlockUrl}
              alt={animal.commonName}
              className={`h-full w-full object-cover ${animal.isLocked ? "opacity-30 grayscale" : ""}`}
            />
            {animal.isLocked && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <Lock className="h-4 w-4 text-muted-foreground drop-shadow" />
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="mb-0.5 flex items-center gap-2">
              <h3 className="truncate text-sm font-bold text-foreground">{animal.commonName}</h3>
              <Badge variant={animal.isLocked ? "secondary" : "default"} className="shrink-0 text-xs font-semibold">
                {animal.category}
              </Badge>
            </div>
            <p className="truncate text-xs italic text-muted-foreground">{animal.scientificName}</p>
          </div>
        </button>
      ))}
    </div>
  )
}
