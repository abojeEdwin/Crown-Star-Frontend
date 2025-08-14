"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getStoredUser, getStoredToken } from "@/lib/auth"
import { Edit, MapPin, Building } from "lucide-react"

interface ScoutData {
  id: string
  firstName: string
  lastName: string
  email: string
  profilePicture?: string
  organization?: string
  experience?: number
  location?: string
  specialization?: string[]
  bio?: string
  stats?: {
    playersScout: number
    reportsSubmitted: number
    successfulRecommendations: number
  }
}

export default function ScoutProfile() {
  const router = useRouter()
  const user = getStoredUser()
  const [scoutData, setScoutData] = useState<ScoutData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchScoutData = async () => {
      try {
        const token = getStoredToken()
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/scout/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.ok) {
          const data = await response.json()
          setScoutData(data)
        } else {
          // Fallback to mock data
          if (user) {
            setScoutData({
              ...user,
              organization: "Manchester United FC",
              experience: 8,
              location: "Manchester, UK",
              specialization: ["Youth Development", "Attacking Players", "Premier League"],
              bio: "Experienced football scout with a keen eye for talent and 8+ years in professional football recruitment.",
              stats: {
                playersScout: 342,
                reportsSubmitted: 156,
                successfulRecommendations: 23,
              },
            })
          }
        }
      } catch (error) {
        console.error("Error fetching scout data:", error)
        // Fallback data
        if (user) {
          setScoutData({
            ...user,
            organization: "Manchester United FC",
            experience: 8,
            location: "Manchester, UK",
            specialization: ["Youth Development", "Attacking Players", "Premier League"],
            bio: "Experienced football scout with a keen eye for talent and 8+ years in professional football recruitment.",
            stats: {
              playersScout: 342,
              reportsSubmitted: 156,
              successfulRecommendations: 23,
            },
          })
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchScoutData()
  }, [user])

  if (isLoading) {
    return (
      <DashboardLayout role="scout">
        <div className="flex items-center justify-center min-h-96">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
        </div>
      </DashboardLayout>
    )
  }

  if (!scoutData) {
    return (
      <DashboardLayout role="scout">
        <div className="text-center py-12">
          <p className="text-gray-500">Profile data not found</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout role="scout">
      <div className="space-y-8">
        {/* Profile Header */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
              <Avatar className="w-24 h-24">
                <AvatarImage
                  src={scoutData.profilePicture || "/placeholder.svg"}
                  alt={`${scoutData.firstName} ${scoutData.lastName}`}
                />
                <AvatarFallback className="bg-purple-600 text-white text-2xl">
                  {scoutData.firstName[0]}
                  {scoutData.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900">
                  {scoutData.firstName} {scoutData.lastName}
                </h1>
                <p className="text-lg text-purple-600 font-medium">Football Scout</p>
                <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Building className="w-4 h-4" />
                    {scoutData.organization}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {scoutData.location}
                  </div>
                  <div>{scoutData.experience} years experience</div>
                </div>
              </div>
              <Button onClick={() => router.push("/profile/scout/edit")} className="bg-purple-600 hover:bg-purple-700">
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
                <p className="text-gray-700 leading-relaxed">{scoutData.bio}</p>
              </CardContent>
            </Card>

            {/* Scouting Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Scouting Statistics</CardTitle>
                <CardDescription>Professional scouting performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{scoutData.stats?.playersScout}</div>
                    <div className="text-sm text-gray-600">Players Scouted</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{scoutData.stats?.reportsSubmitted}</div>
                    <div className="text-sm text-gray-600">Reports Submitted</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {scoutData.stats?.successfulRecommendations}
                    </div>
                    <div className="text-sm text-gray-600">Successful Signings</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Specializations */}
            <Card>
              <CardHeader>
                <CardTitle>Specializations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {scoutData.specialization?.map((spec, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium"
                    >
                      {spec}
                    </span>
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
                  <span className="font-medium">{scoutData.experience} years</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Organization</span>
                  <span className="font-medium text-sm">{scoutData.organization}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Location</span>
                  <span className="font-medium text-sm">{scoutData.location}</span>
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
                  <span className="font-medium text-sm">{scoutData.email}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
