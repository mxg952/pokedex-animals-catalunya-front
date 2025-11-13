"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { apiClient } from "./api-client"
import type { User, CharacterType } from "./types"

interface AuthContextType {
  user: User | null
  login: (name: string, password: string) => Promise<void>
  register: (name: string, password: string, character: CharacterType) => Promise<void>
  logout: () => void
  isLoading: boolean
}

function decodeJWT(token: string): { role: "USER_ROLE" | "ADMIN_ROLE" } | null {
  try {
    const base64Url = token.split(".")[1]
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    )
    return JSON.parse(jsonPayload)
  } catch (error) {
    console.error("Error decoding JWT:", error)
    return null
  }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in on mount
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (name: string, password: string) => {
    const response = await apiClient.post("/api/users/login", { name, password })
    const jwtResponse = response.data

    const decoded = decodeJWT(jwtResponse.token)
    const userData: User = {
      name: jwtResponse.name,
      token: jwtResponse.token,
      role: decoded?.role || "USER_ROLE",
    }

    setUser(userData)
    localStorage.setItem("user", JSON.stringify(userData))
    router.push("/dashboard")
  }

  const register = async (name: string, password: string, character: CharacterType) => {
    console.log("[v0] Attempting registration with:", { name, character })
    try {
      const response = await apiClient.post("/api/users/register", { name, password })
      console.log("[v0] Registration response:", response)
      const jwtResponse = response.data

      const decoded = decodeJWT(jwtResponse.token)
      console.log("[v0] Decoded JWT:", decoded)

      const userData: User = {
        name: jwtResponse.name,
        token: jwtResponse.token,
        role: decoded?.role || "USER_ROLE",
        character: character,
      }

      setUser(userData)
      localStorage.setItem("user", JSON.stringify(userData))
      router.push("/dashboard")
    } catch (error: any) {
      console.error("[v0] Registration error:", error)
      console.error("[v0] Error response:", error.response?.data)
      console.error("[v0] Error status:", error.response?.status)
      throw error
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    router.push("/")
  }

  return <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
