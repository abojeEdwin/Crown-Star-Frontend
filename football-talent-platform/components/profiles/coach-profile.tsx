"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getStoredUser, getStoredToken } from "@/lib/auth"
import { Edit, MapPin, Building, Trophy } from "lucide-react"

interface CoachData {
  id: string
  firstName: string
  lastName: string
  email: string
  profilePicture?: string
  club?: string
  experience?: number
  location?: string
  licenses?: string[]
  bio?: string
  stats?: {
    matchesCoached: number
    winRate: number
    playersManaged: number
    trophiesWon: number
  }
}

export default function CoachProfile() {
  const router = useRouter()
  const user = getStoredUser()
  const [coachData, setCoachData] = useState<CoachData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCoachData = async () => {
      try {
        const token = getStoredToken()
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/coach/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.ok) {
          const data = await response.json()
          setCoachData(data)
        } else {
          // Fallback to mock data
          if (user) {
            setCoachData({
              ...user,
              club: "Arsenal Academy",
              experience: 12,
              location: "London, UK",
              licenses: ["UEFA A License", "FA Level 4", "Youth Development Certificate"],
              bio: "Passionate football coach dedicated to developing young talent and implementing modern tactical approaches.",
              stats: {
                matchesCoached: 245,
                winRate: 68,
                playersManaged: 156,
                trophiesWon: 8,
              },
            })
          }
        }
      } catch (error) {
        console.error("Error fetching coach data:", error)
        // Fallback data
        if (user) {
          setCoachData({
            ...user,
            club: "Arsenal Academy",
            experience: 12,
            location: "London, UK",
            licenses: ["UEFA A License", "FA Level 4", "Youth Development Certificate"],
            bio: "Passionate football coach dedicated to developing young talent and implementing modern tactical approaches.",
            stats: {
              matchesCoached: 245,
              winRate: 68,
              playersManaged: 156,
              trophiesWon: 8,
            },
          })
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchCoachData()
  }, [user])

  if (isLoading) {
    return (
      <DashboardLayout role="coach">
        <div className="flex items-center justify-center min-h-96">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
        </div>
      </DashboardLayout>
    )
  }

  if (!coachData) {
    return (
      <DashboardLayout role="coach">
        <div className="text-center py-12">
          <p className="text-gray-500">Profile data not found</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout role="coach">
      <div className="space-y-8">
        {/* Profile Header */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
              <Avatar className="w-24 h-24">
                <AvatarImage
                  src={coachData.profilePicture || "/placeholder.svg"}
                  alt={`${coachData.firstName} ${coachData.lastName}`}
                />
                <AvatarFallback className="bg-green-600 text-white text-2xl">
                  {coachData.firstName[0]}
                  {coachData.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900">
                  Coach {coachData.firstName} {coachData.lastName}
                </h1>
                <p className="text-lg text-green-600 font-medium">Football Coach</p>
                <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Building className="w-4 h-4" />
                    {coachData.club}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {coachData.location}
                  </div>
                  <div>{coachData.experience} years experience</div>
                </div>
              </div>
              <Button onClick={() => router.push("/profile/coach/edit")} className="bg-green-600 hover:bg-green-700">
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Bio */}
            <Card>
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{coachData.bio}</p>
              </CardContent>
            </Card>

            {/* Coaching Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Coaching Statistics</CardTitle>
                <CardDescription>Career coaching performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{coachData.stats?.matchesCoached}</div>
                    <div className="text-sm text-gray-600">Matches Coached</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{coachData.stats?.winRate}%</div>
                    <div className="text-sm text-gray-600">Win Rate</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{coachData.stats?.playersManaged}</div>
                    <div className="text-sm text-gray-600">Players Managed</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">{coachData.stats?.trophiesWon}</div>
                    <div className="text-sm text-gray-600">Trophies Won</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Licenses & Certifications */}
            <Card>
              <CardHeader>
                <CardTitle>Licenses & Certifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {coachData.licenses?.map((license, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <Trophy className="w-5 h-5 text-green-600" />
                      <span className="font-medium">{license}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Professional Info */}
            <Card>
              <CardHeader>
                <CardTitle>Professional Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Experience</span>
                  <span className="font-medium">{coachData.experience} years</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Current Club</span>
                  <span className="font-medium text-sm">{coachData.club}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Location</span>
                  <span className="font-medium text-sm">{coachData.location}</span>
                </div>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Email</span>
                  <span className="font-medium text-sm">{coachData.email}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
