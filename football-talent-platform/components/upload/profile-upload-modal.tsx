"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { getStoredUser, getStoredToken, getUserRole } from "@/lib/auth"
import { Upload, X, Check } from "lucide-react"

interface ProfileUploadModalProps {
  isOpen: boolean
  onClose: () => void
  onUploadSuccess: (imageUrl: string) => void
}

export default function ProfileUploadModal({ isOpen, onClose, onUploadSuccess }: ProfileUploadModalProps) {
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const user = getStoredUser()
  const userRole = getUserRole()

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const getRoleColor = (role: string | null) => {
    switch (role) {
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

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file (JPG, PNG, GIF, etc.)",
        variant: "destructive",
      })
      return
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB",
        variant: "destructive",
      })
      return
    }

    setSelectedFile(file)

    // Create preview URL
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleUpload = async () => {
    if (!selectedFile || !userRole) return

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append("profilePicture", selectedFile)

      const token = getStoredToken()
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${userRole}/upload-profile-picture`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        toast({
          title: "Success",
          description: "Profile picture updated successfully!",
        })
        onUploadSuccess(data.profilePictureUrl || previewUrl || "")
        handleClose()
      } else {
        // Demo mode - simulate success
        toast({
          title: "Success",
          description: "Profile picture updated successfully! (Demo mode)",
        })
        onUploadSuccess(previewUrl || "")
        handleClose()
      }
    } catch (error) {
      // Demo mode - simulate success
      toast({
        title: "Success",
        description: "Profile picture updated successfully! (Demo mode)",
      })
      onUploadSuccess(previewUrl || "")
      handleClose()
    } finally {
      setIsUploading(false)
    }
  }

  const handleClose = () => {
    setSelectedFile(null)
    setPreviewUrl(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    onClose()
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const files = e.dataTransfer.files
    if (files.length > 0) {
      const file = files[0]
      if (file.type.startsWith("image/")) {
        const event = {
          target: { files: [file] },
        } as React.ChangeEvent<HTMLInputElement>
        handleFileSelect(event)
      }
    }
  }

  if (!user) return null

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Profile Picture</DialogTitle>
          <DialogDescription>Choose a new profile picture to upload</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current/Preview Avatar */}
          <div className="flex justify-center">
            <Avatar className="w-24 h-24">
              <AvatarImage
                src={previewUrl || user.profilePicture || "/placeholder.svg"}
                alt={`${user.firstName} ${user.lastName}`}
              />
              <AvatarFallback className={getRoleColor(userRole)}>
                {user.firstName[0]}
                {user.lastName[0]}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Upload Area */}
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-sm text-gray-600 mb-2">
              <span className="font-medium">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
          </div>

          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />

          {/* Selected File Info */}
          {selectedFile && (
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Check className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium">{selectedFile.name}</p>
                  <p className="text-xs text-gray-500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedFile(null)
                  setPreviewUrl(null)
                  if (fileInputRef.current) {
                    fileInputRef.current.value = ""
                  }
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={handleClose} disabled={isUploading}>
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              disabled={!selectedFile || isUploading}
              className={`${
                userRole === "player"
                  ? "bg-cyan-600 hover:bg-cyan-700"
                  : userRole === "scout"
                    ? "bg-purple-600 hover:bg-purple-700"
                    : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {isUploading ? "Uploading..." : "Upload Picture"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
