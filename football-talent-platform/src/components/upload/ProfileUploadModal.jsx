import { useState } from "react"
import { Button } from "../ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Upload, X, Check } from "lucide-react"
import { API_BASE_URL } from "../../lib/utils"
import { useToast } from "../../hooks/use-toast"

export default function ProfileUploadModal({ isOpen, onClose, onUploadSuccess }) {
  const [selectedFile, setSelectedFile] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [preview, setPreview] = useState(null)
  const { toast } = useToast()

  const handleFileSelect = (event) => {
    const file = event.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "File size must be less than 5MB",
          variant: "destructive",
        })
        return
      }

      if (!file.type.startsWith("image/")) {
        toast({
          title: "Error",
          description: "Please select an image file",
          variant: "destructive",
        })
        return
      }

      setSelectedFile(file)
      const reader = new FileReader()
      reader.onload = (e) => setPreview(e.target.result)
      reader.readAsDataURL(file)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    setIsUploading(true)

    try {
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 2000))

      // For now, create a local blob URL for the uploaded image
      const imageUrl = URL.createObjectURL(selectedFile)
      
      // Store the image URL in localStorage to persist across sessions
      const user = JSON.parse(localStorage.getItem("user") || "{}")
      user.profilePicture = imageUrl
      localStorage.setItem("user", JSON.stringify(user))

      toast({
        title: "Success",
        description: "Profile picture uploaded successfully! (Demo mode)",
      })
      onUploadSuccess(imageUrl)
      handleClose()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleClose = () => {
    setSelectedFile(null)
    setPreview(null)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Upload Profile Picture</CardTitle>
            <Button variant="ghost" size="sm" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <CardDescription>Choose a new profile picture to upload</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {preview ? (
            <div className="text-center">
              <img
                src={preview || "/placeholder.svg"}
                alt="Preview"
                className="w-32 h-32 rounded-full mx-auto object-cover"
              />
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-sm text-gray-600">Click to select an image</p>
            </div>
          )}

          <input type="file" accept="image/*" onChange={handleFileSelect} className="w-full p-2 border rounded-lg" />

          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleClose} className="flex-1 bg-transparent">
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              disabled={!selectedFile || isUploading}
              className="flex-1 bg-cyan-600 hover:bg-cyan-700"
            >
              {isUploading ? "Uploading..." : "Upload"}
              {!isUploading && <Check className="ml-2 h-4 w-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
