import axios from "axios"

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
})

export const adminApi = {
  getAllUsers: () => apiClient.get("/api/admin/users"),
  createAnimal: (data: FormData) => apiClient.post("/api/admin/animals", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }),

}

// Add auth token to requests if available
apiClient.interceptors.request.use((config) => {
  console.log("[v0] Making request to:", config.baseURL + config.url)
  const user = localStorage.getItem("user")
  if (user) {
    const userData = JSON.parse(user)
    if (userData.token) {
      config.headers.Authorization = `Bearer ${userData.token}`
    }
  }
  return config
})



apiClient.interceptors.response.use(
  (response) => {
    console.log("[v0] API Response:", response.config.url, response.status, response.data)
    return response
  },
  (error) => {
    if (error.code === "ECONNABORTED") {
      console.error("[v0] Request timeout - backend not responding")
    } else if (error.message === "Network Error") {
      console.error("[v0] Network Error - backend might not be running at", API_BASE_URL)
    }
    console.error("[v0] API Error:", error.config?.url, error.response?.status, error.response?.data)
    console.error("[v0] Full error:", error.message)
    return Promise.reject(error)
  },


  
)
