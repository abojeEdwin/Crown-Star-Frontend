"use client"

import { useParams } from "next/navigation"
import AuthGuard from "@/components/auth-guard"
import PlayerProfile from "@/components/profiles/player-profile"
import ScoutProfile from "@/components/profiles/scout-profile"
import CoachProfile from "@/components/profiles/coach-profile"

export default function ProfilePage() {
  const params = useParams()
  const role = params.role as string

  const renderProfile = () => {
    switch (role) {
      case "player":
        return <PlayerProfile />
      case "scout":
        return <ScoutProfile />
      case "coach":
        return <CoachProfile />
      default:
        return <div>Invalid role</div>
    }
  }

  return <AuthGuard requiredRole={role}>{renderProfile()}</AuthGuard>
}
