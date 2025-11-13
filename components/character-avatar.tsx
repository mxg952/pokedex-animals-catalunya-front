"use client"

import type { CharacterType } from "@/lib/types"

interface CharacterAvatarProps {
  character: CharacterType
  size?: "sm" | "md" | "lg"
  username?: string
}

const characterImages: Record<CharacterType, string> = {
  explorer: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/exploradora-H1Gk80CRVNkT30aAc7fxC7bCvej5uu.webp",
  scientist: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/cientific-5rFrlYu1g5iNtcK3ayhuXjJupjsjPy.webp",
  photographer: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fotografo-zNzis6aVdVvsgJefmOIbmAmYPyu4n1.webp",
}

const characterNames: Record<CharacterType, string> = {
  explorer: "Explorador/a",
  scientist: "Científic/a",
  photographer: "Fotògraf/a",
}

export default function CharacterAvatar({ character, size = "md", username }: CharacterAvatarProps) {
  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-32 h-32",
    lg: "w-48 h-48",
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div className={`${sizeClasses[size]} animate-bounce-slow`}>
        <img
          src={characterImages[character] || "/placeholder.svg"}
          alt={characterNames[character]}
          className="h-full w-full object-contain"
        />
      </div>
      <p className="text-sm font-medium text-foreground">
        {characterNames[character]} {username && <span className="text-primary">{username}</span>}
      </p>
    </div>
  )
}
