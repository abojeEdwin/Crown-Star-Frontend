import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export const API_BASE_URL = "/api"

export const roleColors = {
  player: {
    primary: "bg-cyan-600 hover:bg-cyan-700",
    secondary: "bg-cyan-50 text-cyan-700 border-cyan-200",
    accent: "text-cyan-600",
    gradient: "from-cyan-500 to-blue-600",
  },
  scout: {
    primary: "bg-purple-600 hover:bg-purple-700",
    secondary: "bg-purple-50 text-purple-700 border-purple-200",
    accent: "text-purple-600",
    gradient: "from-purple-500 to-indigo-600",
  },
  coach: {
    primary: "bg-green-600 hover:bg-green-700",
    secondary: "bg-green-50 text-green-700 border-green-200",
    accent: "text-green-600",
    gradient: "from-green-500 to-emerald-600",
  },
}

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePassword = (password) => {
  return password.length >= 8
}

export const fetchWithTimeout = async (url, options = {}, timeout = 10000) => {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    })
    clearTimeout(timeoutId)
    return response
  } catch (error) {
    clearTimeout(timeoutId)
    if (error.name === "AbortError") {
      throw new Error(
        "Request timeout - the server might be starting up. Please try again."
      )
    }
    throw error
  }
}

export const fetchWithRetry = async (url, options = {}, maxRetries = 2) => {
  let lastError = null

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      // Standard timeouts for production use
      const timeout = 10000 + attempt * 5000 // 10s, 15s, 20s
      return await fetchWithTimeout(url, options, timeout)
    } catch (error) {
      lastError = error

      if (attempt < maxRetries) {
        // Wait before retrying
        const delay = Math.pow(2, attempt) * 1000 // 1s, 2s, 4s
        await new Promise((resolve) => setTimeout(resolve, delay))
        console.log(`Retry attempt ${attempt + 1} for ${url}`)
      }
    }
  }

  throw lastError
}
