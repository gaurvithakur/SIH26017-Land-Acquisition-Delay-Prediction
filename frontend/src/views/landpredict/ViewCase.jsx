import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CSpinner,
} from '@coreui/react'

import { apiFetch } from '../../api'

const ViewCase = () => {
  const { caseId } = useParams()
  const navigate = useNavigate()

  const [selectedCase, setSelectedCase] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadCase = async () => {
      try {
        setLoading(true)
        setError('')

        const response = await apiFetch(
          `/api/cases/${encodeURIComponent(caseId)}`,
        )

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.detail || 'Failed to load case.')
        }

        setSelectedCase(data)
      } catch (err) {
        console.error(err)
        setError(err.message || 'Unable to load case.')
      } finally {
        setLoading(false)
      }
    }

    if (caseId) {
      loadCase()
    }
  }, [caseId])

  if (loading) {
    return (
      <div className="text-center py-5">
        <CSpinner color="primary" />

        <div className="mt-3 text-body-secondary">
          Loading case details...
        </div>
      </div>
    )
  }

  if (error || !selectedCase) {
    return (
      <CCard>
        <CCardBody>
          <h4>Case not found.</h4>

          {error && (
            <p className="text-danger">
              {error}
            </p>
          )}

          <CButton
            color="primary"
            onClick={() => navigate('/dashboard')}
          >
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

            {/* ================= BASIC INFORMATION ================= */}

            <h5 className="mb-3">
              📋 Basic Information
            </h5>

            <CRow className="mb-4">

              <CCol md={4} className="mb-3">
                <strong>Case ID</strong>

                <div className="text-body-secondary">
                  {selectedCase.case_id}
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
                  {selectedCase.project_type}
                </div>
              </CCol>

              <CCol md={4} className="mb-3">
                <strong>Land Area</strong>

                <div className="text-body-secondary">
                  {selectedCase.land_area_acres} Acres
                </div>
              </CCol>

              <CCol md={4} className="mb-3">
                <strong>Number of Landowners</strong>

                <div className="text-body-secondary">
                  {selectedCase.number_of_landowners}
                </div>
              </CCol>

              <CCol md={4} className="mb-3">
                <strong>Acquisition Stage</strong>

                <div className="text-body-secondary">
                  {selectedCase.acquisition_stage}
                </div>
              </CCol>

            </CRow>

            <hr />

            {/* ================= ACQUISITION FACTORS ================= */}

            <h5 className="mb-3 mt-4">
              ⚠️ Acquisition Factors
            </h5>

            <CRow className="mb-4">

              <CCol md={4} className="mb-3">
                <strong>Number of Objections</strong>

                <div className="text-body-secondary">
                  {selectedCase.number_of_objections}
                </div>
              </CCol>

              <CCol md={4} className="mb-3">
                <strong>Number of Court Cases</strong>

                <div className="text-body-secondary">
                  {selectedCase.number_of_court_cases}
                </div>
              </CCol>

              <CCol md={4} className="mb-3">
                <strong>Compensation Completed</strong>

                <div className="text-body-secondary">
                  {selectedCase.compensation_completed_pct}%
                </div>
              </CCol>

              <CCol md={4} className="mb-3">
                <strong>Pending Approvals</strong>

                <div className="text-body-secondary">
                  {selectedCase.pending_approvals}
                </div>
              </CCol>

              <CCol md={4} className="mb-3">
                <strong>Days in Current Stage</strong>

                <div className="text-body-secondary">
                  {selectedCase.days_in_current_stage} Days
                </div>
              </CCol>

              <CCol md={4} className="mb-3">
                <strong>Sanction Amount</strong>

                <div className="text-body-secondary">
                  {selectedCase.sanction_amount_lakh} Lakh
                </div>
              </CCol>

              <CCol md={4} className="mb-3">
                <strong>Structures Affected</strong>

                <div className="text-body-secondary">
                  {selectedCase.structures_affected}
                </div>
              </CCol>

              <CCol md={4} className="mb-3">
                <strong>Dispute Severity</strong>

                <div className="text-body-secondary">
                  {selectedCase.dispute_severity}
                </div>
              </CCol>

              <CCol md={4} className="mb-3">
                <strong>Relocation Required</strong>

                <div className="text-body-secondary">
                  {selectedCase.relocation_required}
                </div>
              </CCol>

            </CRow>

            <hr />

            {/* ================= PREDICTION ================= */}

            <h5 className="mb-3 mt-4">
              🤖 LANDPREDICT Prediction
            </h5>

            <CCard className="mb-4 shadow-sm">

              <CCardBody className="text-center">

                <small className="text-body-secondary">
                  PREDICTED DELAY
                </small>

                <h2 className="mt-2">

                  {selectedCase.predicted_delay_days !== null &&
                  selectedCase.predicted_delay_days !== undefined
                    ? `${selectedCase.predicted_delay_days} Days`
                    : 'Not predicted'}

                </h2>

                <p className="text-body-secondary mb-0">
                  Estimated by the LANDPREDICT machine learning model.
                </p>

              </CCardBody>

            </CCard>

            {/* ================= STATUS ================= */}

            <h5 className="mb-3 mt-4">
              📄 Status Information
            </h5>

            <CRow className="mb-4">

              <CCol md={4} className="mb-3">
                <strong>Land Acquisition Agency</strong>

                <div className="text-body-secondary">
                  {selectedCase.land_acquisition_agency}
                </div>
              </CCol>

              <CCol md={4} className="mb-3">
                <strong>Environmental Clearance</strong>

                <div className="text-body-secondary">
                  {selectedCase.environmental_clearance}
                </div>
              </CCol>

              <CCol md={4} className="mb-3">
                <strong>Forest Clearance</strong>

                <div className="text-body-secondary">
                  {selectedCase.forest_clearance}
                </div>
              </CCol>

              <CCol md={4} className="mb-3">
                <strong>Payment Status</strong>

                <div className="text-body-secondary">
                  {selectedCase.payment_status}
                </div>
              </CCol>

              <CCol md={4} className="mb-3">
                <strong>Document Verification</strong>

                <div className="text-body-secondary">
                  {selectedCase.document_verification_status}
                </div>
              </CCol>

              <CCol md={4} className="mb-3">
                <strong>Project Length</strong>

                <div className="text-body-secondary">
                  {selectedCase.project_length_km} KM
                </div>
              </CCol>

              <CCol md={4} className="mb-3">
                <strong>Last Review</strong>

                <div className="text-body-secondary">
                  {selectedCase.last_review_days_ago} Days Ago
                </div>
              </CCol>

            </CRow>

            {/* ================= ACTION BUTTONS ================= */}

            <div className="d-flex gap-2">

              <CButton
                color="primary"
                onClick={() =>
                  navigate(
                    `/edit-case/${encodeURIComponent(
                      selectedCase.case_id,
                    )}`,
                  )
                }
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
