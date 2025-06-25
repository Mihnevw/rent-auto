export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8800'

export const config = {
  api: {
    baseUrl: API_BASE_URL,
    endpoints: {
      cars: '/cars',
      locations: '/locations',
      reservations: '/reservations',
      availableCars: '/reservations/cars/available',
      carAvailability: '/reservations/availability',
      confirmPayment: '/reservations/confirm-payment',
      contact: '/contact'
    }
  },
  images: {
    baseUrl: API_BASE_URL
  }
}

// Helper function to build API URLs
export const buildApiUrl = (endpoint: string, params?: Record<string, string>) => {
  const url = `${config.api.baseUrl}${endpoint}`
  if (!params) return url
  
  const queryParams = new URLSearchParams(params)
  return `${url}?${queryParams.toString()}`
}

// Helper function to format image URLs
export const formatImageUrl = (imagePath: string) => {
  if (!imagePath) return "/placeholder.svg"
  if (imagePath.startsWith("http")) return imagePath
  return `${config.images.baseUrl}${imagePath}`
} 