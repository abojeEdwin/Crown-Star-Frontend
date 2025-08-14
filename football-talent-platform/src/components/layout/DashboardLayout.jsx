import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "../ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { useAuth } from "../../contexts/AuthContext"
import { Settings, LogOut, Upload, Eye, Menu, Crown } from "lucide-react"
import ProfileUploadModal from "../upload/ProfileUploadModal"

export default function DashboardLayout({ children, role }) {
  const navigate = useNavigate()
  const { user, logout, updateUser } = useAuth()
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

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
    setIsMenuOpen(false)
  }

  const handleProfileUpload = () => {
    setShowUploadModal(true)
    setIsMenuOpen(false)
  }

  const handleUploadSuccess = (imageUrl) => {
    updateUser({ profilePicture: imageUrl })
  }

  const handleViewProfile = () => {
    navigate(`/profile/${role}`)
    setIsMenuOpen(false)
  }

  const handleUpdateProfile = () => {
    navigate(`/profile/${role}/edit`)
    setIsMenuOpen(false)
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Hamburger Menu Sidebar */}
      <div className={`
        fixed top-0 right-0 h-full w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50
        ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        <div className="p-6">
          {/* Close Button */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setIsMenuOpen(false)}
              className="h-8 w-8 rounded-full"
            >
              <span className="text-2xl">&times;</span>
            </Button>
          </div>

          {/* User Profile Section */}
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg mb-6">
            <Avatar className="h-16 w-16">
              {user.profilePicture ? (
                <AvatarImage
                  src={user.profilePicture}
                  alt={`${user.firstName} ${user.lastName}`}
                  onError={(e) => {
                    e.target.style.display = 'none'
                  }}
                />
              ) : null}
              <AvatarFallback className={`${getRoleColor(role)} text-lg`}>
                {user.firstName?.[0]}
                {user.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col space-y-1">
              <h3 className="font-semibold text-gray-900">
                {user.firstName} {user.lastName}
              </h3>
              <p className="text-sm text-gray-500">{user.email}</p>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(role)} text-white capitalize w-fit`}>
                {role}
              </span>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-2">
            <button
              onClick={handleViewProfile}
              className="w-full flex items-center px-4 py-3 text-left text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Eye className="mr-3 h-5 w-5" />
              <span className="font-medium">View Profile</span>
            </button>
            
            <button
              onClick={handleUpdateProfile}
              className="w-full flex items-center px-4 py-3 text-left text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Settings className="mr-3 h-5 w-5" />
              <span className="font-medium">Update Profile</span>
            </button>
            
            <button
              onClick={handleProfileUpload}
              className="w-full flex items-center px-4 py-3 text-left text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Upload className="mr-3 h-5 w-5" />
              <span className="font-medium">Upload Picture</span>
            </button>
          </nav>

          {/* Divider */}
          <hr className="my-6" />

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-3 text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="mr-3 h-5 w-5" />
            <span className="font-medium">Log out</span>
          </button>
        </div>
      </div>

      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-cyan-600 rounded-full flex items-center justify-center">
                <Crown className="text-white w-4 h-4" />
              </div>
              <span className="font-bold text-xl text-gray-900">ScoutStar</span>
            </Link>
            <div className="hidden md:block">
              <span className={`text-sm font-medium ${getRoleTextColor(role)} capitalize`}>{role} Dashboard</span>
            </div>
          </div>

          {/* User Info and Hamburger */}
          <div className="flex items-center space-x-3">
            {/* User Info on Desktop */}
            <div className="hidden md:flex items-center space-x-2">
              <Avatar className="h-8 w-8">
                {user.profilePicture ? (
                  <AvatarImage
                    src={user.profilePicture}
                    alt={`${user.firstName} ${user.lastName}`}
                    onError={(e) => {
                      e.target.style.display = 'none'
                    }}
                  />
                ) : null}
                <AvatarFallback className={`${getRoleColor(role)} text-xs`}>
                  {user.firstName?.[0]}
                  {user.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-900">
                  {user.firstName}
                </span>
            
              </div>
            </div>

            {/* Hamburger Button */}
            <Button 
              variant="ghost" 
              className="h-10 w-10 rounded-full flex items-center justify-center hover:bg-gray-100"
              onClick={toggleMenu}
            >
              <span className="sr-only">Open menu</span>
              <Menu className="h-6 w-6" />
            </Button>
          </div>
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
