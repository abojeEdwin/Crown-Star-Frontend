import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import { Button } from "../ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Badge } from "../ui/badge"
import { ArrowLeft, Edit, MapPin, Phone, Calendar, Target, Ruler, Weight, Loader2 } from "lucide-react"
import { fetchProfileData } from "../../lib/utils"

export default function ViewPlayerProfile() {
  const navigate = useNavigate()
  const { user, token } = useAuth()
  const [profileData, setProfileData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadProfileData = async () => {
      if (!token || !user?.id) {
        setLoading(false)
        setProfileData(user) // Use context data if no token or user ID
        return
      }

      try {
        setLoading(true)
        setError(null)
        const data = await fetchProfileData('player', token, user.id)
        setProfileData(data || user) // Fallback to context user if no data
      } catch (err) {
        console.error('Failed to load profile data:', err)
        setError(err.message)
        setProfileData(user) // Fallback to context user on error
      } finally {
        setLoading(false)
      }
    }

    loadProfileData()
  }, [token, user])

  if (!user) return null

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-cyan-600" />
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  const displayData = profileData || user

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
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-4">
              <p className="text-sm">Failed to load latest profile data: {error}</p>
              <p className="text-xs mt-1">Showing cached data instead.</p>
            </div>
          )}
        </div>

        {/* Profile Header */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <Avatar className="h-32 w-32">
                {displayData.profilePicture ? (
                  <AvatarImage
                    src={displayData.profilePicture}
                    alt={`${displayData.fullName || displayData.firstName + ' ' + displayData.lastName}`}
                  />
                ) : null}
                <AvatarFallback className="bg-cyan-600 text-white text-2xl">
                  {displayData.firstName?.[0]}{displayData.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {displayData.fullName || `${displayData.firstName} ${displayData.lastName}`}
                </h1>
                <p className="text-xl text-gray-600 mb-3">@{displayData.userName}</p>
                
                <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
                  <Badge className="bg-cyan-600 hover:bg-cyan-700">Player</Badge>
                  {displayData.position && (
                    <Badge variant="outline" className="border-cyan-200 text-cyan-700">
                      <Target className="h-3 w-3 mr-1" />
                      {displayData.position}
                    </Badge>
                  )}
                  {displayData.clubTeam && (
                    <Badge variant="outline" className="border-cyan-200 text-cyan-700">
                      {displayData.clubTeam}
                    </Badge>
                  )}
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-gray-600 justify-center md:justify-start">
                  {displayData.location && (
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {displayData.location}
                    </div>
                  )}
                  {displayData.phone && (
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-1" />
                      {displayData.phone}
                    </div>
                  )}
                  {displayData.age && (
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {displayData.age} years old
                    </div>
                  )}
                </div>
              </div>

              <Button 
                onClick={() => navigate('/profile/player/edit')}
                className="bg-cyan-600 hover:bg-cyan-700"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Profile Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Player Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-900">
                Player Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Position</h4>
                <p className="text-gray-600 capitalize">{displayData.position || 'Not specified'}</p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Current Club</h4>
                <p className="text-gray-600">{displayData.clubTeam || 'Not specified'}</p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Date of Birth</h4>
                <p className="text-gray-600">{displayData.dateOfBirth || 'Not specified'}</p>
              </div>
            </CardContent>
          </Card>

          {/* Bio */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-900">
                About Me
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 leading-relaxed">
                {displayData.bio || 'No bio available.'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Physical Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <Card className="text-center p-6">
            <div className="flex items-center justify-center mb-2">
              <Ruler className="h-6 w-6 text-cyan-600" />
            </div>
            <div className="text-2xl font-bold text-cyan-600 mb-1">
              {displayData.height ? `${displayData.height}cm` : '--'}
            </div>
            <div className="text-sm text-gray-600">Height</div>
          </Card>
          
          <Card className="text-center p-6">
            <div className="flex items-center justify-center mb-2">
              <Weight className="h-6 w-6 text-cyan-600" />
            </div>
            <div className="text-2xl font-bold text-cyan-600 mb-1">
              {displayData.weight ? `${displayData.weight}kg` : '--'}
            </div>
            <div className="text-sm text-gray-600">Weight</div>
          </Card>
          
          <Card className="text-center p-6">
            <div className="text-2xl font-bold text-cyan-600 mb-1">
              {displayData.age || '--'}
            </div>
            <div className="text-sm text-gray-600">Age</div>
          </Card>
          
          <Card className="text-center p-6">
            <div className="text-2xl font-bold text-cyan-600 mb-1">4.5</div>
            <div className="text-sm text-gray-600">Rating</div>
          </Card>
        </div>
      </div>
    </div>
  )
}
