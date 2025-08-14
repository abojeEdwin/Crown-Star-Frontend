"use client"

import DashboardLayout from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getStoredUser } from "@/lib/auth"
import { Users, Calendar, Trophy, Target } from "lucide-react"

export default function CoachDashboard() {
  const user = getStoredUser()

  if (!user) return null

  return (
    <DashboardLayout role="coach">
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
          <h1 className="text-3xl font-bold mb-2">Welcome back, Coach {user.firstName}!</h1>
          <p className="text-green-100">Manage your team and develop the next generation of talent.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Team Players</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">28</div>
              <p className="text-xs text-muted-foreground">Active squad members</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Matches Won</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">15</div>
              <p className="text-xs text-muted-foreground">This season</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Training Sessions</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">42</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Goals Scored</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">67</div>
              <p className="text-xs text-muted-foreground">Team total</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Team Roster */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Team Roster</CardTitle>
              <CardDescription>Your current squad and their status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
                    JC
                  </div>
                  <div>
                    <p className="font-medium">James Carter</p>
                    <p className="text-sm text-muted-foreground">Captain • Forward</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className="bg-green-100 text-green-800">Available</Badge>
                  <Button size="sm" variant="outline">
                    View
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                    RB
                  </div>
                  <div>
                    <p className="font-medium">Robert Brown</p>
                    <p className="text-sm text-muted-foreground">Midfielder</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className="bg-yellow-100 text-yellow-800">Injured</Badge>
                  <Button size="sm" variant="outline">
                    View
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    DW
                  </div>
                  <div>
                    <p className="font-medium">David Wilson</p>
                    <p className="text-sm text-muted-foreground">Defender</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className="bg-green-100 text-green-800">Available</Badge>
                  <Button size="sm" variant="outline">
                    View
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Team management tools</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full bg-green-600 hover:bg-green-700">Schedule Training</Button>
              <Button variant="outline" className="w-full bg-transparent">
                Plan Match Strategy
              </Button>
              <Button variant="outline" className="w-full bg-transparent">
                Review Player Stats
              </Button>
              <Button variant="outline" className="w-full bg-transparent">
                Contact Scout
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Schedule */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Schedule</CardTitle>
            <CardDescription>Your team's upcoming matches and training sessions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex flex-col items-center justify-center">
                    <div className="text-xs text-green-600 font-medium">MAR</div>
                    <div className="text-sm font-bold text-green-800">15</div>
                  </div>
                  <div>
                    <p className="font-medium">vs Arsenal Academy</p>
                    <p className="text-sm text-muted-foreground">Home Match • 3:00 PM</p>
                  </div>
                </div>
                <Badge variant="outline">Match</Badge>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex flex-col items-center justify-center">
                    <div className="text-xs text-blue-600 font-medium">MAR</div>
                    <div className="text-sm font-bold text-blue-800">17</div>
                  </div>
                  <div>
                    <p className="font-medium">Tactical Training</p>
                    <p className="text-sm text-muted-foreground">Training Ground • 10:00 AM</p>
                  </div>
                </div>
                <Badge variant="outline">Training</Badge>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex flex-col items-center justify-center">
                    <div className="text-xs text-purple-600 font-medium">MAR</div>
                    <div className="text-sm font-bold text-purple-800">20</div>
                  </div>
                  <div>
                    <p className="font-medium">vs Chelsea Youth</p>
                    <p className="text-sm text-muted-foreground">Away Match • 2:00 PM</p>
                  </div>
                </div>
                <Badge variant="outline">Match</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
