import { useState } from "react"
import { useNavigate, useSearchParams, Link } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { useToastContext } from "../contexts/ToastContext"
import { API_BASE_URL, validateEmail, validatePassword, fetchWithRetry } from "../lib/utils"
import { Crown } from "lucide-react"

export default function SignupPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { toast } = useToastContext()

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    role: searchParams.get("role") || "",
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    console.log("Form submitted with data:", formData)

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

    if (!formData.password) {
      toast({
        title: "Error",
        description: "Please enter a password",
        variant: "destructive",
      })
      return
    }

    if (!validateEmail(formData.email)) {
      toast({
        title: "Error",
        description: "Please enter a valid email address",
        variant: "destructive",
      })
      return
    }

    if (!validatePassword(formData.password)) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters long",
        variant: "destructive",
      })
      return
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      })
      return
    }
    setIsLoading(true)
    try {
      const apiUrl = `${API_BASE_URL}/${formData.role}/register`
      console.log("Making API request to:", apiUrl)
      
      // Show user feedback about potential delay
      toast({
        title: "Creating Account",
        description: "Please wait...",
        variant: "info",
      })
      
      const response = await fetchWithRetry(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          role: formData.role,
        }),
      })

      console.log("API Response status:", response.status)
      const data = await response.json()
      console.log("API Response data:", data)

      if (response.ok) {
        toast({
          title: "Success",
          description: "Account created successfully! Please login.",
          variant: "success",
        })
        navigate("/login")
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to create account",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Network error:", error)
      
      // Demo mode fallback when backend is not available
      if (error.message.includes("timeout") || error.message.includes("Failed to fetch")) {
        console.log("Backend not available, using demo mode")
        
        // Create a demo user account
        const demoUser = {
          id: Date.now().toString(),
          email: formData.email,
          role: formData.role,
          name: formData.email.split('@')[0], // Use email prefix as name
          profilePicture: null,
          createdAt: new Date().toISOString()
        }
        
        // Store in localStorage for demo purposes
        localStorage.setItem('demoUser', JSON.stringify(demoUser))
        
        toast({
          title: "Demo Mode",
          description: "Backend not available. Created demo account successfully!",
          variant: "success",
        })
        navigate("/login")
      } else {
        toast({
          title: "Error",
          description: "Network error. Please try again or check if the server is running.",
          variant: "destructive",
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  const getRoleColor = (role) => {
    switch (role) {
      case "player":
        return "text-cyan-600"
      case "scout":
        return "text-purple-600"
      case "coach":
        return "text-green-600"
      default:
        return "text-gray-600"
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
          <CardTitle className="text-2xl font-bold text-gray-900">Create Account</CardTitle>
          <CardDescription className="text-gray-700">
            Join as a {formData.role && <span className={getRoleColor(formData.role)}>{formData.role}</span>}
          </CardDescription>
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

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
              />
            </div>

            <Button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-700" disabled={isLoading}>
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating Account... (up to 8s)</span>
                </div>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="text-cyan-600 hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
