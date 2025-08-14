"use client"

import { useParams } from "next/navigation"
import AuthGuard from "@/components/auth-guard"
import PlayerDashboard from "@/components/dashboards/player-dashboard"
import ScoutDashboard from "@/components/dashboards/scout-dashboard"
import CoachDashboard from "@/components/dashboards/coach-dashboard"

export default function DashboardPage() {
  const params = useParams()
  const role = params.role as string

  const renderDashboard = () => {
    switch (role) {
      case "player":
        return <PlayerDashboard />
      case "scout":
        return <ScoutDashboard />
      case "coach":
        return <CoachDashboard />
      default:
        return <div>Invalid role</div>
    }
  }

  return <AuthGuard requiredRole={role}>{renderDashboard()}</AuthGuard>
}
