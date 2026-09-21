import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'

const ProtectedRoute = ({ children }) => {
  const location = useLocation()

  const token =
    localStorage.getItem('access_token') ||
    sessionStorage.getItem('access_token')

  if (!token) {
    return (
      <Navigate
        to="/authentication/login"
        replace
        state={{ from: location.pathname }}
      />
    )
  }

  return children
}

export default ProtectedRoute