import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import { Button } from "../ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Textarea } from "../ui/textarea"
import { useToastContext } from "../../contexts/ToastContext"
import { API_BASE_URL, fetchWithRetry, updateProfileData } from "../../lib/utils"
import { ArrowLeft, Save } from "lucide-react"

export default function EditPlayerProfile() {
  const navigate = useNavigate()
  const { user, updateUser } = useAuth()
  const { toast } = useToastContext()
  
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    userName: user?.userName || '',
    phone: user?.phone || '',
    // Player-specific fields
    location: user?.location || '',
    position: user?.position || '',
    height: user?.height || '',
    weight: user?.weight || '',
    dateOfBirth: user?.dateOfBirth || '',
    clubTeam: user?.clubTeam || '',
    age: user?.age || '',
    bio: user?.bio || ''
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
      // Get player ID from user context
      const playerId = user?.id
      if (!playerId) {
        throw new Error('Player ID not found. Please log in again.')
      }

      // Format and validate the data
      const formattedData = {
        ...formData,
        // Ensure numerical fields are numbers
        age: formData.age ? parseInt(formData.age, 10) : null,
        height: formData.height ? parseFloat(formData.height) : null,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        // Remove any undefined or empty string values
        ...Object.fromEntries(
          Object.entries(formData).filter(([_, value]) => 
            value !== undefined && value !== ''
          )
        )
      }

      // Log the formatted data
      console.log('Formatted data being sent:', formattedData)

      const result = await updateProfileData('player', localStorage.getItem('token'), playerId, formattedData)

      let updatedUser = null
      
      // If result contains user data, use it
      if (result && typeof result === 'object' && result.success !== false) {
        updatedUser = { ...user, ...formData, ...result }
      } else {
        // Otherwise, just merge form data with existing user
        updatedUser = { ...user, ...formData }
      }
        
      // Update user context
      if (updatedUser) {
        updateUser(updatedUser)
      }
      
      toast({
        title: "Success",
        description: "Player profile updated successfully!",
        variant: "success",
      })
      
      navigate('/dashboard/player')
    } catch (error) {
      console.error('Profile update error:', error)
      toast({
        title: "Error",
        description: error.message.includes('Player ID not found') ? error.message : "Network error. Please check your network connection and try again.",
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
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    minLength={2}
                    maxLength={100}
                  />
                </div>

                <div>
                  <Label htmlFor="userName">Username *</Label>
                  <Input
                    type="text"
                    id="userName"
                    name="userName"
                    value={formData.userName}
                    onChange={handleChange}
                    required
                    minLength={3}
                    maxLength={50}
                    pattern="[a-zA-Z0-9_-]+"
                  />
                </div>

                <div>
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input
                    type="number"
                    id="height"
                    name="height"
                    value={formData.height}
                    onChange={handleChange}
                    min="120"
                    max="250"
                    step="0.1"
                    placeholder="180"
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
                    pattern="[0-9+\-\s()]+"
                  />
                </div>

                 <div>
                  <Label htmlFor="age">Age *</Label>
                  <Input
                    type="text"
                    id="age"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                  <Input
                    type="date"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    required
                    max={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div>
                  <Label htmlFor="position">Position *</Label>
                  <Input
                    type="text"
                    id="position"
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    type="number"
                    id="weight"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    min="30"
                    max="150"
                    step="0.1"
                    placeholder="75"
                  />
                </div>

                <div>
                  <Label htmlFor="clubTeam">Current Club/Team</Label>
                  <Input
                    type="text"
                    id="clubTeam"
                    name="clubTeam"
                    value={formData.clubTeam}
                    onChange={handleChange}
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
