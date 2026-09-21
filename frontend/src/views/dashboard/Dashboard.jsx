import React, { useEffect, useState } from 'react'
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
  CAlert,
  CSpinner,
} from '@coreui/react'

import { CChartBar } from '@coreui/react-chartjs'

import { apiFetch } from '../../api'

const Dashboard = () => {
  const navigate = useNavigate()

  const [cases, setCases] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // ==================== LOAD CASES ====================
  const loadCases = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await apiFetch('/api/cases/')
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

  // ==================== DELAY CATEGORY ====================
  const getDelayCategory = (delay) => {
    const days = Number(delay) || 0

    if (days >= 120) return 'High Delay'
    if (days >= 60) return 'Moderate Delay'

    return 'Lower Delay'
  }

  // ==================== DELAY COLOR ====================
  const getDelayColor = (delay) => {
    const days = Number(delay) || 0

    if (days >= 120) return 'danger'
    if (days >= 60) return 'warning'

    return 'success'
  }

  // ==================== FILTER CASES ====================
  const highDelayCases = cases.filter(
    (item) => Number(item.predicted_delay_days) >= 120,
  )

  const moderateDelayCases = cases.filter((item) => {
    const days = Number(item.predicted_delay_days) || 0
    return days >= 60 && days < 120
  })

  const lowerDelayCases = cases.filter(
    (item) => Number(item.predicted_delay_days) < 60,
  )

  // ==================== COUNTS ====================
  const totalCases = cases.length
  const highCount = highDelayCases.length
  const moderateCount = moderateDelayCases.length
  const lowerCount = lowerDelayCases.length

  // ==================== PERCENTAGES ====================
  const highPercentage = totalCases
    ? (highCount / totalCases) * 100
    : 0

  const moderatePercentage = totalCases
    ? (moderateCount / totalCases) * 100
    : 0

  const lowerPercentage = totalCases
    ? (lowerCount / totalCases) * 100
    : 0

  // ==================== AVERAGE DELAY ====================
  const averageDelay = totalCases
    ? cases.reduce(
        (total, item) =>
          total + (Number(item.predicted_delay_days) || 0),
        0,
      ) / totalCases
    : 0

  // ==================== DELETE CASE ====================
  const handleDelete = async (caseId) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete case ${caseId}?`,
    )

    if (!confirmDelete) {
      return
    }

    try {
      const response = await apiFetch(
        `/api/cases/${encodeURIComponent(caseId)}`,
        {
          method: 'DELETE',
        },
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || 'Failed to delete case.')
      }

      await loadCases()
    } catch (err) {
      setError(err.message || 'Unable to delete case.')
    }
  }

  // ==================== CHART DATA ====================
  const chartData = {
    labels: ['High Delay', 'Moderate Delay', 'Lower Delay'],
    datasets: [
      {
        label: 'Number of Cases',
        data: [highCount, moderateCount, lowerCount],
        backgroundColor: [
          'rgba(220, 53, 69, 0.75)',
          'rgba(255, 193, 7, 0.75)',
          'rgba(25, 135, 84, 0.75)',
        ],
        borderColor: [
          'rgba(220, 53, 69, 1)',
          'rgba(255, 193, 7, 1)',
          'rgba(25, 135, 84, 1)',
        ],
        borderWidth: 1,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
      },
    },
  }

  // ==================== LOADING ====================
  if (loading) {
    return (
      <div className="text-center py-5">
        <CSpinner color="primary" />

        <div className="mt-3 text-body-secondary">
          Loading dashboard data...
        </div>
      </div>
    )
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

      {/* ==================== ERROR ==================== */}
      {error && (
        <CAlert color="danger" className="mb-4">
          <strong>Dashboard Error:</strong> {error}
        </CAlert>
      )}

      {/* ==================== STATISTICS ==================== */}
      <CRow className="mb-4">
        {/* Total Cases */}
        <CCol sm={6} lg={3}>
          <CCard className="mb-3 shadow-sm">
            <CCardBody>
              <div className="text-body-secondary">
                TOTAL CASES
              </div>

              <div className="fs-2 fw-bold">
                {totalCases}
              </div>

              <small className="text-primary">
                Land acquisition cases
              </small>
            </CCardBody>
          </CCard>
        </CCol>

        {/* High Delay */}
        <CCol sm={6} lg={3}>
          <CCard className="mb-3 shadow-sm border-start border-start-4 border-start-danger">
            <CCardBody>
              <div className="text-body-secondary">
                HIGH DELAY CASES
              </div>

              <div className="fs-2 fw-bold text-danger">
                {highCount}
              </div>

              <small className="text-body-secondary">
                Predicted delay of 120+ days
              </small>
            </CCardBody>
          </CCard>
        </CCol>

        {/* Moderate Delay */}
        <CCol sm={6} lg={3}>
          <CCard className="mb-3 shadow-sm border-start border-start-4 border-start-warning">
            <CCardBody>
              <div className="text-body-secondary">
                MODERATE DELAY
              </div>

              <div className="fs-2 fw-bold text-warning">
                {moderateCount}
              </div>

              <small className="text-body-secondary">
                Predicted delay of 60–119 days
              </small>
            </CCardBody>
          </CCard>
        </CCol>

        {/* Average Delay */}
        <CCol sm={6} lg={3}>
          <CCard className="mb-3 shadow-sm border-start border-start-4 border-start-info">
            <CCardBody>
              <div className="text-body-secondary">
                AVERAGE DELAY
              </div>

              <div className="fs-2 fw-bold text-info">
                {averageDelay.toFixed(1)}
              </div>

              <small className="text-body-secondary">
                Predicted days per case
              </small>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* ==================== ANALYTICS ==================== */}
      <CRow className="mb-4">
        {/* Chart */}
        <CCol lg={7}>
          <CCard className="h-100 shadow-sm">
            <CCardHeader>
              <strong>📊 Predicted Delay Distribution</strong>
            </CCardHeader>

            <CCardBody>
              {totalCases === 0 ? (
                <div className="text-center text-body-secondary py-5">
                  No prediction data available yet.
                </div>
              ) : (
                <div style={{ height: '300px' }}>
                  <CChartBar
                    data={chartData}
                    options={chartOptions}
                  />
                </div>
              )}
            </CCardBody>
          </CCard>
        </CCol>

        {/* Delay Overview */}
        <CCol lg={5}>
          <CCard className="h-100 shadow-sm">
            <CCardHeader>
              <strong>📈 Delay Overview</strong>
            </CCardHeader>

            <CCardBody>
              {/* High */}
              <div className="mb-4">
                <div className="d-flex justify-content-between mb-2">
                  <span>🔴 High Delay</span>
                  <strong>{highCount} Cases</strong>
                </div>

                <CProgress
                  color="danger"
                  value={highPercentage}
                />
              </div>

              {/* Moderate */}
              <div className="mb-4">
                <div className="d-flex justify-content-between mb-2">
                  <span>🟡 Moderate Delay</span>
                  <strong>{moderateCount} Cases</strong>
                </div>

                <CProgress
                  color="warning"
                  value={moderatePercentage}
                />
              </div>

              {/* Lower */}
              <div>
                <div className="d-flex justify-content-between mb-2">
                  <span>🟢 Lower Delay</span>
                  <strong>{lowerCount} Cases</strong>
                </div>

                <CProgress
                  color="success"
                  value={lowerPercentage}
                />
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* ==================== AI INSIGHTS ==================== */}
      <CRow className="mb-4">
        <CCol>
          <CCard className="shadow-sm">
            <CCardHeader>
              <strong>🤖 AI Insights</strong>
            </CCardHeader>

            <CCardBody>
              {totalCases === 0 ? (
                <p className="text-body-secondary mb-0">
                  No cases have been added yet. Add a new land acquisition
                  case to generate a delay prediction.
                </p>
              ) : (
                <>
                  <p>
                    <strong>⚠️ High Delay Alert:</strong>{' '}
                    {highCount} land acquisition case
                    {highCount !== 1 ? 's have' : ' has'} a predicted delay
                    of 120 days or more.
                  </p>

                  <hr />

                  <p>
                    <strong>📌 Prediction Factors:</strong>{' '}
                    The prediction model considers factors such as court
                    cases, objections, pending approvals, compensation
                    progress, acquisition stage duration and other project
                    characteristics.
                  </p>

                  <hr />

                  <p className="mb-0">
                    <strong>📈 Monitoring:</strong>{' '}
                    Cases with higher predicted delays can be reviewed and
                    monitored for early intervention.
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
                <p className="text-body-secondary text-center py-4 mb-0">
                  No cases added yet. Go to{' '}
                  <strong>Add New Case</strong> to create your first
                  prediction.
                </p>
              ) : (
                <CTable responsive hover align="middle">
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
                        Delay Category
                      </CTableHeaderCell>

                      <CTableHeaderCell>
                        Predicted Delay
                      </CTableHeaderCell>

                      <CTableHeaderCell className="text-center">
                        Action
                      </CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>

                  <CTableBody>
                    {cases.map((item) => {
                      const delay =
                        Number(item.predicted_delay_days) || 0

                      const category =
                        getDelayCategory(delay)

                      const color =
                        getDelayColor(delay)

                      return (
                        <CTableRow key={item.case_id}>
                          <CTableDataCell>
                            <strong>{item.case_id}</strong>
                          </CTableDataCell>

                          <CTableDataCell>
                            {item.state}
                          </CTableDataCell>

                          <CTableDataCell>
                            {item.district}
                          </CTableDataCell>

                          <CTableDataCell>
                            {item.project_type}
                          </CTableDataCell>

                          <CTableDataCell>
                            <span className={`badge bg-${color}`}>
                              {category}
                            </span>
                          </CTableDataCell>

                          <CTableDataCell>
                            <strong>
                              {delay.toFixed(2)} days
                            </strong>
                          </CTableDataCell>

                          <CTableDataCell className="text-center">
                            <div className="d-flex gap-2 justify-content-center">
                              <CButton
                                color="info"
                                size="sm"
                                onClick={() =>
                                  navigate(
                                    `/view-case/${encodeURIComponent(item.case_id)}`,
                                  )
                                }
                              >
                                👁️ View
                              </CButton>

                              <CButton
                                color="primary"
                                size="sm"
                                onClick={() =>
                                  navigate(
                                    `/edit-case/${encodeURIComponent(item.case_id)}`,
                                  )
                                }
                              >
                                ✏️ Edit
                              </CButton>

                              <CButton
                                color="danger"
                                size="sm"
                                onClick={() =>
                                  handleDelete(item.case_id)
                                }
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
