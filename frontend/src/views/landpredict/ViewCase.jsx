import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'

import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
} from '@coreui/react'

const ViewCase = () => {
  const { index } = useParams()
  const navigate = useNavigate()

  const cases = useSelector((state) => state.cases)

  // Get selected case
  const selectedCase = cases[Number(index)]

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
          <CCardHeader>
            <strong>👁️ Land Acquisition Case Details</strong>
          </CCardHeader>

          <CCardBody>
            {/* Basic Information */}
            <h5 className="mb-3">📋 Basic Information</h5>

            <CRow className="mb-4">
              <CCol md={4} className="mb-3">
                <strong>Case ID</strong>
                <div className="text-body-secondary">
                  {selectedCase.caseId}
                </div>
              </CCol>

              <CCol md={4} className="mb-3">
                <strong>State</strong>
                <div className="text-body-secondary">
                  {selectedCase.state}
                </div>
              </CCol>

              <CCol md={4} className="mb-3">
                <strong>District</strong>
                <div className="text-body-secondary">
                  {selectedCase.district}
                </div>
              </CCol>

              <CCol md={4} className="mb-3">
                <strong>Project Type</strong>
                <div className="text-body-secondary">
                  {selectedCase.projectType}
                </div>
              </CCol>

              <CCol md={4} className="mb-3">
                <strong>Land Area</strong>
                <div className="text-body-secondary">
                  {selectedCase.landArea} Acres
                </div>
              </CCol>

              <CCol md={4} className="mb-3">
                <strong>Number of Landowners</strong>
                <div className="text-body-secondary">
                  {selectedCase.landowners}
                </div>
              </CCol>

              <CCol md={4} className="mb-3">
                <strong>Acquisition Stage</strong>
                <div className="text-body-secondary">
                  {selectedCase.acquisitionStage}
                </div>
              </CCol>
            </CRow>

            <hr />

            {/* Acquisition Factors */}
            <h5 className="mb-3 mt-4">⚠️ Acquisition Factors</h5>

            <CRow className="mb-4">
              <CCol md={4} className="mb-3">
                <strong>Number of Objections</strong>
                <div className="text-body-secondary">
                  {selectedCase.objections}
                </div>
              </CCol>

              <CCol md={4} className="mb-3">
                <strong>Number of Court Cases</strong>
                <div className="text-body-secondary">
                  {selectedCase.courtCases}
                </div>
              </CCol>

              <CCol md={4} className="mb-3">
                <strong>Compensation Completed</strong>
                <div className="text-body-secondary">
                  {selectedCase.compensation}%
                </div>
              </CCol>

              <CCol md={4} className="mb-3">
                <strong>Pending Approvals</strong>
                <div className="text-body-secondary">
                  {selectedCase.pendingApprovals}
                </div>
              </CCol>

              <CCol md={4} className="mb-3">
                <strong>Days in Current Stage</strong>
                <div className="text-body-secondary">
                  {selectedCase.daysInCurrentStage} Days
                </div>
              </CCol>

              <CCol md={4} className="mb-3">
                <strong>Sanction Amount</strong>
                <div className="text-body-secondary">
                  {selectedCase.sanctionAmount} Lakh
                </div>
              </CCol>

              <CCol md={4} className="mb-3">
                <strong>Structures Affected</strong>
                <div className="text-body-secondary">
                  {selectedCase.structuresAffected}
                </div>
              </CCol>

              <CCol md={4} className="mb-3">
                <strong>Dispute Severity</strong>
                <div className="text-body-secondary">
                  {selectedCase.disputeSeverity}
                </div>
              </CCol>

              <CCol md={4} className="mb-3">
                <strong>Relocation Required</strong>
                <div className="text-body-secondary">
                  {selectedCase.relocationRequired}
                </div>
              </CCol>
            </CRow>

            <hr />

            {/* Prediction Result */}
            <h5 className="mb-3 mt-4">🤖 LANDPREDICT Prediction</h5>

            <CCard className="mb-4 shadow-sm">
              <CCardBody className="text-center">
                <small className="text-body-secondary">
                  PREDICTED DELAY
                </small>

                <h2 className="mt-2">
                  {selectedCase.predictedDelayDays !== undefined &&
                  selectedCase.predictedDelayDays !== null
                    ? `${selectedCase.predictedDelayDays} Days`
                    : 'Not predicted'}
                </h2>

                <p className="text-body-secondary mb-0">
                  Estimated by the LANDPREDICT machine learning model.
                </p>
              </CCardBody>
            </CCard>

            {/* Status Information */}
            <h5 className="mb-3 mt-4">📄 Status Information</h5>

            <CRow className="mb-4">
              <CCol md={4} className="mb-3">
                <strong>Land Acquisition Agency</strong>
                <div className="text-body-secondary">
                  {selectedCase.landAcquisitionAgency}
                </div>
              </CCol>

              <CCol md={4} className="mb-3">
                <strong>Environmental Clearance</strong>
                <div className="text-body-secondary">
                  {selectedCase.environmentalClearance}
                </div>
              </CCol>

              <CCol md={4} className="mb-3">
                <strong>Forest Clearance</strong>
                <div className="text-body-secondary">
                  {selectedCase.forestClearance}
                </div>
              </CCol>

              <CCol md={4} className="mb-3">
                <strong>Payment Status</strong>
                <div className="text-body-secondary">
                  {selectedCase.paymentStatus}
                </div>
              </CCol>

              <CCol md={4} className="mb-3">
                <strong>Document Verification</strong>
                <div className="text-body-secondary">
                  {selectedCase.documentVerificationStatus}
                </div>
              </CCol>

              <CCol md={4} className="mb-3">
                <strong>Project Length</strong>
                <div className="text-body-secondary">
                  {selectedCase.projectLength} KM
                </div>
              </CCol>

              <CCol md={4} className="mb-3">
                <strong>Last Review</strong>
                <div className="text-body-secondary">
                  {selectedCase.lastReviewDaysAgo} Days Ago
                </div>
              </CCol>
            </CRow>

            {/* Buttons */}
            <div className="d-flex gap-2">
              <CButton
                color="primary"
                onClick={() => navigate(`/edit-case/${index}`)}
              >
                ✏️ Edit Case
              </CButton>

              <CButton
                color="secondary"
                onClick={() => navigate('/dashboard')}
              >
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
