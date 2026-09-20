const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

export const getAuthToken = () => {
  return localStorage.getItem('access_token')
}

export const clearAuth = () => {
  localStorage.removeItem('access_token')
  localStorage.removeItem('user')

  sessionStorage.removeItem('access_token')
  sessionStorage.removeItem('user')
}

export const apiFetch = async (endpoint, options = {}) => {
  const token = getAuthToken()

  if (!token) {
    window.location.hash = '#/authentication/login'
    throw new Error('Not authenticated')
  }

  const headers = {
    ...(options.headers || {}),
    Authorization: `Bearer ${token}`,
  }

  if (options.body && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json'
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  })

  if (response.status === 401) {
    clearAuth()
    window.location.hash = '#/authentication/login'
    throw new Error('Session expired. Please login again.')
  }

  return response
}