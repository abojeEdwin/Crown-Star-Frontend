"use client"

import { useParams } from "next/navigation"
import AuthGuard from "@/components/auth-guard"
import EditPlayerProfile from "@/components/profiles/edit-player-profile"
import EditScoutProfile from "@/components/profiles/edit-scout-profile"
import EditCoachProfile from "@/components/profiles/edit-coach-profile"

export default function EditProfilePage() {
  const params = useParams()
  const role = params.role as string

  const renderEditProfile = () => {
    switch (role) {
      case "player":
        return <EditPlayerProfile />
      case "scout":
        return <EditScoutProfile />
      case "coach":
        return <EditCoachProfile />
      default:
        return <div>Invalid role</div>
    }
  }

  return <AuthGuard requiredRole={role}>{renderEditProfile()}</AuthGuard>
}
