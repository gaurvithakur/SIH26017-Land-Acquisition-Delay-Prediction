import React, { useEffect, useState } from 'react'
import {
  CAlert,
  CBadge,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CContainer,
  CRow,
  CSpinner,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'

import { useNavigate } from 'react-router-dom'
import { apiFetch } from '../../api'

const HighRiskCases = () => {
  const navigate = useNavigate()

  const [cases, setCases] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // =========================================================
  // LOAD HIGH-RISK CASES
  // =========================================================
  const loadHighRiskCases = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await apiFetch('/api/cases/')
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || 'Failed to load cases')
      }

      const highRiskCases = data
        .filter(
          (item) =>
            Number(item.predicted_delay_days) >= 120,
        )
        .sort(
          (a, b) =>
            Number(b.predicted_delay_days) -
            Number(a.predicted_delay_days),
        )

      setCases(highRiskCases)
    } catch (err) {
      setError(err.message || 'Unable to load high-risk cases')
      setCases([])
    } finally {
      setLoading(false)
    }
  }

  // =========================================================
  // LOAD ON PAGE OPEN
  // =========================================================
  useEffect(() => {
    loadHighRiskCases()
  }, [])

  // =========================================================
  // OPEN CASE
  // =========================================================
  const handleViewCase = (caseId) => {
    navigate(`/view-case/${encodeURIComponent(caseId)}`)
  }

  return (
    <CContainer fluid>

      {/* Breadcrumb */}
      <div className="mb-3">
        <span className="text-body-secondary">
          Home
        </span>

        <span className="mx-2">
          /
        </span>

        <strong>
          High Risk Cases
        </strong>
      </div>

      {/* Error */}
      {error && (
        <CAlert
          color="danger"
          dismissible
          onClose={() => setError('')}
        >
          {error}
        </CAlert>
      )}

      <CRow>

        <CCol xs={12}>

          <CCard className="mb-4">

            <CCardHeader>
              <strong>
                🔴 High Delay Cases
              </strong>

              <div className="small text-body-secondary mt-1">
                Cases with predicted delay of 120 days or more
              </div>
            </CCardHeader>

            <CCardBody>

              {/* Loading */}
              {loading ? (

                <div className="text-center py-5">

                  <CSpinner />

                  <div className="mt-3 text-body-secondary">
                    Loading high-risk cases...
                  </div>

                </div>

              ) : (

                <>

                  {/* Count */}
                  <div className="mb-3">

                    <CBadge
                      color="danger"
                      shape="rounded-pill"
                      className="px-3 py-2"
                    >
                      {cases.length} Cases
                    </CBadge>

                  </div>

                  {/* No cases */}
                  {cases.length === 0 ? (

                    <div className="text-center py-5">

                      <div
                        style={{
                          fontSize: '42px',
                          marginBottom: '10px',
                        }}
                      >
                        🎉
                      </div>

                      <h5>
                        No High Delay Cases Found
                      </h5>

                      <p className="text-body-secondary mb-0">
                        No cases currently have a predicted
                        delay of 120 days or more.
                      </p>

                    </div>

                  ) : (

                    <CTable
                      hover
                      responsive
                      bordered
                      align="middle"
                    >

                      <CTableHead>

                        <CTableRow>

                          <CTableHeaderCell>
                            Case ID
                          </CTableHeaderCell>

                          <CTableHeaderCell>
                            State
                          </CTableHeaderCell>

                          <CTableHeaderCell>
                            District
                          </CTableHeaderCell>

                          <CTableHeaderCell>
                            Project Type
                          </CTableHeaderCell>

                          <CTableHeaderCell>
                            Predicted Delay
                          </CTableHeaderCell>

                          <CTableHeaderCell>
                            Status
                          </CTableHeaderCell>

                          <CTableHeaderCell>
                            Action
                          </CTableHeaderCell>

                        </CTableRow>

                      </CTableHead>

                      <CTableBody>

                        {cases.map((item) => {

                          const delay = Number(
                            item.predicted_delay_days,
                          )

                          return (

                            <CTableRow key={item.case_id}>

                              <CTableDataCell>
                                <strong>
                                  {item.case_id}
                                </strong>
                              </CTableDataCell>

                              <CTableDataCell>
                                {item.state || '—'}
                              </CTableDataCell>

                              <CTableDataCell>
                                {item.district || '—'}
                              </CTableDataCell>

                              <CTableDataCell>
                                {item.project_type || '—'}
                              </CTableDataCell>

                              <CTableDataCell>

                                <CBadge color="danger">
                                  {delay.toFixed(2)} days
                                </CBadge>

                              </CTableDataCell>

                              <CTableDataCell>

                                <CBadge color="danger">
                                  High Delay
                                </CBadge>

                              </CTableDataCell>

                              <CTableDataCell>

                                <button
                                  type="button"
                                  className="btn btn-sm btn-primary"
                                  onClick={() =>
                                    handleViewCase(
                                      item.case_id,
                                    )
                                  }
                                >
                                  View Case
                                </button>

                              </CTableDataCell>

                            </CTableRow>

                          )
                        })}

                      </CTableBody>

                    </CTable>

                  )}

                </>

              )}

            </CCardBody>

          </CCard>

        </CCol>

      </CRow>

    </CContainer>
  )
}

export default HighRiskCases