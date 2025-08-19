import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export const API_BASE_URL = "https://crown-star.onrender.com/api"

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
        "Request timeout - There was a delay.Please try again."
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

// Fetch profile data for a specific role
export const fetchProfileData = async (role, token, userId) => {
  try {
    // Define possible endpoint patterns for each role
    const endpointPatterns = {
      player: [
        `${API_BASE_URL}/player/viewPlayerProfile/${userId}`,
    
      ],
      coach: [
        `${API_BASE_URL}/coach/viewCoachProfile/${userId}`,
    
      ],
      scout: [
        `${API_BASE_URL}/scout/viewScoutProfile/${userId}`,
      ]
    }

    const endpoints = endpointPatterns[role]
    if (!endpoints) {
      throw new Error(`Invalid role: ${role}`)
    }

    let lastError = null

    // Try each endpoint pattern until one works
    for (const endpoint of endpoints) {
      try {
        console.log(`Trying endpoint: ${endpoint}`)
        
        const response = await fetchWithRetry(endpoint, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })

        if (response.ok) {
          const text = await response.text()
          
          if (!text || text.trim() === '') {
            console.warn('Empty response received from profile endpoint')
            continue // Try next endpoint
          }

          try {
            const data = JSON.parse(text)
            console.log('Profile data fetched successfully from:', endpoint, data)
            return data
          } catch (parseError) {
            console.error('Failed to parse profile response as JSON:', text)
            continue // Try next endpoint
          }
        } else if (response.status === 404) {
          console.log(`Endpoint not found: ${endpoint}`)
          continue // Try next endpoint
        } else {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }
      } catch (error) {
        console.log(`Failed to fetch from ${endpoint}:`, error.message)
        lastError = error
        continue // Try next endpoint
      }
    }

    // If we get here, all endpoints failed
    throw lastError || new Error(`No working endpoint found for ${role} profile`)

  } catch (error) {
    console.error('Error fetching profile data:', error)
    throw error
  }
}

// Update profile data for a specific role
export const updateProfileData = async (role, token, userId, formData) => {
  try {
    // Define possible endpoint patterns for each role
    const endpointPatterns = {
      player: [
        `${API_BASE_URL}/player/updatePlayer/${userId}`  // This is the confirmed working endpoint
      ],
      coach: [
        `${API_BASE_URL}/coach/updateCoach/${userId}`,
        `${API_BASE_URL}/coach/updateCoachProfile/${userId}`,
        `${API_BASE_URL}/coach/profile/${userId}`,
        `${API_BASE_URL}/coach/${userId}`
      ],
      scout: [
        `${API_BASE_URL}/scout/updateScout/${userId}`,
        `${API_BASE_URL}/scout/updateScoutProfile/${userId}`,
        `${API_BASE_URL}/scout/profile/${userId}`,
        `${API_BASE_URL}/scout/${userId}`
      ]
    }

    const endpoints = endpointPatterns[role]
    if (!endpoints) {
      throw new Error(`Invalid role: ${role}`)
    }

    let lastError = null

    // Try each endpoint pattern until one works
    for (const endpoint of endpoints) {
      try {
        console.log(`Sending update to: ${endpoint}`)
        console.log(`Profile data being sent:`, formData)
        console.log(`Player ID:`, userId)
        console.log(`Authorization:`, token ? 'Token is present' : 'Token is missing')
        
        const response = await fetchWithRetry(endpoint, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(formData)
        })

        console.log(`Response status: ${response.status} ${response.statusText}`)

        if (response.ok) {
          console.log('Profile updated successfully via:', endpoint)
          
          // Check if response has content before parsing JSON
          const contentType = response.headers.get('content-type')
          if (contentType && contentType.includes('application/json')) {
            const responseText = await response.text()
            if (responseText.trim()) {
              try {
                const data = JSON.parse(responseText)
                return data
              } catch (parseError) {
                console.warn('Failed to parse update response as JSON, but update was successful')
                return { success: true }
              }
            }
          }
          
          return { success: true }
        } else if (response.status === 404) {
          console.log(`Update endpoint not found: ${endpoint}`)
          continue // Try next endpoint
        } else {
          // Get the error details from the response
          const errorText = await response.text()
          console.error('Server error details:', errorText)
          try {
            const errorJson = JSON.parse(errorText)
            throw new Error(`HTTP ${response.status}: ${errorJson.message || errorJson.error || response.statusText}`)
          } catch (parseError) {
            throw new Error(`HTTP ${response.status}: ${errorText || response.statusText}`)
          }
        }
      } catch (error) {
        console.log(`Failed to update via ${endpoint}:`, error.message)
        lastError = error
        continue // Try next endpoint
      }
    }

    // If we get here, all endpoints failed
    throw lastError || new Error(`No working update endpoint found for ${role} profile`)

  } catch (error) {
    console.error('Error updating profile data:', error)
    throw error
  }
}
