import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  CAlert,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CRow,
  CSpinner,
} from '@coreui/react'

import { apiFetch } from '../../api'

const PredictRisk = () => {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    state: '',
    district: '',
    projectType: '',
    landArea: '',
    landowners: '',
    acquisitionStage: '',
    objections: '',
    courtCases: '',
    compensation: '',
    pendingApprovals: '',
    daysInCurrentStage: '',
    sanctionAmount: '',
    landAcquisitionAgency: '',
    environmentalClearance: '',
    forestClearance: '',
    relocationRequired: '',
    structuresAffected: '',
    disputeSeverity: '',
    paymentStatus: '',
    documentVerificationStatus: '',
    projectLength: '',
    lastReviewDaysAgo: '',
  })

  const [prediction, setPrediction] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const predictDelay = async (e) => {
    e.preventDefault()

    setLoading(true)
    setError('')
    setPrediction(null)

    const payload = {
      state: formData.state,
      district: formData.district,
      project_type: formData.projectType,
      land_area_acres: Number(formData.landArea),
      number_of_landowners: Number(formData.landowners),
      acquisition_stage: formData.acquisitionStage,
      number_of_objections: Number(formData.objections),
      number_of_court_cases: Number(formData.courtCases),
      compensation_completed_pct: Number(formData.compensation),
      pending_approvals: Number(formData.pendingApprovals),
      days_in_current_stage: Number(formData.daysInCurrentStage),
      sanction_amount_lakh: Number(formData.sanctionAmount),
      land_acquisition_agency: formData.landAcquisitionAgency,
      environmental_clearance: formData.environmentalClearance,
      forest_clearance: formData.forestClearance,
      relocation_required: formData.relocationRequired,
      structures_affected: Number(formData.structuresAffected),
      dispute_severity: formData.disputeSeverity,
      payment_status: formData.paymentStatus,
      document_verification_status: formData.documentVerificationStatus,
      project_length_km: Number(formData.projectLength),
      last_review_days_ago: Number(formData.lastReviewDaysAgo),
    }

    try {
      // Authenticated prediction request
      const response = await apiFetch('/api/predict', {
        method: 'POST',
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || 'Prediction request failed.')
      }

      setPrediction(data)
    } catch (err) {
      setError(
        err.message ||
          'Unable to connect to the LANDPREDICT backend. Make sure FastAPI is running.',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4 shadow-sm">
          <CCardHeader>
            <strong>Predict Land Acquisition Delay</strong>
          </CCardHeader>

          <CCardBody>
            <p className="text-body-secondary">
              Enter the land acquisition details to generate an ML-based delay
              prediction.
            </p>

            {error && (
              <CAlert color="danger">
                <strong>Prediction Error:</strong> {error}
              </CAlert>
            )}

            <CForm onSubmit={predictDelay}>
              {/* Basic Information */}
              <h5 className="mb-3">Basic Information</h5>

              <CRow>
                <CCol md={4} className="mb-3">
                  <CFormLabel>State</CFormLabel>
                  <CFormInput
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="Enter state"
                    required
                  />
                </CCol>

                <CCol md={4} className="mb-3">
                  <CFormLabel>District</CFormLabel>
                  <CFormInput
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    placeholder="Enter district"
                    required
                  />
                </CCol>

                <CCol md={4} className="mb-3">
                  <CFormLabel>Project Type</CFormLabel>
                  <CFormInput
                    name="projectType"
                    value={formData.projectType}
                    onChange={handleChange}
                    placeholder="Enter project type"
                    required
                  />
                </CCol>

                <CCol md={4} className="mb-3">
                  <CFormLabel>Land Area (Acres)</CFormLabel>
                  <CFormInput
                    type="number"
                    min="0"
                    step="any"
                    name="landArea"
                    value={formData.landArea}
                    onChange={handleChange}
                    required
                  />
                </CCol>

                <CCol md={4} className="mb-3">
                  <CFormLabel>Number of Landowners</CFormLabel>
                  <CFormInput
                    type="number"
                    min="0"
                    name="landowners"
                    value={formData.landowners}
                    onChange={handleChange}
                    required
                  />
                </CCol>

                <CCol md={4} className="mb-3">
                  <CFormLabel>Acquisition Stage</CFormLabel>
                  <CFormInput
                    name="acquisitionStage"
                    value={formData.acquisitionStage}
                    onChange={handleChange}
                    placeholder="Enter acquisition stage"
                    required
                  />
                </CCol>
              </CRow>

              <hr />

              {/* Acquisition & Delay Factors */}
              <h5 className="mb-3">Acquisition & Delay Factors</h5>

              <CRow>
                <CCol md={4} className="mb-3">
                  <CFormLabel>Number of Objections</CFormLabel>
                  <CFormInput
                    type="number"
                    min="0"
                    name="objections"
                    value={formData.objections}
                    onChange={handleChange}
                    required
                  />
                </CCol>

                <CCol md={4} className="mb-3">
                  <CFormLabel>Number of Court Cases</CFormLabel>
                  <CFormInput
                    type="number"
                    min="0"
                    name="courtCases"
                    value={formData.courtCases}
                    onChange={handleChange}
                    required
                  />
                </CCol>

                <CCol md={4} className="mb-3">
                  <CFormLabel>Compensation Completed (%)</CFormLabel>
                  <CFormInput
                    type="number"
                    min="0"
                    max="100"
                    step="any"
                    name="compensation"
                    value={formData.compensation}
                    onChange={handleChange}
                    required
                  />
                </CCol>

                <CCol md={4} className="mb-3">
                  <CFormLabel>Pending Approvals</CFormLabel>
                  <CFormInput
                    type="number"
                    min="0"
                    name="pendingApprovals"
                    value={formData.pendingApprovals}
                    onChange={handleChange}
                    required
                  />
                </CCol>

                <CCol md={4} className="mb-3">
                  <CFormLabel>Days in Current Stage</CFormLabel>
                  <CFormInput
                    type="number"
                    min="0"
                    name="daysInCurrentStage"
                    value={formData.daysInCurrentStage}
                    onChange={handleChange}
                    required
                  />
                </CCol>

                <CCol md={4} className="mb-3">
                  <CFormLabel>Sanction Amount (Lakh)</CFormLabel>
                  <CFormInput
                    type="number"
                    min="0"
                    step="any"
                    name="sanctionAmount"
                    value={formData.sanctionAmount}
                    onChange={handleChange}
                    required
                  />
                </CCol>
              </CRow>

              <hr />

              {/* Administrative Information */}
              <h5 className="mb-3">Administrative Information</h5>

              <CRow>
                <CCol md={4} className="mb-3">
                  <CFormLabel>Land Acquisition Agency</CFormLabel>
                  <CFormSelect
                    name="landAcquisitionAgency"
                    value={formData.landAcquisitionAgency}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select agency</option>
                    <option value="NHAI">NHAI</option>
                    <option value="State PWD">State PWD</option>
                    <option value="District Administration">
                      District Administration
                    </option>
                    <option value="Special LA Unit">Special LA Unit</option>
                  </CFormSelect>
                </CCol>

                <CCol md={4} className="mb-3">
                  <CFormLabel>Environmental Clearance</CFormLabel>
                  <CFormSelect
                    name="environmentalClearance"
                    value={formData.environmentalClearance}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select status</option>
                    <option value="Completed">Completed</option>
                    <option value="Pending">Pending</option>
                    <option value="Not Required">Not Required</option>
                  </CFormSelect>
                </CCol>

                <CCol md={4} className="mb-3">
                  <CFormLabel>Forest Clearance</CFormLabel>
                  <CFormSelect
                    name="forestClearance"
                    value={formData.forestClearance}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select status</option>
                    <option value="Completed">Completed</option>
                    <option value="Pending">Pending</option>
                    <option value="Not Required">Not Required</option>
                  </CFormSelect>
                </CCol>

                <CCol md={4} className="mb-3">
                  <CFormLabel>Relocation Required</CFormLabel>
                  <CFormSelect
                    name="relocationRequired"
                    value={formData.relocationRequired}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </CFormSelect>
                </CCol>

                <CCol md={4} className="mb-3">
                  <CFormLabel>Structures Affected</CFormLabel>
                  <CFormInput
                    type="number"
                    min="0"
                    name="structuresAffected"
                    value={formData.structuresAffected}
                    onChange={handleChange}
                    required
                  />
                </CCol>

                <CCol md={4} className="mb-3">
                  <CFormLabel>Dispute Severity</CFormLabel>
                  <CFormSelect
                    name="disputeSeverity"
                    value={formData.disputeSeverity}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select severity</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </CFormSelect>
                </CCol>
              </CRow>

              <hr />

              {/* Status Information */}
              <h5 className="mb-3">Status Information</h5>

              <CRow>
                <CCol md={4} className="mb-3">
                  <CFormLabel>Payment Status</CFormLabel>
                  <CFormSelect
                    name="paymentStatus"
                    value={formData.paymentStatus}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select status</option>
                    <option value="Partial">Partial</option>
                    <option value="Pending">Pending</option>
                    <option value="Complete">Complete</option>
                  </CFormSelect>
                </CCol>

                <CCol md={4} className="mb-3">
                  <CFormLabel>Document Verification Status</CFormLabel>
                  <CFormSelect
                    name="documentVerificationStatus"
                    value={formData.documentVerificationStatus}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select status</option>
                    <option value="Partial">Partial</option>
                    <option value="Pending">Pending</option>
                    <option value="Complete">Complete</option>
                  </CFormSelect>
                </CCol>

                <CCol md={4} className="mb-3">
                  <CFormLabel>Project Length (km)</CFormLabel>
                  <CFormInput
                    type="number"
                    min="0"
                    step="any"
                    name="projectLength"
                    value={formData.projectLength}
                    onChange={handleChange}
                    required
                  />
                </CCol>

                <CCol md={4} className="mb-3">
                  <CFormLabel>Last Review (Days Ago)</CFormLabel>
                  <CFormInput
                    type="number"
                    min="0"
                    name="lastReviewDaysAgo"
                    value={formData.lastReviewDaysAgo}
                    onChange={handleChange}
                    required
                  />
                </CCol>
              </CRow>

              <div className="d-flex gap-2 mt-3">
                <CButton
                  color="primary"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <CSpinner size="sm" className="me-2" />
                      Predicting...
                    </>
                  ) : (
                    'Predict Delay'
                  )}
                </CButton>

                <CButton
                  color="secondary"
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  disabled={loading}
                >
                  Back to Dashboard
                </CButton>
              </div>
            </CForm>
          </CCardBody>
        </CCard>

        {/* Prediction Result */}
        {prediction && (
          <CCard className="shadow-sm">
            <CCardHeader>
              <strong>ML Prediction Result</strong>
            </CCardHeader>

            <CCardBody>
              <CRow>
                <CCol md={6} className="mb-3">
                  <CCard className="h-100">
                    <CCardBody className="text-center">
                      <small className="text-body-secondary">
                        PREDICTED DELAY
                      </small>

                      <h1 className="mt-3">
                        {prediction.predicted_delay_days}
                      </h1>

                      <p className="text-body-secondary mb-0">days</p>
                    </CCardBody>
                  </CCard>
                </CCol>

                <CCol md={6} className="mb-3">
                  <CCard className="h-100">
                    <CCardBody>
                      <h5>Prediction Information</h5>

                      <p className="mb-2">
                        The trained LANDPREDICT machine learning model estimates
                        an acquisition delay of:
                      </p>

                      <strong>
                        {prediction.predicted_delay_days} days
                      </strong>

                      <p className="text-body-secondary mt-3 mb-0">
                        This value is the model prediction returned by the
                        backend API.
                      </p>
                    </CCardBody>
                  </CCard>
                </CCol>
              </CRow>

              <CAlert color="info" className="mt-3">
                <strong>Note:</strong> The prediction is generated from the
                trained model using the information entered above. It should
                be interpreted as a model estimate, not a guaranteed outcome.
              </CAlert>

              <CButton
                color="secondary"
                onClick={() => navigate('/dashboard')}
              >
                Back to Dashboard
              </CButton>
            </CCardBody>
          </CCard>
        )}
      </CCol>
    </CRow>
  )
}

export default PredictRisk
