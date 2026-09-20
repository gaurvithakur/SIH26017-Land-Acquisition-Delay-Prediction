/**
 * App Component
 *
 * Root application component that sets up routing, theme management,
 * and lazy-loaded page components with suspense boundaries.
 *
 * Features:
 * - Client-side routing with HashRouter
 * - Theme management
 * - Lazy loading
 * - Public authentication routes
 * - Protected application routes
 *
 * @module App
 */

import React, { Suspense, useEffect } from 'react'
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { CSpinner, useColorModes } from '@coreui/react'
import './scss/style.scss'
import './scss/examples.scss'

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Authentication Pages
const Login = React.lazy(
  () => import('./views/authentication/login/Login'),
)

const Register = React.lazy(
  () => import('./views/authentication/register/Register'),
)

const CheckEmail = React.lazy(
  () => import('./views/authentication/check-email/CheckEmail'),
)

const ResetPassword = React.lazy(
  () => import('./views/authentication/reset-password/ResetPassword'),
)

const ChangePassword = React.lazy(
  () => import('./views/authentication/change-password/ChangePassword'),
)

const PasswordChanged = React.lazy(
  () => import('./views/authentication/password-changed/PasswordChanged'),
)

// Error Pages
const Page404 = React.lazy(
  () => import('./views/error-pages/page404/Page404'),
)

const Page500 = React.lazy(
  () => import('./views/error-pages/page500/Page500'),
)

// Protected Route
const ProtectedRoute = ({ children }) => {
  const token =
    localStorage.getItem('access_token') ||
    sessionStorage.getItem('access_token')

  if (!token) {
    return (
      <Navigate
        to="/authentication/login"
        replace
      />
    )
  }

  return children
}

const App = () => {
  const {
    isColorModeSet,
    setColorMode,
  } = useColorModes(
    'coreui-free-react-admin-template-theme',
  )

  const storedTheme = useSelector(
    (state) => state.theme,
  )

  useEffect(() => {
    const urlParams = new URLSearchParams(
      window.location.href.split('?')[1],
    )

    const theme =
      urlParams
        .get('theme')
        ?.match(/^[A-Za-z0-9\s]+/)?.[0]

    if (theme) {
      setColorMode(theme)
    }

    if (isColorModeSet()) {
      return
    }

    setColorMode(storedTheme)
  }, [])

  return (
    <HashRouter>
      <Suspense
        fallback={
          <div className="pt-3 text-center">
            <CSpinner
              color="primary"
              variant="grow"
            />
          </div>
        }
      >
        <Routes>

          {/* ========================= */}
          {/* PUBLIC AUTHENTICATION ROUTES */}
          {/* ========================= */}

          <Route
            path="/authentication/login"
            element={<Login />}
          />

          <Route
            path="/authentication/register"
            element={<Register />}
          />

          <Route
            path="/authentication/check-email"
            element={<CheckEmail />}
          />

          <Route
            path="/authentication/reset-password"
            element={<ResetPassword />}
          />

          <Route
            path="/authentication/change-password"
            element={<ChangePassword />}
          />

          <Route
            path="/authentication/password-changed"
            element={<PasswordChanged />}
          />

          {/* ========================= */}
          {/* ERROR PAGES */}
          {/* ========================= */}

          <Route
            path="/error-pages/404"
            element={<Page404 />}
          />

          <Route
            path="/error-pages/500"
            element={<Page500 />}
          />

          {/* ========================= */}
          {/* PROTECTED APPLICATION */}
          {/* ========================= */}

          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <DefaultLayout />
              </ProtectedRoute>
            }
          />

        </Routes>
      </Suspense>
    </HashRouter>
  )
}

export default App