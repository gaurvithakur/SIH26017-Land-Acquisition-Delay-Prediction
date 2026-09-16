import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CProgress,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'

const Dashboard = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  // Get saved LANDPREDICT cases from Redux
  // Fallback to empty array to prevent errors if cases is undefined
  const cases = useSelector((state) => state.cases || [])

  // Convert predicted delay into a category
  const getDelayCategory = (delay) => {
    const days = Number(delay) || 0

    if (days >= 120) return 'High Delay'
    if (days >= 60) return 'Moderate Delay'
    return 'Lower Delay'
  }

  // Get CoreUI color according to predicted delay
  const getDelayColor = (delay) => {
    const days = Number(delay) || 0

    if (days >= 120) return 'danger'
    if (days >= 60) return 'warning'
    return 'success'
  }

  // Calculate cases based on predicted delay
  const highDelayCases = cases.filter((item) => {
    return Number(item.predictedDelayDays) >= 120
  })

  const moderateDelayCases = cases.filter((item) => {
    const days = Number(item.predictedDelayDays) || 0
    return days >= 60 && days < 120
  })

  const lowerDelayCases = cases.filter((item) => {
    return Number(item.predictedDelayDays) < 60
  })

  // Counts
  const totalCases = cases.length
  const highCount = highDelayCases.length
  const moderateCount = moderateDelayCases.length
  const lowerCount = lowerDelayCases.length

  // Percentages
  const highPercentage = totalCases ? (highCount / totalCases) * 100 : 0

  const moderatePercentage = totalCases ? (moderateCount / totalCases) * 100 : 0

  const lowerPercentage = totalCases ? (lowerCount / totalCases) * 100 : 0

  // Delete case
  const handleDelete = (index, caseId) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete case ${caseId}?`)

    if (confirmDelete) {
      dispatch({
        type: 'DELETE_CASE',
        payload: index,
      })
    }
  }

  return (
    <>
      {/* ==================== DASHBOARD HEADING ==================== */}
      <CRow className="mb-4">
        <CCol>
          <h2 className="fw-bold">LANDPREDICT Dashboard</h2>

          <p className="text-body-secondary">
            AI-powered land acquisition delay prediction and monitoring system
          </p>
        </CCol>
      </CRow>

      {/* ==================== STATISTICS CARDS ==================== */}
      <CRow className="mb-4">
        {/* Total Cases */}
        <CCol sm={6} lg={3}>
          <CCard className="mb-3 shadow-sm">
            <CCardBody>
              <div className="text-body-secondary">TOTAL CASES</div>

              <div className="fs-2 fw-bold">{totalCases}</div>

              <small className="text-primary">Land acquisition cases</small>
            </CCardBody>
          </CCard>
        </CCol>

        {/* High Delay */}
        <CCol sm={6} lg={3}>
          <CCard className="mb-3 shadow-sm border-start border-start-4 border-start-danger">
            <CCardBody>
              <div className="text-body-secondary">HIGH DELAY CASES</div>

              <div className="fs-2 fw-bold text-danger">{highCount}</div>

              <small className="text-body-secondary">Predicted delay of 120+ days</small>
            </CCardBody>
          </CCard>
        </CCol>

        {/* Moderate Delay */}
        <CCol sm={6} lg={3}>
          <CCard className="mb-3 shadow-sm border-start border-start-4 border-start-warning">
            <CCardBody>
              <div className="text-body-secondary">MODERATE DELAY</div>

              <div className="fs-2 fw-bold text-warning">{moderateCount}</div>

              <small className="text-body-secondary">Predicted delay of 60–119 days</small>
            </CCardBody>
          </CCard>
        </CCol>

        {/* Lower Delay */}
        <CCol sm={6} lg={3}>
          <CCard className="mb-3 shadow-sm border-start border-start-4 border-start-success">
            <CCardBody>
              <div className="text-body-secondary">LOWER DELAY</div>

              <div className="fs-2 fw-bold text-success">{lowerCount}</div>

              <small className="text-body-secondary">Predicted delay below 60 days</small>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* ==================== DELAY OVERVIEW + AI INSIGHTS ==================== */}
      <CRow className="mb-4">
        {/* Delay Overview */}
        <CCol lg={6}>
          <CCard className="h-100 shadow-sm">
            <CCardHeader>
              <strong>📊 Predicted Delay Overview</strong>
            </CCardHeader>

            <CCardBody>
              {/* High Delay */}
              <div className="mb-4">
                <div className="d-flex justify-content-between mb-2">
                  <span>🔴 High Delay</span>

                  <strong>{highCount} Cases</strong>
                </div>

                <CProgress color="danger" value={highPercentage} />
              </div>

              {/* Moderate Delay */}
              <div className="mb-4">
                <div className="d-flex justify-content-between mb-2">
                  <span>🟡 Moderate Delay</span>

                  <strong>{moderateCount} Cases</strong>
                </div>

                <CProgress color="warning" value={moderatePercentage} />
              </div>

              {/* Lower Delay */}
              <div>
                <div className="d-flex justify-content-between mb-2">
                  <span>🟢 Lower Delay</span>

                  <strong>{lowerCount} Cases</strong>
                </div>

                <CProgress color="success" value={lowerPercentage} />
              </div>
            </CCardBody>
          </CCard>
        </CCol>

        {/* AI Insights */}
        <CCol lg={6}>
          <CCard className="h-100 shadow-sm">
            <CCardHeader>
              <strong>🤖 AI Insights</strong>
            </CCardHeader>

            <CCardBody>
              {totalCases === 0 ? (
                <p className="text-body-secondary">
                  No cases have been added yet. Add a new land acquisition case to generate a delay
                  prediction.
                </p>
              ) : (
                <>
                  <p>
                    <strong>⚠️ High Delay Alert:</strong> {highCount} land acquisition case
                    {highCount !== 1 ? 's have' : ' has'} a predicted delay of 120 days or more.
                  </p>

                  <hr />

                  <p>
                    <strong>📌 Prediction Factors:</strong> The prediction model considers factors
                    such as court cases, objections, pending approvals, compensation progress,
                    acquisition stage duration and other project characteristics.
                  </p>

                  <hr />

                  <p>
                    <strong>📈 Monitoring:</strong> Cases with higher predicted delays can be
                    reviewed and monitored for early intervention.
                  </p>
                </>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* ==================== RECENT CASES ==================== */}
      <CRow>
        <CCol>
          <CCard className="shadow-sm">
            <CCardHeader>
              <strong>📋 Recent Land Acquisition Cases</strong>
            </CCardHeader>

            <CCardBody>
              {cases.length === 0 ? (
                <p className="text-body-secondary text-center py-4">
                  No cases added yet. Go to <strong>Add New Case</strong> to create your first
                  prediction.
                </p>
              ) : (
                <CTable responsive hover align="middle">
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell>Case ID</CTableHeaderCell>

                      <CTableHeaderCell>State</CTableHeaderCell>

                      <CTableHeaderCell>District</CTableHeaderCell>

                      <CTableHeaderCell>Project Type</CTableHeaderCell>

                      <CTableHeaderCell>Delay Category</CTableHeaderCell>

                      <CTableHeaderCell>Predicted Delay</CTableHeaderCell>

                      <CTableHeaderCell className="text-center">Action</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>

                  <CTableBody>
                    {cases.map((item, index) => {
                      const delay = Number(item.predictedDelayDays) || 0

                      const category = getDelayCategory(delay)

                      const color = getDelayColor(delay)

                      return (
                        <CTableRow key={`${item.caseId}-${index}`}>
                          {/* Case ID */}
                          <CTableDataCell>
                            <strong>{item.caseId}</strong>
                          </CTableDataCell>

                          {/* State */}
                          <CTableDataCell>{item.state}</CTableDataCell>

                          {/* District */}
                          <CTableDataCell>{item.district}</CTableDataCell>

                          {/* Project Type */}
                          <CTableDataCell>{item.projectType}</CTableDataCell>

                          {/* Delay Category */}
                          <CTableDataCell>
                            <span className={`badge bg-${color}`}>{category}</span>
                          </CTableDataCell>

                          {/* Predicted Delay */}
                          <CTableDataCell>
                            <strong>{delay.toFixed(2)} days</strong>
                          </CTableDataCell>

                          {/* Actions */}
                          <CTableDataCell className="text-center">
                            <div className="d-flex gap-2 justify-content-center">
                              {/* View */}
                              <CButton
                                color="info"
                                size="sm"
                                onClick={() => navigate(`/view-case/${index}`)}
                              >
                                👁️ View
                              </CButton>

                              {/* Edit */}
                              <CButton
                                color="primary"
                                size="sm"
                                onClick={() => navigate(`/edit-case/${index}`)}
                              >
                                ✏️ Edit
                              </CButton>

                              {/* Delete */}
                              <CButton
                                color="danger"
                                size="sm"
                                onClick={() => handleDelete(index, item.caseId)}
                              >
                                🗑️ Delete
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
    </>
  )
}

export default Dashboard
