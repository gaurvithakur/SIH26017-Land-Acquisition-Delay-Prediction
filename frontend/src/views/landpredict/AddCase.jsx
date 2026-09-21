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
import { apiFetch } from '../../api'

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
      // --------------------------------------------------
      // STEP 1: Prepare data for ML prediction
      // --------------------------------------------------
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

      // --------------------------------------------------
      // STEP 2: Get prediction from ML model
      // --------------------------------------------------
      const predictionResponse = await apiFetch('/api/predict', {
        method: 'POST',
        body: JSON.stringify(requestData),
      })

      if (!predictionResponse.ok) {
        const errorData = await predictionResponse.json()

        throw new Error(
          errorData.detail
            ? JSON.stringify(errorData.detail)
            : 'Prediction request failed',
        )
      }

      const predictionResult = await predictionResponse.json()

      const predictedDelay = predictionResult.predicted_delay_days

      // --------------------------------------------------
      // STEP 3: Prepare complete case data
      // --------------------------------------------------
      const caseData = {
        case_id: formData.caseId,
        ...requestData,
        predicted_delay_days: predictedDelay,
      }

      // --------------------------------------------------
      // STEP 4: Save case to PostgreSQL
      // --------------------------------------------------
      const saveResponse = await apiFetch('/api/cases/', {
        method: 'POST',
        body: JSON.stringify(caseData),
      })

      if (!saveResponse.ok) {
        const errorData = await saveResponse.json()

        throw new Error(
          errorData.detail
            ? JSON.stringify(errorData.detail)
            : 'Failed to save case',
        )
      }

      const savedCase = await saveResponse.json()

      // --------------------------------------------------
      // STEP 5: Update Redux
      // --------------------------------------------------
      dispatch({
        type: 'ADD_CASE',
        payload: {
          ...formData,
          predictedDelayDays: savedCase.predicted_delay_days,
        },
      })

      // --------------------------------------------------
      // STEP 6: Display prediction
      // --------------------------------------------------
      setPrediction({
        predictedDelayDays: savedCase.predicted_delay_days,
      })

      console.log('Case saved successfully:', savedCase)
    } catch (err) {
      console.error('Add case error:', err)

      setError(err.message || 'Unable to save case.')
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
                {/* Case ID */}
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

                {/* State */}
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

                {/* District */}
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

                {/* Project Type */}
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

                {/* Land Area */}
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

                {/* Landowners */}
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

                {/* Acquisition Stage */}
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

                {/* Objections */}
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

                {/* Court Cases */}
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

                {/* Compensation */}
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

                {/* Pending Approvals */}
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

                {/* Days in Current Stage */}
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

                {/* Sanction Amount */}
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

                {/* Land Acquisition Agency */}
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

                {/* Environmental Clearance */}
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

                {/* Forest Clearance */}
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

                {/* Relocation */}
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

                {/* Structures */}
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

                {/* Dispute Severity */}
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

                {/* Payment Status */}
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

                {/* Document Verification */}
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

                {/* Project Length */}
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

                {/* Last Review */}
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

                {/* Submit */}
                <CCol xs={12} className="mt-4">
                  <CButton
                    color="primary"
                    size="lg"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : 'Predict & Save Case'}
                  </CButton>
                </CCol>
              </CRow>
            </CForm>

            {/* Error */}
            {error && (
              <CAlert color="danger" className="mt-4">
                <strong>Error:</strong> {error}
              </CAlert>
            )}

            {/* Prediction Result */}
            {prediction && (
              <CCard className="mt-4">
                <CCardHeader>
                  <strong>LANDPREDICT Prediction Result</strong>
                </CCardHeader>

                <CCardBody>
                  <div className="p-4 bg-light rounded text-center">
                    <small className="text-muted">PREDICTED DELAY</small>

                    <h2 className="mt-2">
                      {prediction.predictedDelayDays} days
                    </h2>

                    <p className="text-muted mb-0">
                      Prediction generated by the LANDPREDICT machine-learning
                      model and the case has been saved successfully.
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