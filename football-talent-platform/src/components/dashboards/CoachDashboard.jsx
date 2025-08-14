import DashboardLayout from "../layout/DashboardLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { useAuth } from "../../contexts/AuthContext"
import { Users, Trophy, Calendar, Target, Activity, BarChart3, Clock, Star } from "lucide-react"

export default function CoachDashboard() {
  const { user } = useAuth()

  if (!user) return null

  return (
    <DashboardLayout role="coach">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 text-white shadow-lg">
          <h1 className="text-3xl font-bold mb-2">Welcome back, Coach {user.firstName || 'User'}!</h1>
          <p className="text-green-100 text-lg">Lead your team to victory and develop the next generation of players.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Team Players</CardTitle>
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="h-4 w-4 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">24</div>
              <p className="text-xs text-gray-500 mt-1">Active squad members</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Wins This Season</CardTitle>
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Trophy className="h-4 w-4 text-yellow-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">18</div>
              <p className="text-xs text-gray-500 mt-1">
                <span className="text-green-600">+2</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Training Sessions</CardTitle>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Target className="h-4 w-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">156</div>
              <p className="text-xs text-gray-500 mt-1">Completed this season</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Upcoming Matches</CardTitle>
              <div className="p-2 bg-purple-100 rounded-lg">
                <Calendar className="h-4 w-4 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">4</div>
              <p className="text-xs text-gray-500 mt-1">Next 2 weeks</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <Card className="lg:col-span-2 border-0 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-green-600" />
                Team Activity
              </CardTitle>
              <CardDescription>Recent team updates and player progress</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-green-50 to-green-25 rounded-lg border border-green-100">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">Training session completed - Tactical drills</p>
                  <p className="text-xs text-gray-500 mt-1">2 hours ago • 22 players attended</p>
                </div>
              </div>
              <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-blue-50 to-blue-25 rounded-lg border border-blue-100">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">Player performance review scheduled</p>
                  <p className="text-xs text-gray-500 mt-1">1 day ago • 5 players selected</p>
                </div>
              </div>
              <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-purple-50 to-purple-25 rounded-lg border border-purple-100">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">New player recruitment inquiry</p>
                  <p className="text-xs text-gray-500 mt-1">3 days ago • Midfielder position</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-green-600" />
                Quick Actions
              </CardTitle>
              <CardDescription>Manage your team efficiently</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full bg-green-600 hover:bg-green-700 text-white shadow-sm">
                Schedule Training
              </Button>
              <Button variant="outline" className="w-full border-green-200 text-green-700 hover:bg-green-50">
                View Team Roster
              </Button>
              <Button variant="outline" className="w-full border-green-200 text-green-700 hover:bg-green-50">
                Player Analytics
              </Button>
              <Button variant="outline" className="w-full border-green-200 text-green-700 hover:bg-green-50">
                Scout Players
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Team Performance */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-green-600" />
              Team Performance
            </CardTitle>
            <CardDescription>Key metrics for this season</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
                <div className="text-2xl font-bold text-green-600">45</div>
                <div className="text-sm text-gray-600 mt-1">Goals Scored</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                <div className="text-2xl font-bold text-blue-600">18</div>
                <div className="text-sm text-gray-600 mt-1">Goals Conceded</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                <div className="text-2xl font-bold text-purple-600">78%</div>
                <div className="text-sm text-gray-600 mt-1">Possession Avg</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-200">
                <div className="text-2xl font-bold text-orange-600">2nd</div>
                <div className="text-sm text-gray-600 mt-1">League Position</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
