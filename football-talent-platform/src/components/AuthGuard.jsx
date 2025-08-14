import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

export default function AuthGuard({ children, requiredRole }) {
  const navigate = useNavigate()
  const { user, loading } = useAuth()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (loading) return

    const checkAuth = () => {
      if (!user) {
        navigate("/login")
        return
      }

      if (requiredRole && user.role !== requiredRole) {
        navigate(`/dashboard/${user.role}`)
        return
      }

      setIsLoading(false)
    }

    checkAuth()
  }, [user, loading, navigate, requiredRole])

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-600"></div>
      </div>
    )
  }

  return <>{children}</>
}
