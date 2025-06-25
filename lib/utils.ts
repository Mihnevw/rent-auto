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
