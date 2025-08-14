import { Link } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Users, Target, Trophy, ArrowRight, Crown } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="border-b bg-white/95 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-sm">
              <Crown className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl text-gray-800">ScoutStar</span>
          </Link>
          <div className="flex items-center space-x-4">
            <Link to="/login">
              <Button variant="ghost" className="text-gray-600 hover:text-gray-800 hover:bg-gray-100">Sign In</Button>
            </Link>
            <Link to="/signup">
              <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section 
    
        className="py-20 px-4 bg-cover bg-center bg-no-repeat relative"
        style={{
          backgroundImage: "url('/connor-coyne-OgqWLzWRSaI-unsplash.jpg')"
        }}
      >
        {/* Optional overlay for better text readability */}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        
        <div className="container mx-auto text-center relative z-10">
          <h1 className="text-5xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
            Connect Football
            <span className="text-blue-300"> Talent</span>
            <br />
            with Opportunity
          </h1>
          <p className="text-xl text-gray-100 mb-8 max-w-2xl mx-auto drop-shadow">
            The premier platform connecting players, scouts, and coaches in the world of football. Discover talent,
            build careers, and shape the future of the game.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup?role=player">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto text-white shadow-lg">
                Join as Player
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/signup?role=scout">
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700 w-full sm:w-auto text-white shadow-lg">
                Join as Scout
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/signup?role=coach">
              <Button size="lg" className="bg-green-600 hover:bg-green-700 w-full sm:w-auto text-white shadow-lg">
                Join as Coach
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Built for Every Role in Football</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-blue-600">For Players</CardTitle>
                <CardDescription>
                  Showcase your skills, connect with scouts, and advance your football career
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Create detailed player profiles</li>
                  <li>• Upload performance videos</li>
                  <li>• Connect with scouts and coaches</li>
                  <li>• Track career progress</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-purple-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle className="text-purple-600">For Scouts</CardTitle>
                <CardDescription>Discover emerging talent and build your scouting network</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Advanced player search filters</li>
                  <li>• Performance analytics</li>
                  <li>• Talent tracking tools</li>
                  <li>• Direct player communication</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-r from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trophy className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-green-600">For Coaches</CardTitle>
                <CardDescription>Build winning teams and develop player potential</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Team management tools</li>
                  <li>• Player development tracking</li>
                  <li>• Recruitment assistance</li>
                  <li>• Performance insights</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to Transform Your Football Journey?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of players, scouts, and coaches already using ScoutStar to advance their careers.
          </p>
          <Link to="/signup">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 shadow-lg">
              Get Started Today
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-sm">
              <Crown className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl">ScoutStar</span>
          </div>
          <p className="text-gray-400">© 2024 ScoutStar. Connecting talent with opportunity.</p>
        </div>
      </footer>
    </div>
  )
}
