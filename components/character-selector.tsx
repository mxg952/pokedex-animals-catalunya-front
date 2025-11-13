"use client"
import { Check } from "lucide-react"
import type { CharacterType } from "@/lib/types"

interface CharacterSelectorProps {
  selected: CharacterType
  onSelect: (character: CharacterType) => void
}

const characters = [
  {
    type: "explorer" as CharacterType,
    name: "Explorador/a",
    description: "Aventurer intrèpid de la natura",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/exploradora-H1Gk80CRVNkT30aAc7fxC7bCvej5uu.webp",
  },
  {
    type: "scientist" as CharacterType,
    name: "Científic/a",
    description: "Observador curiós de la fauna",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/cientific-5rFrlYu1g5iNtcK3ayhuXjJupjsjPy.webp",
  },
  {
    type: "photographer" as CharacterType,
    name: "Fotògraf/a",
    description: "Capturador d'instants naturals",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fotografo-zNzis6aVdVvsgJefmOIbmAmYPyu4n1.webp",
  },
]

export default function CharacterSelector({ selected, onSelect }: CharacterSelectorProps) {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-foreground">Escull el teu personatge</label>
      <div className="grid gap-3">
        {characters.map((character) => (
          <button
            key={character.type}
            type="button"
            onClick={() => onSelect(character.type)}
            className={`relative flex items-start gap-3 rounded-lg border-2 p-4 text-left transition-all ${
              selected === character.type
                ? "border-primary bg-primary/5"
                : "border-border bg-background hover:border-primary/50"
            }`}
          >
            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full bg-muted">
              <img
                src={character.image || "/placeholder.svg"}
                alt={character.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-foreground">{character.name}</div>
              <div className="text-sm text-muted-foreground">{character.description}</div>
            </div>
            {selected === character.type && <Check className="h-5 w-5 shrink-0 text-primary" />}
          </button>
        ))}
      </div>
    </div>
  )
}
