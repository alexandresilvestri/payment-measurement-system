import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'

const API_BASE_URL = 'http://localhost:3000/api'

export const api = axios.create({
  baseURL: API_BASE_URL,
})

/**
 * Sets up axios interceptors for authentication
 * Should be called from AuthProvider after initialization
 */
export const setupInterceptors = (
  getAccessToken: () => string | null,
  refreshAccessToken: () => Promise<void>
) => {
  // Request interceptor: Add authorization header
  api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = getAccessToken()
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )

  // Response interceptor: Handle 401 and refresh token
  api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & {
        _retry?: boolean
      }

      // If error is 401 and we haven't retried yet
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true

        try {
          // Attempt to refresh the token
          await refreshAccessToken()

          // Retry the original request with new token
          const token = getAccessToken()
          if (token && originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`
          }

          return api(originalRequest)
        } catch (refreshError) {
          // If refresh fails, reject with original error
          return Promise.reject(error)
        }
      }

      return Promise.reject(error)
    }
  )
}
