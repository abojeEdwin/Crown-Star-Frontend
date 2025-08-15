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

export default function EditCoachProfile() {
  const navigate = useNavigate()
  const { user, updateUser } = useAuth()
  const { toast } = useToastContext()
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: user?.location || '',
    bio: user?.bio || '',
    // Coach-specific fields
    currentTeam: user?.currentTeam || '',
    coachingLevel: user?.coachingLevel || '',
    experience: user?.experience || '',
    licenseLevel: user?.licenseLevel || '',
    specializations: user?.specializations || '',
    achievements: user?.achievements || '',
    philosophy: user?.philosophy || '',
    formationsUsed: user?.formationsUsed || '',
    languagesSpoken: user?.languagesSpoken || ''
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
      const response = await fetchWithRetry(`${API_BASE_URL}/coach/profile`, {
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
          description: "Coach profile updated successfully!",
          variant: "success",
        })
        
        navigate('/dashboard/coach')
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
            onClick={() => navigate('/dashboard/coach')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Edit Coach Profile
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
                  <Label htmlFor="currentTeam">Current Team/Club</Label>
                  <Input
                    id="currentTeam"
                    name="currentTeam"
                    value={formData.currentTeam}
                    onChange={handleChange}
                    placeholder="Club or team you currently coach"
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
                    placeholder="10"
                  />
                </div>
                
                <div>
                  <Label htmlFor="coachingLevel">Coaching Level</Label>
                  <select
                    id="coachingLevel"
                    name="coachingLevel"
                    value={formData.coachingLevel}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="">Select Level</option>
                    <option value="youth">Youth Coach</option>
                    <option value="amateur">Amateur Coach</option>
                    <option value="semi-professional">Semi-Professional</option>
                    <option value="professional">Professional</option>
                    <option value="international">International</option>
                  </select>
                </div>
                
                <div>
                  <Label htmlFor="licenseLevel">License Level</Label>
                  <select
                    id="licenseLevel"
                    name="licenseLevel"
                    value={formData.licenseLevel}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="">Select License</option>
                    <option value="uefa-c">UEFA C License</option>
                    <option value="uefa-b">UEFA B License</option>
                    <option value="uefa-a">UEFA A License</option>
                    <option value="uefa-pro">UEFA Pro License</option>
                    <option value="other">Other Certification</option>
                  </select>
                </div>
              </div>
              
              {/* Text Areas */}
              <div>
                <Label htmlFor="bio">Professional Bio</Label>
                <Textarea
                  id="bio"
                  name="bio"
                  rows={4}
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Describe your coaching background and experience..."
                />
              </div>
              
              <div>
                <Label htmlFor="philosophy">Coaching Philosophy</Label>
                <Textarea
                  id="philosophy"
                  name="philosophy"
                  rows={4}
                  value={formData.philosophy}
                  onChange={handleChange}
                  placeholder="Describe your approach to coaching and player development..."
                />
              </div>
              
              <div>
                <Label htmlFor="specializations">Specializations</Label>
                <Textarea
                  id="specializations"
                  name="specializations"
                  rows={3}
                  value={formData.specializations}
                  onChange={handleChange}
                  placeholder="What aspects of the game do you specialize in? (Tactics, Youth Development, etc.)"
                />
              </div>
              
              <div>
                <Label htmlFor="achievements">Achievements</Label>
                <Textarea
                  id="achievements"
                  name="achievements"
                  rows={3}
                  value={formData.achievements}
                  onChange={handleChange}
                  placeholder="Major achievements, titles, awards, and recognition..."
                />
              </div>
              
              <div>
                <Label htmlFor="formationsUsed">Preferred Formations</Label>
                <Input
                  id="formationsUsed"
                  name="formationsUsed"
                  value={formData.formationsUsed}
                  onChange={handleChange}
                  placeholder="4-3-3, 4-2-3-1, 3-5-2, etc."
                />
              </div>
              
              <div>
                <Label htmlFor="languagesSpoken">Languages Spoken</Label>
                <Input
                  id="languagesSpoken"
                  name="languagesSpoken"
                  value={formData.languagesSpoken}
                  onChange={handleChange}
                  placeholder="English, Spanish, Portuguese, etc."
                />
              </div>
              
              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/dashboard/coach')}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-green-600 hover:bg-green-700"
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
