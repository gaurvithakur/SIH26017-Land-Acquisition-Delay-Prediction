import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'

import { CButton, CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react'

const ViewCase = () => {
  const { index } = useParams()
  const navigate = useNavigate()

  const cases = useSelector((state) => state.cases)

  // Get selected case
  const selectedCase = cases[Number(index)]

  // Risk color
  const getRiskColor = (risk) => {
    if (risk === 'High') return 'danger'
    if (risk === 'Medium') return 'warning'
    return 'success'
  }

  // If case is not found
  if (!selectedCase) {
    return (
      <CCard>
        <CCardBody>
          <h4>Case not found.</h4>

          <CButton color="primary" onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </CButton>
        </CCardBody>
      </CCard>
    )
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4 shadow-sm">
          <CCardHeader className="d-flex justify-content-between align-items-center">
            <strong>👁️ Land Acquisition Case Details</strong>

            <span className={`badge bg-${getRiskColor(selectedCase.risk)}`}>
              {selectedCase.risk} Risk
            </span>
          </CCardHeader>

          <CCardBody>
            {/* Basic Information */}
            <h5 className="mb-3">📋 Basic Information</h5>

            <CRow className="mb-4">
              <CCol md={4} className="mb-3">
                <strong>Case ID</strong>
                <div className="text-body-secondary">{selectedCase.caseId}</div>
              </CCol>

              <CCol md={4} className="mb-3">
                <strong>State</strong>
                <div className="text-body-secondary">{selectedCase.state}</div>
              </CCol>

              <CCol md={4} className="mb-3">
                <strong>District</strong>
                <div className="text-body-secondary">{selectedCase.district}</div>
              </CCol>

              <CCol md={4} className="mb-3">
                <strong>Project Type</strong>
                <div className="text-body-secondary">{selectedCase.projectType}</div>
              </CCol>

              <CCol md={4} className="mb-3">
                <strong>Land Area</strong>
                <div className="text-body-secondary">{selectedCase.landArea} Acres</div>
              </CCol>

              <CCol md={4} className="mb-3">
                <strong>Number of Landowners</strong>
                <div className="text-body-secondary">{selectedCase.landowners}</div>
              </CCol>

              <CCol md={4} className="mb-3">
                <strong>Acquisition Stage</strong>
                <div className="text-body-secondary">{selectedCase.acquisitionStage}</div>
              </CCol>
            </CRow>

            <hr />

            {/* Risk Analysis Factors */}
            <h5 className="mb-3 mt-4">⚠️ Risk Analysis Factors</h5>

            <CRow className="mb-4">
              <CCol md={4} className="mb-3">
                <strong>Number of Objections</strong>
                <div className="text-body-secondary">{selectedCase.objections}</div>
              </CCol>

              <CCol md={4} className="mb-3">
                <strong>Number of Court Cases</strong>
                <div className="text-body-secondary">{selectedCase.courtCases}</div>
              </CCol>

              <CCol md={4} className="mb-3">
                <strong>Compensation Completed</strong>
                <div className="text-body-secondary">{selectedCase.compensation}%</div>
              </CCol>

              <CCol md={4} className="mb-3">
                <strong>Pending Approvals</strong>
                <div className="text-body-secondary">{selectedCase.pendingApprovals}</div>
              </CCol>

              <CCol md={4} className="mb-3">
                <strong>Days in Current Stage</strong>
                <div className="text-body-secondary">{selectedCase.daysInCurrentStage} Days</div>
              </CCol>
            </CRow>

            <hr />

            {/* Prediction Result */}
            <h5 className="mb-3 mt-4">🤖 LANDPREDICT Prediction</h5>

            <CRow className="mb-4">
              <CCol md={4} className="mb-3">
                <CCard className="h-100 shadow-sm">
                  <CCardBody className="text-center">
                    <small className="text-body-secondary">DELAY RISK</small>

                    <h3 className={`mt-2 text-${getRiskColor(selectedCase.risk)}`}>
                      {selectedCase.risk}
                    </h3>
                  </CCardBody>
                </CCard>
              </CCol>

              <CCol md={4} className="mb-3">
                <CCard className="h-100 shadow-sm">
                  <CCardBody className="text-center">
                    <small className="text-body-secondary">RISK SCORE</small>

                    <h3 className="mt-2">{selectedCase.score}%</h3>
                  </CCardBody>
                </CCard>
              </CCol>

              <CCol md={4} className="mb-3">
                <CCard className="h-100 shadow-sm">
                  <CCardBody className="text-center">
                    <small className="text-body-secondary">EXPECTED DELAY</small>

                    <h5 className="mt-2">{selectedCase.delay}</h5>
                  </CCardBody>
                </CCard>
              </CCol>
            </CRow>

            {/* Major Risk Factors */}
            <CCard className="mb-4">
              <CCardHeader>
                <strong>⚠️ Major Risk Factors</strong>
              </CCardHeader>

              <CCardBody>
                {selectedCase.factors && selectedCase.factors.length > 0 ? (
                  <ul className="mb-0">
                    {selectedCase.factors.map((factor, factorIndex) => (
                      <li key={factorIndex} className="mb-2">
                        {factor}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mb-0 text-body-secondary">No major risk factors detected.</p>
                )}
              </CCardBody>
            </CCard>

            {/* Buttons */}
            <div className="d-flex gap-2">
              <CButton color="primary" onClick={() => navigate(`/edit-case/${index}`)}>
                ✏️ Edit Case
              </CButton>

              <CButton color="secondary" onClick={() => navigate('/dashboard')}>
                ← Back to Dashboard
              </CButton>
            </div>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default ViewCase
