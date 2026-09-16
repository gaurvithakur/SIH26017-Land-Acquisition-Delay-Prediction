import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'

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
} from '@coreui/react'

const API_URL = 'http://127.0.0.1:8000'

const EditCase = () => {
  const { index } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const cases = useSelector((state) => state.cases)
  const selectedCase = cases[Number(index)]

  const [formData, setFormData] = useState({
    caseId: selectedCase?.caseId || '',
    state: selectedCase?.state || '',
    district: selectedCase?.district || '',
    projectType: selectedCase?.projectType || '',
    landArea: selectedCase?.landArea || '',
    landowners: selectedCase?.landowners || '',
    acquisitionStage: selectedCase?.acquisitionStage || '',
    objections: selectedCase?.objections || '',
    courtCases: selectedCase?.courtCases || '',
    compensation: selectedCase?.compensation || '',
    pendingApprovals: selectedCase?.pendingApprovals || '',
    daysInCurrentStage: selectedCase?.daysInCurrentStage || '',
    sanctionAmount: selectedCase?.sanctionAmount || '',
    landAcquisitionAgency: selectedCase?.landAcquisitionAgency || '',
    environmentalClearance: selectedCase?.environmentalClearance || '',
    forestClearance: selectedCase?.forestClearance || '',
    relocationRequired: selectedCase?.relocationRequired || '',
    structuresAffected: selectedCase?.structuresAffected || '',
    disputeSeverity: selectedCase?.disputeSeverity || '',
    paymentStatus: selectedCase?.paymentStatus || '',
    documentVerificationStatus:
      selectedCase?.documentVerificationStatus || '',
    projectLength: selectedCase?.projectLength || '',
    lastReviewDaysAgo: selectedCase?.lastReviewDaysAgo || '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    setLoading(true)
    setError('')

    try {
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
        document_verification_status:
          formData.documentVerificationStatus,
        project_length_km: Number(formData.projectLength),
        last_review_days_ago: Number(formData.lastReviewDaysAgo),
      }

      const response = await fetch(`${API_URL}/api/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error('Prediction request failed.')
      }

      const prediction = await response.json()

      const updatedCase = {
        ...formData,
        predictedDelayDays: prediction.predicted_delay_days,
      }

      dispatch({
        type: 'UPDATE_CASE',
        payload: {
          index: Number(index),
          updatedCase,
        },
      })

      alert('Case updated and prediction generated successfully!')

      navigate('/all-cases')
    } catch (err) {
      console.error(err)
      setError(
        'Unable to generate prediction. Make sure the backend is running.'
      )
    } finally {
      setLoading(false)
    }
  }

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
        <CCard className="mb-4">
          <CCardHeader>
            <strong>✏️ Edit Land Acquisition Case</strong>
          </CCardHeader>

          <CCardBody>
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            <CForm onSubmit={handleSubmit}>
              <CRow>
                {/* Case ID */}
                <CCol md={6}>
                  <CFormLabel>Case ID</CFormLabel>
                  <CFormInput
                    name="caseId"
                    value={formData.caseId}
                    onChange={handleChange}
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
                    required
                  />
                </CCol>

                {/* Land Area */}
                <CCol md={6} className="mt-3">
                  <CFormLabel>Land Area (Acres)</CFormLabel>
                  <CFormInput
                    type="number"
                    min="0"
                    name="landArea"
                    value={formData.landArea}
                    onChange={handleChange}
                    required
                  />
                </CCol>

                {/* Landowners */}
                <CCol md={6} className="mt-3">
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

                {/* Acquisition Stage */}
                <CCol md={6} className="mt-3">
                  <CFormLabel>Acquisition Stage</CFormLabel>
                  <CFormInput
                    name="acquisitionStage"
                    value={formData.acquisitionStage}
                    onChange={handleChange}
                    required
                  />
                </CCol>

                {/* Objections */}
                <CCol md={6} className="mt-3">
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

                {/* Court Cases */}
                <CCol md={6} className="mt-3">
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

                {/* Compensation */}
                <CCol md={6} className="mt-3">
                  <CFormLabel>Compensation Completed (%)</CFormLabel>
                  <CFormInput
                    type="number"
                    min="0"
                    max="100"
                    name="compensation"
                    value={formData.compensation}
                    onChange={handleChange}
                    required
                  />
                </CCol>

                {/* Pending Approvals */}
                <CCol md={6} className="mt-3">
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

                {/* Days in Current Stage */}
                <CCol md={6} className="mt-3">
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

                {/* Sanction Amount */}
                <CCol md={6} className="mt-3">
                  <CFormLabel>Sanction Amount (Lakh)</CFormLabel>
                  <CFormInput
                    type="number"
                    min="0"
                    name="sanctionAmount"
                    value={formData.sanctionAmount}
                    onChange={handleChange}
                    required
                  />
                </CCol>

                {/* Agency */}
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
                    min="0"
                    name="structuresAffected"
                    value={formData.structuresAffected}
                    onChange={handleChange}
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
                  <CFormLabel>Document Verification Status</CFormLabel>
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
                  <CFormLabel>Project Length (KM)</CFormLabel>
                  <CFormInput
                    type="number"
                    min="0"
                    name="projectLength"
                    value={formData.projectLength}
                    onChange={handleChange}
                    required
                  />
                </CCol>

                {/* Last Review */}
                <CCol md={6} className="mt-3">
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

                {/* Buttons */}
                <CCol xs={12} className="mt-4">
                  <CButton
                    color="primary"
                    type="submit"
                    className="me-2"
                    disabled={loading}
                  >
                    {loading
                      ? '⏳ Generating Prediction...'
                      : '💾 Update Case & Prediction'}
                  </CButton>

                  <CButton
                    color="secondary"
                    type="button"
                    onClick={() => navigate('/all-cases')}
                  >
                    Cancel
                  </CButton>
                </CCol>
              </CRow>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default EditCase

