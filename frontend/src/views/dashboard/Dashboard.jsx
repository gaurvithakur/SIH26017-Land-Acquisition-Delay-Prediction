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

  // Get all saved LANDPREDICT cases from Redux
  const cases = useSelector((state) => state.cases)

  // Calculate cases according to risk level
  const highRiskCases = cases.filter((item) => item.risk === 'High')
  const mediumRiskCases = cases.filter((item) => item.risk === 'Medium')
  const lowRiskCases = cases.filter((item) => item.risk === 'Low')

  const totalCases = cases.length
  const highCount = highRiskCases.length
  const mediumCount = mediumRiskCases.length
  const lowCount = lowRiskCases.length

  // Calculate percentages for Risk Overview
  const highPercentage = totalCases ? (highCount / totalCases) * 100 : 0
  const mediumPercentage = totalCases ? (mediumCount / totalCases) * 100 : 0
  const lowPercentage = totalCases ? (lowCount / totalCases) * 100 : 0

  // Get Bootstrap/CoreUI color according to risk
  const getRiskColor = (risk) => {
    if (risk === 'High') return 'danger'
    if (risk === 'Medium') return 'warning'
    return 'success'
  }

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
      {/* Dashboard Heading */}
      <CRow className="mb-4">
        <CCol>
          <h2 className="fw-bold">LANDPREDICT Dashboard</h2>

          <p className="text-body-secondary">
            AI-powered land acquisition delay risk monitoring system
          </p>
        </CCol>
      </CRow>

      {/* Statistics Cards */}
      <CRow className="mb-4">
        <CCol sm={6} lg={3}>
          <CCard className="mb-3 shadow-sm">
            <CCardBody>
              <div className="text-body-secondary">TOTAL CASES</div>

              <div className="fs-2 fw-bold">{totalCases}</div>

              <small className="text-primary">Land acquisition cases</small>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol sm={6} lg={3}>
          <CCard className="mb-3 shadow-sm border-start border-start-4 border-start-danger">
            <CCardBody>
              <div className="text-body-secondary">HIGH RISK CASES</div>

              <div className="fs-2 fw-bold text-danger">{highCount}</div>

              <small className="text-body-secondary">Immediate attention required</small>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol sm={6} lg={3}>
          <CCard className="mb-3 shadow-sm border-start border-start-4 border-start-warning">
            <CCardBody>
              <div className="text-body-secondary">MEDIUM RISK CASES</div>

              <div className="fs-2 fw-bold text-warning">{mediumCount}</div>

              <small className="text-body-secondary">Requires monitoring</small>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol sm={6} lg={3}>
          <CCard className="mb-3 shadow-sm border-start border-start-4 border-start-success">
            <CCardBody>
              <div className="text-body-secondary">LOW RISK CASES</div>

              <div className="fs-2 fw-bold text-success">{lowCount}</div>

              <small className="text-body-secondary">Currently progressing smoothly</small>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Risk Overview and AI Insights */}
      <CRow className="mb-4">
        {/* Risk Overview */}
        <CCol lg={6}>
          <CCard className="h-100 shadow-sm">
            <CCardHeader>
              <strong>📊 Risk Overview</strong>
            </CCardHeader>

            <CCardBody>
              {/* High Risk */}
              <div className="mb-4">
                <div className="d-flex justify-content-between mb-2">
                  <span>🔴 High Risk</span>
                  <strong>{highCount} Cases</strong>
                </div>

                <CProgress color="danger" value={highPercentage} />
              </div>

              {/* Medium Risk */}
              <div className="mb-4">
                <div className="d-flex justify-content-between mb-2">
                  <span>🟡 Medium Risk</span>
                  <strong>{mediumCount} Cases</strong>
                </div>

                <CProgress color="warning" value={mediumPercentage} />
              </div>

              {/* Low Risk */}
              <div>
                <div className="d-flex justify-content-between mb-2">
                  <span>🟢 Low Risk</span>
                  <strong>{lowCount} Cases</strong>
                </div>

                <CProgress color="success" value={lowPercentage} />
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
                  No cases have been added yet. Add a new land acquisition case to generate
                  insights.
                </p>
              ) : (
                <>
                  <p>
                    <strong>⚠️ High Risk Alert:</strong> {highCount} land acquisition case
                    {highCount !== 1 ? 's' : ''} currently require immediate attention.
                  </p>

                  <hr />

                  <p>
                    <strong>📌 Main Delay Factors:</strong> Court cases, objections, pending
                    approvals, compensation progress and long acquisition durations are analysed for
                    risk prediction.
                  </p>

                  <hr />

                  <p>
                    <strong>📈 Recommendation:</strong> Prioritize high-risk cases and monitor
                    medium-risk cases regularly.
                  </p>
                </>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Recent Cases Table */}
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
                      <CTableHeaderCell>Risk Level</CTableHeaderCell>
                      <CTableHeaderCell>Risk Score</CTableHeaderCell>
                      <CTableHeaderCell>Expected Delay</CTableHeaderCell>
                      <CTableHeaderCell className="text-center">Action</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>

                  <CTableBody>
                    {cases.map((item, index) => (
                      <CTableRow key={`${item.caseId}-${index}`}>
                        <CTableDataCell>
                          <strong>{item.caseId}</strong>
                        </CTableDataCell>

                        <CTableDataCell>{item.state}</CTableDataCell>

                        <CTableDataCell>{item.district}</CTableDataCell>

                        <CTableDataCell>{item.projectType}</CTableDataCell>

                        <CTableDataCell>
                          <span className={`badge bg-${getRiskColor(item.risk)}`}>{item.risk}</span>
                        </CTableDataCell>

                        <CTableDataCell>
                          <CProgress color={getRiskColor(item.risk)} value={item.score} />

                          <small>{item.score}%</small>
                        </CTableDataCell>

                        <CTableDataCell>{item.delay}</CTableDataCell>

                        {/* Action Buttons */}
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
                    ))}
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
