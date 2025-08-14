import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { useToastContext } from "../contexts/ToastContext"
import { useAuth } from "../contexts/AuthContext"
import { API_BASE_URL, fetchWithRetry } from "../lib/utils"
import { Crown } from "lucide-react"

export default function LoginPage() {
  const navigate = useNavigate()
  const { toast } = useToastContext()
  const { login } = useAuth()

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (!formData.email) {
        toast({
          title: "Error",
          description: "Please enter your email address",
          variant: "destructive",
        })
        return
      }
      if (!formData.role) {
        toast({
          title: "Error",
          description: "Please select your role",
          variant: "destructive",
        })
        return
      }
      toast({
        title: "Signing In",
        description: "Connecting, please wait...",
        variant: "info",
      })

      const response = await fetchWithRetry(`${API_BASE_URL}/${formData.role}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        // Use AuthContext login method
        login({ ...data.user, role: formData.role }, data.token)

        toast({
          title: "Success",
          description: "Logged in successfully!",
          variant: "success",
        })

        // Route to appropriate dashboard
        navigate(`/dashboard/${formData.role}`)
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to login",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Network error. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative"
      style={{
        backgroundImage: "url('/connor-coyne-OgqWLzWRSaI-unsplash.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
      {/* Dark overlay for better readability */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      
      {/* Content */}
      <Card className="w-full max-w-md shadow-2xl border-0 relative z-10 bg-white/95 backdrop-blur-sm">
        <CardHeader className="text-center bg-white/90 backdrop-blur-sm rounded-t-lg">
          <Link to="/" className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-cyan-600 rounded-full flex items-center justify-center shadow-lg">
              <Crown className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-xl text-gray-900">ScoutStar</span>
          </Link>
          <CardTitle className="text-2xl font-bold text-gray-900">Welcome Back</CardTitle>
          <CardDescription className="text-gray-700">Sign in to your account</CardDescription>
        </CardHeader>
        <CardContent className="bg-white/90 backdrop-blur-sm rounded-b-lg">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="player">Player</SelectItem>
                  <SelectItem value="scout">Scout</SelectItem>
                  <SelectItem value="coach">Coach</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>

            <Button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-700" disabled={isLoading}>
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing In...</span>
                </div>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link to="/signup" className="text-cyan-600 hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
