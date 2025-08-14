import { useParams } from "react-router-dom"
import PlayerDashboard from "../components/dashboards/PlayerDashboard"
import ScoutDashboard from "../components/dashboards/ScoutDashboard"
import CoachDashboard from "../components/dashboards/CoachDashboard"

export default function Dashboard() {
  const { role } = useParams()

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

  return renderDashboard()
}
