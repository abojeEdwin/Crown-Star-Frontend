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

export default function EditScoutProfile() {
  const navigate = useNavigate()
  const { user, updateUser } = useAuth()
  const { toast } = useToastContext()
  
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    userName: user?.userName || '',
    organisation: user?.organisation || '',
    phone: user?.phone || '',
    email: user?.email || '',
    // Scout-specific fields
    bio: user?.bio || '',
    location: user?.location || '',
    experience: user?.experience || '',
    specialization: user?.specialization || '',
    certifications: user?.certifications || ''
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
      const scoutId = user?.id
      if (!scoutId) {
        throw new Error('Scout ID not found. Please log in again.')
      }

      // Format and validate the data
      const formattedData = {
        ...formData,
        // Remove any undefined or empty string values
        ...Object.fromEntries(
          Object.entries(formData).filter(([_, value]) => 
            value !== undefined && value !== ''
          )
        )
      }

      // Log the formatted data
      console.log('Formatted data being sent:', formattedData)

      const result = await updateProfileData('scout', localStorage.getItem('token'), scoutId, formattedData)

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
        description: "Scout profile updated successfully!",
        variant: "success",
      })
      
      navigate('/dashboard/scout')
    } catch (error) {
      console.error('Profile update error:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to update profile. Please try again.",
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
            onClick={() => navigate('/dashboard/scout')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Edit Scout Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
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
                  <Label htmlFor="organisation">Organization *</Label>
                  <Input
                    type="text"
                    id="organisation"
                    name="organisation"
                    value={formData.organisation}
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
                    pattern="[0-9+\-\s()]+"
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email *</Label>
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
                  <Label htmlFor="specialization">Specialization</Label>
                  <Input
                    type="text"
                    id="specialization"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleChange}
                    placeholder="e.g., Youth Development, Professional Scouting"
                  />
                </div>

                <div>
                  <Label htmlFor="experience">Years of Experience</Label>
                  <Input
                    type="number"
                    id="experience"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    min="0"
                    max="50"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="certifications">Certifications</Label>
                <Textarea
                  id="certifications"
                  name="certifications"
                  value={formData.certifications}
                  onChange={handleChange}
                  placeholder="List your relevant certifications..."
                  rows={2}
                />
              </div>
              
              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Tell us about your experience and approach to scouting..."
                  rows={4}
                />
              </div>
              
              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/dashboard/scout')}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-purple-600 hover:bg-purple-700"
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
