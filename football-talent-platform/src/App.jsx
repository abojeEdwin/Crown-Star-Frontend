import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./contexts/AuthContext"
import { ToastProvider } from "./contexts/ToastContext"
import { Toaster } from "./components/ui/toaster"
import LandingPage from "./pages/LandingPage"
import SignupPage from "./pages/SignupPage"
import LoginPage from "./pages/LoginPage"
import Dashboard from "./pages/Dashboard"
import Profile from "./pages/Profile"
import EditProfileRouter from "./pages/EditProfileRouter"
import AuthGuard from "./components/AuthGuard"

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <div className="min-h-screen bg-background">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route
                path="/dashboard/:role"
                element={
                  <AuthGuard>
                    <Dashboard />
                  </AuthGuard>
                }
              />
              <Route
                path="/profile/:role"
                element={
                  <AuthGuard>
                    <Profile />
                  </AuthGuard>
                }
              />
              <Route
                path="/profile/:role/edit"
                element={
                  <AuthGuard>
                    <EditProfileRouter />
                  </AuthGuard>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <Toaster />
          </div>
        </Router>
      </ToastProvider>
    </AuthProvider>
  )
}

export default App
