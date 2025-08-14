"use client"

import { Progress } from "@/components/ui/progress"
import { CheckCircle, XCircle, Upload } from "lucide-react"

interface UploadProgressProps {
  progress: number
  status: "uploading" | "success" | "error"
  fileName?: string
  error?: string
}

export default function UploadProgress({ progress, status, fileName, error }: UploadProgressProps) {
  const getStatusIcon = () => {
    switch (status) {
      case "uploading":
        return <Upload className="w-5 h-5 text-blue-600 animate-pulse" />
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case "error":
        return <XCircle className="w-5 h-5 text-red-600" />
    }
  }

  const getStatusText = () => {
    switch (status) {
      case "uploading":
        return `Uploading... ${Math.round(progress)}%`
      case "success":
        return "Upload complete!"
      case "error":
        return error || "Upload failed"
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case "uploading":
        return "text-blue-600"
      case "success":
        return "text-green-600"
      case "error":
        return "text-red-600"
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-3">
        {getStatusIcon()}
        <div className="flex-1">
          <p className="text-sm font-medium">{fileName}</p>
          <p className={`text-xs ${getStatusColor()}`}>{getStatusText()}</p>
        </div>
      </div>
      {status === "uploading" && <Progress value={progress} className="w-full" />}
    </div>
  )
}
