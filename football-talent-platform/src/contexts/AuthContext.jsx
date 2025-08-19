import { createContext, useContext, useState, useEffect } from "react"

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("token")
    const userData = localStorage.getItem("user")

    if (token && userData) {
      try {
        setUser(JSON.parse(userData))
      } catch (error) {
        console.error("Error parsing user data:", error)
        localStorage.removeItem("token")
        localStorage.removeItem("user")
      }
    }
    setLoading(false)
  }, [])

  const login = (userData, token) => {
    localStorage.setItem("token", token)
    localStorage.setItem("user", JSON.stringify(userData))
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setUser(null)
  }

  const updateUser = (updatedData) => {
    console.log('Updating user with:', updatedData) // Debug log
    
    // Ensure we preserve all existing user data and merge new data correctly
    const currentUser = JSON.parse(localStorage.getItem("user") || '{}')
    const updatedUser = {
      ...currentUser,
      ...user, // Current state
      ...updatedData, // New updates
      // Explicitly preserve important fields
      profilePicture: updatedData.profilePicture || user?.profilePicture || currentUser?.profilePicture,
      avatar: updatedData.avatar || user?.avatar || currentUser?.avatar
    }
    
    console.log('Updated user data:', updatedUser) // Debug log
    localStorage.setItem("user", JSON.stringify(updatedUser))
    setUser(updatedUser)
  }

  const value = {
    user,
    login,
    logout,
    updateUser,
    loading,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
