import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  CAlert,
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CSpinner,
} from '@coreui/react'

import { apiFetch } from '../../../api'

const Alerts = () => {
  const navigate = useNavigate()

  const [cases, setCases] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadAlerts = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await apiFetch('/api/cases/')

      if (!response.ok) {
        throw new Error(`Failed to load alerts. Status: ${response.status}`)
      }

      const data = await response.json()

      setCases(data)
    } catch (err) {
      console.error('Error loading alerts:', err)

      if (err.message !== 'Not authenticated') {
        setError('Unable to load alerts from the server.')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAlerts()

    // Refresh alerts every 30 seconds
    const interval = setInterval(loadAlerts, 30000)

    return () => clearInterval(interval)
  }, [])

  // ==========================================
  // High-risk cases
  // ==========================================

  const highRiskCases = cases
    .filter(
      (item) =>
        item.predicted_delay_days !== null &&
        item.predicted_delay_days !== undefined &&
        Number(item.predicted_delay_days) >= 120,
    )
    .sort(
      (a, b) =>
        Number(b.predicted_delay_days) -
        Number(a.predicted_delay_days),
    )

  // ==========================================
  // Moderate-risk cases
  // ==========================================

  const moderateRiskCases = cases
    .filter(
      (item) =>
        item.predicted_delay_days !== null &&
        item.predicted_delay_days !== undefined &&
        Number(item.predicted_delay_days) >= 60 &&
        Number(item.predicted_delay_days) < 120,
    )
    .sort(
      (a, b) =>
        Number(b.predicted_delay_days) -
        Number(a.predicted_delay_days),
    )

  // ==========================================
  // Loading
  // ==========================================

  if (loading) {
    return (
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4 shadow-sm">
            <CCardHeader>
              <strong>🔔 LANDPREDICT Alerts</strong>
            </CCardHeader>

            <CCardBody className="text-center py-5">
              <CSpinner />

              <p className="mt-3 text-body-secondary mb-0">
                Loading alerts...
              </p>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    )
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4 shadow-sm">
          <CCardHeader className="d-flex justify-content-between align-items-center">
            <strong>🔔 LANDPREDICT Alerts</strong>

            <CBadge color="danger">
              {highRiskCases.length} High Risk
            </CBadge>
          </CCardHeader>

          <CCardBody>
            <p className="text-body-secondary">
              Important notifications and land acquisition cases
              requiring attention.
            </p>

            {/* Error */}
            {error && (
              <CAlert color="danger">
                {error}
              </CAlert>
            )}

            {/* ==========================================
                HIGH RISK ALERTS
            ========================================== */}

            {highRiskCases.length > 0 && (
              <div className="mb-4">
                <h5 className="fw-bold mb-3">
                  🔴 High Delay Alerts
                </h5>

                {highRiskCases.map((item) => {
                  const delay = Number(item.predicted_delay_days)

                  return (
                    <CAlert
                      key={item.case_id}
                      color="danger"
                      className="mb-3"
                    >
                      <div className="d-flex flex-column flex-md-row justify-content-between gap-3">
                        <div>
                          <h6 className="fw-bold mb-2">
                            High Delay Case: {item.case_id}
                          </h6>

                          <p className="mb-1">
                            This land acquisition case has a predicted
                            delay of{' '}
                            <strong>
                              {delay.toFixed(2)} days
                            </strong>
                            .
                          </p>

                          <p className="mb-1">
                            <strong>State:</strong>{' '}
                            {item.state || 'Not Available'}
                          </p>

                          <p className="mb-1">
                            <strong>District:</strong>{' '}
                            {item.district || 'Not Available'}
                          </p>

                          <p className="mb-0">
                            <strong>Project:</strong>{' '}
                            {item.project_type || 'Not Available'}
                          </p>
                        </div>

                        <div className="d-flex align-items-center">
                          <CButton
                            color="danger"
                            size="sm"
                            onClick={() =>
                              navigate(
                                `/view-case/${encodeURIComponent(
                                  item.case_id,
                                )}`,
                              )
                            }
                          >
                            👁️ View Case
                          </CButton>
                        </div>
                      </div>
                    </CAlert>
                  )
                })}
              </div>
            )}

            {/* ==========================================
                MODERATE RISK ALERTS
            ========================================== */}

            {moderateRiskCases.length > 0 && (
              <div className="mb-4">
                <h5 className="fw-bold mb-3">
                  🟡 Moderate Delay Alerts
                </h5>

                {moderateRiskCases.map((item) => {
                  const delay = Number(item.predicted_delay_days)

                  return (
                    <CAlert
                      key={item.case_id}
                      color="warning"
                      className="mb-3"
                    >
                      <div className="d-flex flex-column flex-md-row justify-content-between gap-3">
                        <div>
                          <h6 className="fw-bold mb-2">
                            Moderate Delay Case: {item.case_id}
                          </h6>

                          <p className="mb-1">
                            Predicted delay:{' '}
                            <strong>
                              {delay.toFixed(2)} days
                            </strong>
                          </p>

                          <p className="mb-1">
                            <strong>State:</strong>{' '}
                            {item.state || 'Not Available'}
                          </p>

                          <p className="mb-0">
                            <strong>District:</strong>{' '}
                            {item.district || 'Not Available'}
                          </p>
                        </div>

                        <div className="d-flex align-items-center">
                          <CButton
                            color="warning"
                            size="sm"
                            onClick={() =>
                              navigate(
                                `/view-case/${encodeURIComponent(
                                  item.case_id,
                                )}`,
                              )
                            }
                          >
                            👁️ View Case
                          </CButton>
                        </div>
                      </div>
                    </CAlert>
                  )
                })}
              </div>
            )}

            {/* ==========================================
                NO ALERTS
            ========================================== */}

            {highRiskCases.length === 0 &&
              moderateRiskCases.length === 0 && (
                <CAlert color="success">
                  <h6 className="fw-bold">
                    🎉 No Active Alerts
                  </h6>

                  <p className="mb-0">
                    There are currently no land acquisition cases
                    requiring immediate attention.
                  </p>
                </CAlert>
              )}

            {/* ==========================================
                SUMMARY
            ========================================== */}

            <CCard className="mt-4">
              <CCardHeader>
                <strong>Alert Summary</strong>
              </CCardHeader>

              <CCardBody>
                <CRow>
                  <CCol md={4} className="mb-3 mb-md-0">
                    <div className="text-body-secondary">
                      Total Cases
                    </div>

                    <h4 className="fw-bold">
                      {cases.length}
                    </h4>
                  </CCol>

                  <CCol md={4} className="mb-3 mb-md-0">
                    <div className="text-body-secondary">
                      High Delay
                    </div>

                    <h4 className="fw-bold text-danger">
                      {highRiskCases.length}
                    </h4>
                  </CCol>

                  <CCol md={4}>
                    <div className="text-body-secondary">
                      Moderate Delay
                    </div>

                    <h4 className="fw-bold text-warning">
                      {moderateRiskCases.length}
                    </h4>
                  </CCol>
                </CRow>
              </CCardBody>
            </CCard>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Alerts