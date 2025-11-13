"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

interface SearchFiltersProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  categoryFilter: string
  onCategoryChange: (value: string) => void
  statusFilter: string
  onStatusChange: (value: string) => void
  categories: string[]
}

export default function SearchFilters({
  searchTerm,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  statusFilter,
  onStatusChange,
  categories,
}: SearchFiltersProps) {
  return (
    <div className="mb-4 space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Cerca per nom..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          variant={categoryFilter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => onCategoryChange("all")}
          className="font-medium"
        >
          Tots
        </Button>
        {categories.map((category) => (
          <Button
            key={category}
            variant={categoryFilter === category ? "default" : "outline"}
            size="sm"
            onClick={() => onCategoryChange(category)}
            className="font-medium"
          >
            {category}
          </Button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          variant={statusFilter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => onStatusChange("all")}
          className="font-medium"
        >
          Tots
        </Button>
        <Button
          variant={statusFilter === "unlocked" ? "default" : "outline"}
          size="sm"
          onClick={() => onStatusChange("unlocked")}
          className="font-medium"
        >
          Desbloquejats
        </Button>
        <Button
          variant={statusFilter === "locked" ? "default" : "outline"}
          size="sm"
          onClick={() => onStatusChange("locked")}
          className="font-medium"
        >
          Bloquejats
        </Button>
      </div>
    </div>
  )
}
