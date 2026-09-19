import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  CAlert,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CSpinner,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'

const API_URL = 'http://127.0.0.1:8000'

const HighRiskCases = () => {
  const navigate = useNavigate()

  const [cases, setCases] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // ==================== LOAD CASES FROM DATABASE ====================
  const loadCases = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch(`${API_URL}/api/cases/`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || 'Failed to load cases.')
      }

      setCases(data)
    } catch (err) {
      setError(err.message || 'Unable to connect to the backend.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCases()
  }, [])

  // ==================== HIGH-RISK FILTER ====================
  const highDelayCases = cases
    .filter((item) => {
      const delay = Number(item.predicted_delay_days)

      return !Number.isNaN(delay) && delay >= 120
    })
    .sort((a, b) => Number(b.predicted_delay_days) - Number(a.predicted_delay_days))

  // ==================== LOADING ====================
  if (loading) {
    return (
      <div className="text-center py-5">
        <CSpinner color="primary" />

        <div className="mt-3 text-body-secondary">Loading high-risk cases...</div>
      </div>
    )
  }

  return (
    <CRow>
      <CCol xs={12}>
        {/* ==================== ERROR ==================== */}
        {error && (
          <CAlert color="danger" className="mb-4">
            <strong>Error:</strong> {error}
          </CAlert>
        )}

        <CCard className="shadow-sm">
          {/* ==================== HEADER ==================== */}
          <CCardHeader className="d-flex justify-content-between align-items-center">
            <div>
              <strong>🔴 High Delay Cases</strong>

              <div className="small text-body-secondary mt-1">
                Cases with predicted delay of 120 days or more
              </div>
            </div>

            <span className="badge bg-danger fs-6">{highDelayCases.length} Cases</span>
          </CCardHeader>

          <CCardBody>
            {/* ==================== NO CASES ==================== */}
            {highDelayCases.length === 0 ? (
              <div className="text-center py-5">
                <h5>🎉 No High Delay Cases Found</h5>

                <p className="text-body-secondary">
                  No cases currently have a predicted delay of 120 days or more.
                </p>

                <CButton color="primary" onClick={() => navigate('/add-case')}>
                  ➕ Add New Case
                </CButton>
              </div>
            ) : (
              /* ==================== HIGH-RISK TABLE ==================== */
              <CTable responsive hover align="middle">
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>Case ID</CTableHeaderCell>

                    <CTableHeaderCell>State</CTableHeaderCell>

                    <CTableHeaderCell>District</CTableHeaderCell>

                    <CTableHeaderCell>Project Type</CTableHeaderCell>

                    <CTableHeaderCell>Predicted Delay</CTableHeaderCell>

                    <CTableHeaderCell className="text-center">Actions</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>

                <CTableBody>
                  {highDelayCases.map((item) => {
                    const delay = Number(item.predicted_delay_days) || 0

                    return (
                      <CTableRow key={item.case_id}>
                        {/* Case ID */}
                        <CTableDataCell>
                          <strong>{item.case_id}</strong>
                        </CTableDataCell>

                        {/* State */}
                        <CTableDataCell>{item.state}</CTableDataCell>

                        {/* District */}
                        <CTableDataCell>{item.district}</CTableDataCell>

                        {/* Project Type */}
                        <CTableDataCell>{item.project_type}</CTableDataCell>

                        {/* Predicted Delay */}
                        <CTableDataCell>
                          <span className="badge bg-danger fs-6">{delay.toFixed(2)} days</span>
                        </CTableDataCell>

                        {/* Actions */}
                        <CTableDataCell className="text-center">
                          <div className="d-flex gap-2 justify-content-center">
                            <CButton
                              color="info"
                              size="sm"
                              onClick={() =>
                                navigate(`/view-case/${encodeURIComponent(item.case_id)}`)
                              }
                            >
                              👁️ View
                            </CButton>

                            <CButton
                              color="primary"
                              size="sm"
                              onClick={() =>
                                navigate(`/edit-case/${encodeURIComponent(item.case_id)}`)
                              }
                            >
                              ✏️ Edit
                            </CButton>
                          </div>
                        </CTableDataCell>
                      </CTableRow>
                    )
                  })}
                </CTableBody>
              </CTable>
            )}
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default HighRiskCases
