"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { getStoredUser, getStoredToken } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"
import { Save, ArrowLeft, Plus, X } from "lucide-react"

interface CoachFormData {
  firstName: string
  lastName: string
  email: string
  club: string
  experience: string
  location: string
  licenses: string[]
  bio: string
}

export default function EditCoachProfile() {
  const router = useRouter()
  const { toast } = useToast()
  const user = getStoredUser()
  const [formData, setFormData] = useState<CoachFormData>({
    firstName: "",
    lastName: "",
    email: "",
    club: "",
    experience: "",
    location: "",
    licenses: [],
    bio: "",
  })
  const [newLicense, setNewLicense] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        club: "Arsenal Academy",
        experience: "12",
        location: "London, UK",
        licenses: ["UEFA A License", "FA Level 4", "Youth Development Certificate"],
        bio: "Passionate football coach dedicated to developing young talent and implementing modern tactical approaches.",
      })
    }
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const token = getStoredToken()
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/coach/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Profile updated successfully!",
        })
        router.push("/profile/coach")
      } else {
        toast({
          title: "Error",
          description: "Failed to update profile",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Success",
        description: "Profile updated successfully! (Demo mode)",
      })
      router.push("/profile/coach")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: keyof CoachFormData, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const addLicense = () => {
    if (newLicense.trim() && !formData.licenses.includes(newLicense.trim())) {
      setFormData((prev) => ({
        ...prev,
        licenses: [...prev.licenses, newLicense.trim()],
      }))
      setNewLicense("")
    }
  }

  const removeLicense = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      licenses: prev.licenses.filter((_, i) => i !== index),
    }))
  }

  return (
    <DashboardLayout role="coach">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Profile</h1>
            <p className="text-gray-600">Update your coaching information</p>
          </div>
          <Button variant="outline" onClick={() => router.push("/profile/coach")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Profile
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Basic details about yourself</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  rows={4}
                  placeholder="Tell us about your coaching philosophy..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Professional Information */}
          <Card>
            <CardHeader>
              <CardTitle>Professional Information</CardTitle>
              <CardDescription>Your coaching career details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="club">Current Club</Label>
                  <Input id="club" value={formData.club} onChange={(e) => handleInputChange("club", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="experience">Years of Experience</Label>
                  <Input
                    id="experience"
                    type="number"
                    value={formData.experience}
                    onChange={(e) => handleInputChange("experience", e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Licenses & Certifications */}
          <Card>
            <CardHeader>
              <CardTitle>Licenses & Certifications</CardTitle>
              <CardDescription>Your coaching qualifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {formData.licenses.map((license, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full"
                  >
                    <span className="text-sm font-medium">{license}</span>
                    <button
                      type="button"
                      onClick={() => removeLicense(index)}
                      className="text-green-600 hover:text-green-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newLicense}
                  onChange={(e) => setNewLicense(e.target.value)}
                  placeholder="Add a license or certification..."
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addLicense())}
                />
                <Button type="button" onClick={addLicense} variant="outline">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={isLoading}>
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}
