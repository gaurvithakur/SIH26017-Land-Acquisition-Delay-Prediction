const API_URL = 'http://127.0.0.1:8000'

export const getAuthToken = () => {
  return (
    localStorage.getItem('access_token') ||
    sessionStorage.getItem('access_token')
  )
}

export const apiFetch = async (endpoint, options = {}) => {
  const token = getAuthToken()

  const headers = {
    ...(options.headers || {}),
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  if (options.body && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json'
  }

  return fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  })
}
