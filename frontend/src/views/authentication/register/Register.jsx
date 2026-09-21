import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  CAlert,
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormCheck,
  CFormInput,
  CFormLabel,
  CInputGroup,
  CInputGroupText,
  CRow,
  CTooltip,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { apple } from 'src/assets/brand/apple'
import { google } from 'src/assets/brand/google'
import { logo } from 'src/assets/brand/logo'
import { eye } from 'src/assets/icons/eye'

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

const Register = () => {
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [agreeTerms, setAgreeTerms] = useState(false)

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()

    setError('')
    setSuccess('')

    // Validate password confirmation
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    // Validate password length
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.')
      return
    }

    // Validate terms
    if (!agreeTerms) {
      setError('Please agree to the terms and conditions.')
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || 'Registration failed.')
      }

      // Save authentication information
      localStorage.setItem('access_token', data.access_token)
      localStorage.setItem('user', JSON.stringify(data.user))

      setSuccess('Account created successfully! Redirecting...')

      // Go to dashboard after successful registration
      setTimeout(() => {
        navigate('/dashboard', { replace: true })
      }, 800)
    } catch (err) {
      setError(err.message || 'Unable to create account.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8} lg={6} xl={5}>
            <div className="d-flex flex-column gap-4">

              {/* Logo */}
              <div className="text-center">
                <CIcon icon={logo} height={48} />
              </div>

              <CCard className="p-4">
                <CCardBody className="d-flex flex-column gap-4">

                  <h2 className="h5 text-center mb-0">
                    Create your account
                  </h2>

                  <p className="text-body-secondary text-center mb-0">
                    Register for LANDPREDICT
                  </p>

                  {/* Error message */}
                  {error && (
                    <CAlert color="danger" className="mb-0">
                      {error}
                    </CAlert>
                  )}

                  {/* Success message */}
                  {success && (
                    <CAlert color="success" className="mb-0">
                      {success}
                    </CAlert>
                  )}

                  <CForm className="row gy-3" onSubmit={handleSubmit}>

                    {/* Name */}
                    <CCol xs={12}>
                      <CFormLabel htmlFor="name">
                        Full name
                      </CFormLabel>

                      <CFormInput
                        id="name"
                        type="text"
                        placeholder="Enter your full name"
                        autoComplete="name"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        required
                      />
                    </CCol>

                    {/* Email */}
                    <CCol xs={12}>
                      <CFormLabel htmlFor="email">
                        Email address
                      </CFormLabel>

                      <CFormInput
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        autoComplete="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        required
                      />
                    </CCol>

                    {/* Password */}
                    <CCol xs={12}>
                      <CFormLabel htmlFor="password">
                        Password
                      </CFormLabel>

                      <CInputGroup>
                        <CFormInput
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Create a password"
                          autoComplete="new-password"
                          value={password}
                          onChange={(event) => setPassword(event.target.value)}
                          required
                        />

                        <CInputGroupText>
                          <CTooltip
                            content={
                              showPassword
                                ? 'Hide password'
                                : 'Show password'
                            }
                          >
                            <CButton
                              type="button"
                              color="link"
                              className="p-0 link-secondary"
                              aria-label={
                                showPassword
                                  ? 'Hide password'
                                  : 'Show password'
                              }
                              onClick={() =>
                                setShowPassword(!showPassword)
                              }
                            >
                              <CIcon icon={eye} size="sm" />
                            </CButton>
                          </CTooltip>
                        </CInputGroupText>
                      </CInputGroup>

                      <div className="form-text">
                        Password must be at least 8 characters.
                      </div>
                    </CCol>

                    {/* Confirm password */}
                    <CCol xs={12}>
                      <CFormLabel htmlFor="confirmPassword">
                        Confirm password
                      </CFormLabel>

                      <CInputGroup>
                        <CFormInput
                          id="confirmPassword"
                          type={
                            showConfirmPassword
                              ? 'text'
                              : 'password'
                          }
                          placeholder="Confirm your password"
                          autoComplete="new-password"
                          value={confirmPassword}
                          onChange={(event) =>
                            setConfirmPassword(event.target.value)
                          }
                          required
                        />

                        <CInputGroupText>
                          <CTooltip
                            content={
                              showConfirmPassword
                                ? 'Hide password'
                                : 'Show password'
                            }
                          >
                            <CButton
                              type="button"
                              color="link"
                              className="p-0 link-secondary"
                              aria-label={
                                showConfirmPassword
                                  ? 'Hide password'
                                  : 'Show password'
                              }
                              onClick={() =>
                                setShowConfirmPassword(
                                  !showConfirmPassword,
                                )
                              }
                            >
                              <CIcon icon={eye} size="sm" />
                            </CButton>
                          </CTooltip>
                        </CInputGroupText>
                      </CInputGroup>
                    </CCol>

                    {/* Terms */}
                    <CCol xs={12}>
                      <CFormCheck
                        id="agreeTerms"
                        label="I agree to the terms and conditions"
                        checked={agreeTerms}
                        onChange={(event) =>
                          setAgreeTerms(event.target.checked)
                        }
                      />
                    </CCol>

                    {/* Register button */}
                    <CCol xs={12}>
                      <CButton
                        color="primary"
                        type="submit"
                        className="w-100"
                        disabled={loading}
                      >
                        {loading
                          ? 'Creating account...'
                          : 'Create account'}
                      </CButton>
                    </CCol>

                  </CForm>

                  {/* Social registration */}
                  <div className="position-relative">
                    <hr />

                    <div className="position-absolute top-50 start-50 translate-middle bg-body px-2 text-body-tertiary text-uppercase small">
                      or
                    </div>
                  </div>

                  <CRow>
                    <CCol>
                      <CButton
                        type="button"
                        variant="outline"
                        className="w-100"
                      >
                        <CIcon
                          icon={google}
                          className="me-1"
                        />
                        Sign up with Google
                      </CButton>
                    </CCol>

                    <CCol>
                      <CButton
                        type="button"
                        variant="outline"
                        className="w-100"
                      >
                        <CIcon
                          icon={apple}
                          className="me-1"
                        />
                        Sign up with Apple
                      </CButton>
                    </CCol>
                  </CRow>

                </CCardBody>
              </CCard>

              {/* Login link */}
              <div className="text-center text-body-secondary">
                Already have an account?{' '}
                <Link to="/authentication/login">
                  Sign in
                </Link>
              </div>

            </div>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Register
