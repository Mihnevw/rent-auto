import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Storage keys
export const STORAGE_KEYS = {
  PICKUP_DATE: 'pickupDate',
  PICKUP_TIME: 'pickupTime',
  RETURN_DATE: 'returnDate',
  RETURN_TIME: 'returnTime',
  PICKUP_LOCATION: 'pickupLocation',
  RETURN_LOCATION: 'returnLocation',
} as const

// Save date to localStorage
export const saveToStorage = (key: string, value: any) => {
  if (typeof window !== 'undefined') {
    if (value === null || value === undefined) {
      localStorage.removeItem(key)
    } else {
      localStorage.setItem(key, JSON.stringify(value))
    }
  }
}

// Get date from localStorage
export const getFromStorage = (key: string) => {
  if (typeof window !== 'undefined') {
    const value = localStorage.getItem(key)
    if (!value) return null
    try {
      return JSON.parse(value)
    } catch {
      return null
    }
  }
  return null
}

// Clear all rental data from storage
export const clearRentalDataFromStorage = () => {
  if (typeof window !== 'undefined') {
    Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key))
  }
}

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem('adminToken')
  
  const headers = {
    ...options.headers,
    'Authorization': `Bearer ${token}`,
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include',
  })

  // Handle 401 Unauthorized - session expired
  if (response.status === 401) {
    // Clear token and redirect to login
    localStorage.removeItem('adminToken')
    window.location.href = '/admin'
    throw new Error('Session expired')
  }

  return response
}

export async function logout() {
  try {
    const response = await fetchWithAuth('http://localhost:8800/logout', {
      method: 'POST'
    })
    
    if (response.ok) {
      // Clear token and redirect to login
      localStorage.removeItem('adminToken')
      window.location.href = '/admin'
    } else {
      throw new Error('Logout failed')
    }
  } catch (error) {
    // Still clear token and redirect on error
    localStorage.removeItem('adminToken')
    window.location.href = '/admin'
  }
}
