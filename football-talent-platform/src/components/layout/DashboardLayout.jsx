"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "../ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { useAuth } from "../../contexts/AuthContext"
import { Settings, LogOut, Upload, Eye } from "lucide-react"
import ProfileUploadModal from "../upload/ProfileUploadModal"

export default function DashboardLayout({ children, role }) {
  const navigate = useNavigate()
  const { user, logout, updateUser } = useAuth()
  const [showUploadModal, setShowUploadModal] = useState(false)

  const getRoleColor = (userRole) => {
    switch (userRole) {
      case "player":
        return "bg-cyan-600"
      case "scout":
        return "bg-purple-600"
      case "coach":
        return "bg-green-600"
      default:
        return "bg-gray-600"
    }
  }

  const getRoleTextColor = (userRole) => {
    switch (userRole) {
      case "player":
        return "text-cyan-600"
      case "scout":
        return "text-purple-600"
      case "coach":
        return "text-green-600"
      default:
        return "text-gray-600"
    }
  }

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  const handleProfileUpload = () => {
    setShowUploadModal(true)
  }

  const handleUploadSuccess = (imageUrl) => {
    updateUser({ profilePicture: imageUrl })
  }

  const handleViewProfile = () => {
    navigate(`/profile/${role}`)
  }

  const handleUpdateProfile = () => {
    navigate(`/profile/${role}/edit`)
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-cyan-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">FT</span>
              </div>
              <span className="font-bold text-xl text-gray-900">FootballTalent</span>
            </Link>
            <div className="hidden md:block">
              <span className={`text-sm font-medium ${getRoleTextColor(role)} capitalize`}>{role} Dashboard</span>
            </div>
          </div>

          {/* Profile Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={user.profilePicture || "/placeholder.svg?height=40&width=40&query=profile"}
                    alt={`${user.firstName} ${user.lastName}`}
                  />
                  <AvatarFallback className={getRoleColor(role)}>
                    {user.firstName?.[0]}
                    {user.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  <p className="font-medium">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="w-[200px] truncate text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleViewProfile}>
                <Eye className="mr-2 h-4 w-4" />
                View Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleUpdateProfile}>
                <Settings className="mr-2 h-4 w-4" />
                Update Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleProfileUpload}>
                <Upload className="mr-2 h-4 w-4" />
                Upload Picture
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">{children}</main>

      <ProfileUploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUploadSuccess={handleUploadSuccess}
      />
    </div>
  )
}
