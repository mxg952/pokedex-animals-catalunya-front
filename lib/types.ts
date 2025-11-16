export interface Animal {
  id: number
  commonName: string
  scientificName: string
  category: string
  visibilityProbability?: string
  sightingMonths?: string[]
  shortDescription?: string
  locationDescription?: string
  mapUrl?: string
  photoLockUrl?: string
  photoUnlockUrl?: string
  isLocked?: boolean
}

export interface UserAnimal {
  id: number
  userId: number
  animalId: number
  discoveredAt: string
  photoUrl?: string
  animal: Animal
}

export interface UserAnimalDto {
  id: number
  userId: number
  animalId: number
  status: "LOCK" | "UNLOCK"
  unlockedAt?: string
  animalCommonName: string
  animalScientificName: string
  animalCategory: string
  animalDefaultPhotoUrl?: string
  totalPhotos: number
  unlocked: boolean
  mainPhotoUrl?: string
}

export interface UserStats {
  totalAnimals: number
  discoveredAnimals: number
  percentageComplete: number
}

export interface UserAnimalStats {
  totalUnlockedAnimals: number
  totalPhotos: number
  totalAnimals: number
  categoriesStats?: CategoryStats[]
}

export interface CategoryStats {
  category: string
  unlocked: number
  total: number
}

export interface AnimalPhoto {
  id: number
  fileName: string
  originalFileName: string
  contentType: string
  description?: string
  uploadedAt: string
  userAnimalId: number
}

export interface CreateAnimalRequest {
  commonName: string
  scientificName: string
  category: string
  shortDescription: string
  locationDescription: string
  visibilityProbability: number
  sightingMonths: string
  mapUrl: string
  photoLockFileName: string
  photoUnlockFileName: string
}

export type CharacterType = "explorer" | "scientist" | "photographer"

export interface User {
  name: string
  token: string
  role: "USER_ROLE" | "ADMIN_ROLE"
  character?: CharacterType
}

export interface UserInfo {
  id: number
  username: string
  role: string
  createdAt: string
  unlockedAnimalsCount: number
  uploadedPhotosCount: number
}

export interface AnimalLockDto {
  commonName: string
  scientificName: string
  sightingMonths: string[]
  locationDescription: string
  mapUrl?: string
  photoLockUrl?: string
  message?: string
}

export interface AnimalUnlockDto {
  commonName: string
  scientificName: string
  category: string
  visibilityProbability: string
  sightingMonths: string[]
  shortDescription: string
  locationDescription: string
  mapUrl?: string
  photoUnlockUrl?: string
}
