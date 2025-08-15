import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import { Button } from "../ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Textarea } from "../ui/textarea"
import { useToastContext } from "../../contexts/ToastContext"
import { API_BASE_URL, fetchWithRetry } from "../../lib/utils"
import { ArrowLeft, Save } from "lucide-react"

export default function EditPlayerProfile() {
  const navigate = useNavigate()
  const { user, updateUser } = useAuth()
  const { toast } = useToastContext()
  
  const [formData, setFormData] = useState({
    email: user?.email || '',
    location: user?.location || '',
    bio: user?.bio || '',
    // Player-specific fields
    fullName: user?.fullName || '',
    position: user?.position || '',
    userName: user?.userName || '',
    height: user?.height || '',
    weight: user?.weight || '',
    dateOfBirth: user?.dateOfBirth || '',
    clubTeam: user?.clubTeam || '',
    age: user?.age || '',
    phone: user?.phone || '',
  })
  
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const response = await fetchWithRetry(`${API_BASE_URL}/player/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        const updatedUser = await response.json()
        updateUser(updatedUser)
        
        toast({
          title: "Success",
          description: "Player profile updated successfully!",
          variant: "success",
        })
        
        navigate('/dashboard/player')
      } else {
        const errorData = await response.json()
        toast({
          title: "Error",
          description: errorData.message || "Failed to update profile",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Profile update error:', error)
      toast({
        title: "Error",
        description: "Network error. Please check if the server is running and try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard/player')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Edit Player Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>


                 <div>
                  <Label htmlFor="userName">User Name</Label>
                  <Input
                    type="username"
                    id="username"
                    name="username"
                    value={formData.userName}
                    onChange={handleChange}
                  />
                </div>
                
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
                
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                  />
                </div>
                
                <div>
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    type="date"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                  />
                </div>
                
                <div>
                  <Label htmlFor="position">Position</Label>
                  <select
                    id="position"
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                  >
                    <option value="">Select Position</option>
                    <option value="goalkeeper">Goalkeeper</option>
                    <option value="defender">Defender</option>
                    <option value="midfielder">Midfielder</option>
                    <option value="forward">Forward</option>
                    <option value="striker">Striker</option>
                  </select>
                </div>
        
                <div>
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input
                    type="number"
                    id="height"
                    name="height"
                    value={formData.height}
                    onChange={handleChange}
                    placeholder="180"
                  />
                </div>
                
                <div>
                  <Label htmlFor="age">Age (Years)</Label>
                  <Input
                    type="number"
                    id="age"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    placeholder="75"
                  />
                </div>
                
                <div>
                  <Label htmlFor="clubTeam">Club Team</Label>
                  <Input
                    id="clubTeam"
                    name="clubTeam"
                    value={formData.clubTeam}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                  />
                </div>
              </div>
              
              {/* Text Areas */}
              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  name="bio"
                  rows={4}
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Tell us about yourself as a player..."
                />
              </div>
              
              <div>
                <Label htmlFor="weight">Weight</Label>
                <Textarea
                  id="weight"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                />
              </div>
              
              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/dashboard/player')}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-cyan-600 hover:bg-cyan-700"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Saving...</span>
                    </div>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
