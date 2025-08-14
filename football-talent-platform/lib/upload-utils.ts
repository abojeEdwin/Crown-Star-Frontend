export const validateImageFile = (file: File, maxSizeMB = 5): { isValid: boolean; error?: string } => {
  // Check file type
  if (!file.type.startsWith("image/")) {
    return {
      isValid: false,
      error: "Please select an image file (JPG, PNG, GIF, etc.)",
    }
  }

  // Check file size
  if (file.size > maxSizeMB * 1024 * 1024) {
    return {
      isValid: false,
      error: `Please select an image smaller than ${maxSizeMB}MB`,
    }
  }

  return { isValid: true }
}

export const createImagePreview = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      resolve(e.target?.result as string)
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export const compressImage = (file: File, maxWidth = 800, quality = 0.8): Promise<File> => {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    const img = new Image()

    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img
      if (width > maxWidth) {
        height = (height * maxWidth) / width
        width = maxWidth
      }

      canvas.width = width
      canvas.height = height

      // Draw and compress
      ctx?.drawImage(img, 0, 0, width, height)
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            })
            resolve(compressedFile)
          } else {
            resolve(file)
          }
        },
        file.type,
        quality,
      )
    }

    img.src = URL.createObjectURL(file)
  })
}

export const uploadToServer = async (
  file: File,
  endpoint: string,
  token: string,
  onProgress?: (progress: number) => void,
): Promise<{ success: boolean; url?: string; error?: string }> => {
  try {
    const formData = new FormData()
    formData.append("profilePicture", file)

    const xhr = new XMLHttpRequest()

    return new Promise((resolve) => {
      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable && onProgress) {
          const progress = (e.loaded / e.total) * 100
          onProgress(progress)
        }
      })

      xhr.addEventListener("load", () => {
        if (xhr.status === 200) {
          try {
            const response = JSON.parse(xhr.responseText)
            resolve({ success: true, url: response.profilePictureUrl })
          } catch {
            resolve({ success: false, error: "Invalid server response" })
          }
        } else {
          resolve({ success: false, error: "Upload failed" })
        }
      })

      xhr.addEventListener("error", () => {
        resolve({ success: false, error: "Network error" })
      })

      xhr.open("POST", endpoint)
      xhr.setRequestHeader("Authorization", `Bearer ${token}`)
      xhr.send(formData)
    })
  } catch (error) {
    return { success: false, error: "Upload failed" }
  }
}
