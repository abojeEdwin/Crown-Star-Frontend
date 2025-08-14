"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getStoredUser, getStoredToken } from "@/lib/auth"
import { Edit, MapPin, Calendar, Trophy } from "lucide-react"

interface PlayerData {
  id: string
  firstName: string
  lastName: string
  email: string
  profilePicture?: string
  position?: string
  age?: number
  height?: string
  weight?: string
  club?: string
  nationality?: string
  preferredFoot?: string
  bio?: string
  achievements?: string[]
  stats?: {
    goals: number
    assists: number
    matches: number
    passAccuracy: number
  }
}

export default function PlayerProfile() {
  const router = useRouter()
  const user = getStoredUser()
  const [playerData, setPlayerData] = useState<PlayerData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchPlayerData = async () => {
      try {
        const token = getStoredToken()
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/player/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.ok) {
          const data = await response.json()
          setPlayerData(data)
        } else {
          // Fallback to stored user data if API fails
          if (user) {
            setPlayerData({
              ...user,
              position: "Forward",
              age: 22,
              height: "6'1\"",
              weight: "75kg",
              club: "Manchester United Academy",
              nationality: "England",
              preferredFoot: "Right",
              bio: "Passionate footballer with a strong work ethic and dedication to the game.",
              achievements: ["Top Scorer 2023", "Player of the Month - March 2024"],
              stats: {
                goals: 15,
                assists: 8,
                matches: 23,
                passAccuracy: 92,
              },
            })
          }
        }
      } catch (error) {
        console.error("Error fetching player data:", error)
        // Fallback data
        if (user) {
          setPlayerData({
            ...user,
            position: "Forward",
            age: 22,
            height: "6'1\"",
            weight: "75kg",
            club: "Manchester United Academy",
            nationality: "England",
            preferredFoot: "Right",
            bio: "Passionate footballer with a strong work ethic and dedication to the game.",
            achievements: ["Top Scorer 2023", "Player of the Month - March 2024"],
            stats: {
              goals: 15,
              assists: 8,
              matches: 23,
              passAccuracy: 92,
            },
          })
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchPlayerData()
  }, [user])

  if (isLoading) {
    return (
      <DashboardLayout role="player">
        <div className="flex items-center justify-center min-h-96">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-600"></div>
        </div>
      </DashboardLayout>
    )
  }

  if (!playerData) {
    return (
      <DashboardLayout role="player">
        <div className="text-center py-12">
          <p className="text-gray-500">Profile data not found</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout role="player">
      <div className="space-y-8">
        {/* Profile Header */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
              <Avatar className="w-24 h-24">
                <AvatarImage
                  src={playerData.profilePicture || "/placeholder.svg"}
                  alt={`${playerData.firstName} ${playerData.lastName}`}
                />
                <AvatarFallback className="bg-cyan-600 text-white text-2xl">
                  {playerData.firstName[0]}
                  {playerData.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900">
                  {playerData.firstName} {playerData.lastName}
                </h1>
                <p className="text-lg text-cyan-600 font-medium">{playerData.position}</p>
                <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {playerData.age} years old
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {playerData.nationality}
                  </div>
                  <div>{playerData.club}</div>
                </div>
              </div>
              <Button onClick={() => router.push("/profile/player/edit")} className="bg-cyan-600 hover:bg-cyan-700">
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
                <p className="text-gray-700 leading-relaxed">{playerData.bio}</p>
              </CardContent>
            </Card>

            {/* Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Season Statistics</CardTitle>
                <CardDescription>Current season performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-cyan-50 rounded-lg">
                    <div className="text-2xl font-bold text-cyan-600">{playerData.stats?.goals}</div>
                    <div className="text-sm text-gray-600">Goals</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{playerData.stats?.assists}</div>
                    <div className="text-sm text-gray-600">Assists</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{playerData.stats?.matches}</div>
                    <div className="text-sm text-gray-600">Matches</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">{playerData.stats?.passAccuracy}%</div>
                    <div className="text-sm text-gray-600">Pass Accuracy</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card>
              <CardHeader>
                <CardTitle>Achievements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {playerData.achievements?.map((achievement, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <Trophy className="w-5 h-5 text-yellow-600" />
                      <span className="font-medium">{achievement}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Physical Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Physical Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Height</span>
                  <span className="font-medium">{playerData.height}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Weight</span>
                  <span className="font-medium">{playerData.weight}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Preferred Foot</span>
                  <span className="font-medium">{playerData.preferredFoot}</span>
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
                  <span className="font-medium text-sm">{playerData.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Club</span>
                  <span className="font-medium text-sm">{playerData.club}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
