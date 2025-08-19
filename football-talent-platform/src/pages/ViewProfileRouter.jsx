import { useParams } from "react-router-dom"
import ViewPlayerProfile from "../components/profiles/ViewPlayerProfile"
import ViewCoachProfile from "../components/profiles/ViewCoachProfile"
import ViewScoutProfile from "../components/profiles/ViewScoutProfile"

export default function ViewProfileRouter() {
  const { role } = useParams()

  switch (role) {
    case 'player':
      return <ViewPlayerProfile />
    case 'coach':
      return <ViewCoachProfile />
    case 'scout':
      return <ViewScoutProfile />
    default:
      return <div>Invalid role</div>
  }
}
