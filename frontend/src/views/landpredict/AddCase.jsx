import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import {
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
  CAlert,
} from '@coreui/react'

const API_URL = 'http://127.0.0.1:8000'

const AddCase = () => {
  const dispatch = useDispatch()

  const [formData, setFormData] = useState({
    caseId: '',
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
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    setError('')
    setPrediction(null)
    setLoading(true)

    try {
      const requestData = {
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

      const response = await fetch(`${API_URL}/api/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      })

      if (!response.ok) {
        const errorData = await response.json()

        throw new Error(
          errorData.detail
            ? JSON.stringify(errorData.detail)
            : 'Prediction request failed',
        )
      }

      const result = await response.json()

      const predictedDelay = result.predicted_delay_days

      dispatch({
        type: 'ADD_CASE',
        payload: {
          ...formData,
          predictedDelayDays: predictedDelay,
        },
      })

      setPrediction({
        predictedDelayDays: predictedDelay,
      })
    } catch (err) {
      console.error('Prediction error:', err)
      setError(err.message || 'Unable to connect to LANDPREDICT backend.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Add New Land Acquisition Case</strong>
          </CCardHeader>

          <CCardBody>
            <CForm onSubmit={handleSubmit}>
              <CRow>

                <CCol md={6}>
                  <CFormLabel>Case ID</CFormLabel>
                  <CFormInput
                    name="caseId"
                    value={formData.caseId}
                    onChange={handleChange}
                    placeholder="Enter Case ID"
                    required
                  />
                </CCol>

                <CCol md={6}>
                  <CFormLabel>State</CFormLabel>
                  <CFormInput
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="Enter State"
                    required
                  />
                </CCol>

                <CCol md={6} className="mt-3">
                  <CFormLabel>District</CFormLabel>
                  <CFormInput
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    placeholder="Enter District"
                    required
                  />
                </CCol>

                <CCol md={6} className="mt-3">
                  <CFormLabel>Project Type</CFormLabel>
                  <CFormInput
                    name="projectType"
                    value={formData.projectType}
                    onChange={handleChange}
                    placeholder="e.g. Highway"
                    required
                  />
                </CCol>

                <CCol md={6} className="mt-3">
                  <CFormLabel>Land Area (Acres)</CFormLabel>
                  <CFormInput
                    type="number"
                    name="landArea"
                    value={formData.landArea}
                    onChange={handleChange}
                    min="0"
                    required
                  />
                </CCol>

                <CCol md={6} className="mt-3">
                  <CFormLabel>Number of Landowners</CFormLabel>
                  <CFormInput
                    type="number"
                    name="landowners"
                    value={formData.landowners}
                    onChange={handleChange}
                    min="0"
                    required
                  />
                </CCol>

                <CCol md={6} className="mt-3">
                  <CFormLabel>Acquisition Stage</CFormLabel>
                  <CFormSelect
                    name="acquisitionStage"
                    value={formData.acquisitionStage}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Stage</option>
                    <option value="Notification">Notification</option>
                    <option value="Survey">Survey</option>
                    <option value="Compensation">Compensation</option>
                    <option value="Possession">Possession</option>
                    <option value="Completed">Completed</option>
                  </CFormSelect>
                </CCol>

                <CCol md={6} className="mt-3">
                  <CFormLabel>Number of Objections</CFormLabel>
                  <CFormInput
                    type="number"
                    name="objections"
                    value={formData.objections}
                    onChange={handleChange}
                    min="0"
                    required
                  />
                </CCol>

                <CCol md={6} className="mt-3">
                  <CFormLabel>Number of Court Cases</CFormLabel>
                  <CFormInput
                    type="number"
                    name="courtCases"
                    value={formData.courtCases}
                    onChange={handleChange}
                    min="0"
                    required
                  />
                </CCol>

                <CCol md={6} className="mt-3">
                  <CFormLabel>Compensation Completed (%)</CFormLabel>
                  <CFormInput
                    type="number"
                    name="compensation"
                    value={formData.compensation}
                    onChange={handleChange}
                    min="0"
                    max="100"
                    required
                  />
                </CCol>

                <CCol md={6} className="mt-3">
                  <CFormLabel>Pending Approvals</CFormLabel>
                  <CFormInput
                    type="number"
                    name="pendingApprovals"
                    value={formData.pendingApprovals}
                    onChange={handleChange}
                    min="0"
                    required
                  />
                </CCol>

                <CCol md={6} className="mt-3">
                  <CFormLabel>Days in Current Stage</CFormLabel>
                  <CFormInput
                    type="number"
                    name="daysInCurrentStage"
                    value={formData.daysInCurrentStage}
                    onChange={handleChange}
                    min="0"
                    required
                  />
                </CCol>

                <CCol md={6} className="mt-3">
                  <CFormLabel>Sanction Amount (Lakh)</CFormLabel>
                  <CFormInput
                    type="number"
                    name="sanctionAmount"
                    value={formData.sanctionAmount}
                    onChange={handleChange}
                    min="0"
                    required
                  />
                </CCol>

                <CCol md={6} className="mt-3">
                  <CFormLabel>Land Acquisition Agency</CFormLabel>
                  <CFormSelect
                    name="landAcquisitionAgency"
                    value={formData.landAcquisitionAgency}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Agency</option>
                    <option value="NHAI">NHAI</option>
                    <option value="State PWD">State PWD</option>
                    <option value="District Administration">
                      District Administration
                    </option>
                    <option value="Special LA Unit">Special LA Unit</option>
                  </CFormSelect>
                </CCol>

                <CCol md={6} className="mt-3">
                  <CFormLabel>Environmental Clearance</CFormLabel>
                  <CFormSelect
                    name="environmentalClearance"
                    value={formData.environmentalClearance}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Status</option>
                    <option value="Completed">Completed</option>
                    <option value="Pending">Pending</option>
                    <option value="Not Required">Not Required</option>
                  </CFormSelect>
                </CCol>

                <CCol md={6} className="mt-3">
                  <CFormLabel>Forest Clearance</CFormLabel>
                  <CFormSelect
                    name="forestClearance"
                    value={formData.forestClearance}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Status</option>
                    <option value="Completed">Completed</option>
                    <option value="Pending">Pending</option>
                    <option value="Not Required">Not Required</option>
                  </CFormSelect>
                </CCol>

                <CCol md={6} className="mt-3">
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

                <CCol md={6} className="mt-3">
                  <CFormLabel>Structures Affected</CFormLabel>
                  <CFormInput
                    type="number"
                    name="structuresAffected"
                    value={formData.structuresAffected}
                    onChange={handleChange}
                    min="0"
                    required
                  />
                </CCol>

                <CCol md={6} className="mt-3">
                  <CFormLabel>Dispute Severity</CFormLabel>
                  <CFormSelect
                    name="disputeSeverity"
                    value={formData.disputeSeverity}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Severity</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </CFormSelect>
                </CCol>

                <CCol md={6} className="mt-3">
                  <CFormLabel>Payment Status</CFormLabel>
                  <CFormSelect
                    name="paymentStatus"
                    value={formData.paymentStatus}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Status</option>
                    <option value="Partial">Partial</option>
                    <option value="Pending">Pending</option>
                    <option value="Complete">Complete</option>
                  </CFormSelect>
                </CCol>

                <CCol md={6} className="mt-3">
                  <CFormLabel>Document Verification</CFormLabel>
                  <CFormSelect
                    name="documentVerificationStatus"
                    value={formData.documentVerificationStatus}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Status</option>
                    <option value="Partial">Partial</option>
                    <option value="Pending">Pending</option>
                    <option value="Complete">Complete</option>
                  </CFormSelect>
                </CCol>

                <CCol md={6} className="mt-3">
                  <CFormLabel>Project Length (km)</CFormLabel>
                  <CFormInput
                    type="number"
                    name="projectLength"
                    value={formData.projectLength}
                    onChange={handleChange}
                    min="0"
                    required
                  />
                </CCol>

                <CCol md={6} className="mt-3">
                  <CFormLabel>Last Review (Days Ago)</CFormLabel>
                  <CFormInput
                    type="number"
                    name="lastReviewDaysAgo"
                    value={formData.lastReviewDaysAgo}
                    onChange={handleChange}
                    min="0"
                    required
                  />
                </CCol>

                <CCol xs={12} className="mt-4">
                  <CButton
                    color="primary"
                    size="lg"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? 'Predicting...' : 'Predict Delay'}
                  </CButton>
                </CCol>

              </CRow>
            </CForm>

            {error && (
              <CAlert color="danger" className="mt-4">
                <strong>Prediction Error:</strong> {error}
              </CAlert>
            )}

            {prediction && (
              <CCard className="mt-4">
                <CCardHeader>
                  <strong>LANDPREDICT Prediction Result</strong>
                </CCardHeader>

                <CCardBody>
                  <div className="p-4 bg-light rounded text-center">
                    <small className="text-muted">
                      PREDICTED DELAY
                    </small>

                    <h2 className="mt-2">
                      {prediction.predictedDelayDays} days
                    </h2>

                    <p className="text-muted mb-0">
                      Prediction generated by the LANDPREDICT machine-learning
                      model.
                    </p>
                  </div>
                </CCardBody>
              </CCard>
            )}
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default AddCase