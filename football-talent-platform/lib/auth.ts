export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  role: "player" | "scout" | "coach"
  profilePicture?: string
}

export const getStoredUser = (): User | null => {
  if (typeof window === "undefined") return null

  const userStr = localStorage.getItem("user")
  return userStr ? JSON.parse(userStr) : null
}

export const getStoredToken = (): string | null => {
  if (typeof window === "undefined") return null

  return localStorage.getItem("token")
}

export const getUserRole = (): string | null => {
  if (typeof window === "undefined") return null

  return localStorage.getItem("userRole")
}

export const logout = () => {
  localStorage.removeItem("token")
  localStorage.removeItem("user")
  localStorage.removeItem("userRole")
  window.location.href = "/login"
}

export const isAuthenticated = (): boolean => {
  return !!getStoredToken()
}
