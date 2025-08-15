import { useParams } from "react-router-dom"
import EditPlayerProfile from "../components/profiles/EditPlayerProfile"
import EditScoutProfile from "../components/profiles/EditScoutProfile"
import EditCoachProfile from "../components/profiles/EditCoachProfile"

export default function EditProfileRouter() {
  const { role } = useParams()

  switch (role) {
    case 'player':
      return <EditPlayerProfile />
    case 'scout':
      return <EditScoutProfile />
    case 'coach':
      return <EditCoachProfile />
    default:
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Invalid Role</h1>
            <p className="text-gray-600">The role "{role}" is not recognized.</p>
          </div>
        </div>
      )
  }
}
