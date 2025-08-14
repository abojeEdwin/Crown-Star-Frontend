"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Upload, X } from "lucide-react"
import UploadProgress from "./upload-progress"

interface FileUploadItem {
  file: File
  id: string
  progress: number
  status: "pending" | "uploading" | "success" | "error"
  error?: string
}

interface BulkUploadProps {
  onUploadComplete: (urls: string[]) => void
  maxFiles?: number
  maxSize?: number
  acceptedTypes?: string[]
  endpoint: string
  title?: string
  description?: string
}

export default function BulkUpload({
  onUploadComplete,
  maxFiles = 10,
  maxSize = 5,
  acceptedTypes = ["image/jpeg", "image/png", "image/gif"],
  endpoint,
  title = "Upload Files",
  description = "Select multiple files to upload",
}: BulkUploadProps) {
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploadItems, setUploadItems] = useState<FileUploadItem[]>([])
  const [isUploading, setIsUploading] = useState(false)

  const validateFile = (file: File): boolean => {
    if (!acceptedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: `${file.name}: Please select one of: ${acceptedTypes
          .map((type) => type.split("/")[1])
          .join(", ")}`,
        variant: "destructive",
      })
      return false
    }

    if (file.size > maxSize * 1024 * 1024) {
      toast({
        title: "File too large",
        description: `${file.name}: Please select a file smaller than ${maxSize}MB`,
        variant: "destructive",
      })
      return false
    }

    return true
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])

    if (uploadItems.length + files.length > maxFiles) {
      toast({
        title: "Too many files",
        description: `Maximum ${maxFiles} files allowed`,
        variant: "destructive",
      })
      return
    }

    const validFiles = files.filter(validateFile)
    const newItems: FileUploadItem[] = validFiles.map((file) => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      progress: 0,
      status: "pending",
    }))

    setUploadItems((prev) => [...prev, ...newItems])
  }

  const removeFile = (id: string) => {
    setUploadItems((prev) => prev.filter((item) => item.id !== id))
  }

  const uploadFile = async (item: FileUploadItem): Promise<string | null> => {
    return new Promise((resolve) => {
      const formData = new FormData()
      formData.append("file", item.file)

      const xhr = new XMLHttpRequest()

      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) {
          const progress = (e.loaded / e.total) * 100
          setUploadItems((prev) =>
            prev.map((uploadItem) =>
              uploadItem.id === item.id ? { ...uploadItem, progress, status: "uploading" } : uploadItem,
            ),
          )
        }
      })

      xhr.addEventListener("load", () => {
        if (xhr.status === 200) {
          try {
            const response = JSON.parse(xhr.responseText)
            setUploadItems((prev) =>
              prev.map((uploadItem) =>
                uploadItem.id === item.id ? { ...uploadItem, status: "success", progress: 100 } : uploadItem,
              ),
            )
            resolve(response.url)
          } catch {
            setUploadItems((prev) =>
              prev.map((uploadItem) =>
                uploadItem.id === item.id ? { ...uploadItem, status: "error", error: "Invalid response" } : uploadItem,
              ),
            )
            resolve(null)
          }
        } else {
          setUploadItems((prev) =>
            prev.map((uploadItem) =>
              uploadItem.id === item.id ? { ...uploadItem, status: "error", error: "Upload failed" } : uploadItem,
            ),
          )
          resolve(null)
        }
      })

      xhr.addEventListener("error", () => {
        setUploadItems((prev) =>
          prev.map((uploadItem) =>
            uploadItem.id === item.id ? { ...uploadItem, status: "error", error: "Network error" } : uploadItem,
          ),
        )
        resolve(null)
      })

      xhr.open("POST", endpoint)
      xhr.send(formData)
    })
  }

  const handleUploadAll = async () => {
    setIsUploading(true)
    const pendingItems = uploadItems.filter((item) => item.status === "pending")

    const uploadPromises = pendingItems.map(uploadFile)
    const results = await Promise.all(uploadPromises)

    const successfulUrls = results.filter((url): url is string => url !== null)

    setIsUploading(false)
    onUploadComplete(successfulUrls)

    toast({
      title: "Upload Complete",
      description: `${successfulUrls.length} of ${pendingItems.length} files uploaded successfully`,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading || uploadItems.length >= maxFiles}
          >
            <Upload className="w-4 h-4 mr-2" />
            Select Files
          </Button>
          {uploadItems.length > 0 && (
            <Button
              onClick={handleUploadAll}
              disabled={isUploading || uploadItems.every((item) => item.status !== "pending")}
            >
              Upload All ({uploadItems.filter((item) => item.status === "pending").length})
            </Button>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes.join(",")}
          onChange={handleFileSelect}
          className="hidden"
        />

        {uploadItems.length > 0 && (
          <div className="space-y-3">
            {uploadItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                <UploadProgress
                  progress={item.progress}
                  status={item.status}
                  fileName={item.file.name}
                  error={item.error}
                />
                {item.status === "pending" && (
                  <Button variant="ghost" size="sm" onClick={() => removeFile(item.id)}>
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
